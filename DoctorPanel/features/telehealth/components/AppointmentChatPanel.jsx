"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, FileText, Image as ImageIcon, ArrowDown, Lock, Sparkles } from "lucide-react";
import {
  useAppointmentChat,
  useAppointmentChatSocket,
  useMarkAppointmentChatRead,
  useSendAppointmentMessage,
  useUploadChatAttachment,
  mapChatMessage,
  getChatParticipantLabels,
} from "@/lib/hooks/useTelehealth";

function MessageBubble({ message, dark }) {
  if (message.isSystem) {
    return (
      <div className="text-center py-1.5">
        <span className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-full px-3 py-0.5 inline-block font-medium">
          {message.text}
        </span>
      </div>
    );
  }

  const senderLabel = message.isMine ? "Doctor" : message.senderName || "Patient";

  return (
    <div className={`flex ${message.isMine ? "justify-end" : "justify-start"} my-1`}>
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-xl px-3.5 py-2.5 shadow-2xs text-xs leading-relaxed ${
          message.isMine
            ? "bg-teal-700 text-white rounded-br-2xs"
            : dark
              ? "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-2xs"
              : "bg-slate-100 text-slate-800 border border-slate-200/60 rounded-bl-2xs"
        }`}
      >
        <p className={`text-[10px] font-semibold tracking-wider uppercase mb-1 ${message.isMine ? "text-teal-200" : "text-slate-400"}`}>
          {senderLabel}
        </p>
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium underline ${
              message.isMine ? "text-teal-100 hover:text-white" : "text-teal-700 hover:text-teal-800"
            }`}
          >
            {message.type === "image" ? <ImageIcon size={14} /> : <FileText size={14} />}
            View attachment
          </a>
        )}
        <p className={`text-[9px] font-mono mt-1 text-right ${message.isMine ? "text-teal-200/80" : "text-slate-400"}`}>
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : ""}
        </p>
      </div>
    </div>
  );
}

export function AppointmentChatPanel({
  appointmentId,
  currentUserId,
  authMode,
  compact = false,
  dark = false,
}) {
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);

  const { data, isLoading } = useAppointmentChat(appointmentId, { auth: authMode });
  useAppointmentChatSocket(appointmentId, authMode);
  const sendMessage = useSendAppointmentMessage(appointmentId, authMode);
  const markRead = useMarkAppointmentChatRead(appointmentId, authMode);
  const uploadAttachment = useUploadChatAttachment();

  const access = data?.access;
  const readOnly = access?.readOnly || !access?.allowed;
  const participantLabels = getChatParticipantLabels(data?.appointment, authMode);
  const messages = (data?.messages || [])
    .map((item) => mapChatMessage(item, currentUserId, participantLabels))
    .filter(Boolean);

  useEffect(() => {
    if (access?.allowed && !readOnly) {
      markRead.mutate();
    }
  }, [access?.allowed, readOnly, messages.length]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowScrollDown(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isUpward = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollDown(isUpward);
    }
  };

  const handleSend = async () => {
    if (!draft.trim() || readOnly) return;
    try {
      await sendMessage.mutateAsync({ message: draft.trim(), message_type: "text" });
      setDraft("");
      scrollToBottom();
    } catch {
      // toast handled upstream
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || readOnly) return;

    try {
      const url = await uploadAttachment.mutateAsync(file);
      const message_type = file.type.startsWith("image/")
        ? "image"
        : file.type.includes("pdf")
          ? "pdf"
          : "lab_report";
      await sendMessage.mutateAsync({
        message: file.name,
        message_type,
        attachment_url: url,
      });
      scrollToBottom();
    } finally {
      event.target.value = "";
    }
  };

  const containerClass = dark
    ? "bg-slate-900 border border-slate-800 text-white"
    : "bg-white border border-slate-200/80 shadow-2xs";

  return (
    <div className={`rounded-xl p-4 flex flex-col relative ${containerClass} ${compact ? "h-[380px]" : "h-[500px]"}`}>
      {/* Header */}
      <div className="pb-3 mb-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
            Clinical Chat Communication
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Secure messaging with {participantLabels.panelTitle || "Patient"}
          </p>
        </div>
        {readOnly && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            <Lock size={10} /> Ended
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-1 space-y-2 relative"
      >
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400">
            <Sparkles size={20} className="text-slate-300 mb-1.5" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No messages yet</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Messages exchanged during this consultation will appear here.
            </p>
          </div>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} dark={dark} />)
        )}
      </div>

      {/* New Message Scroll Indicator */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 right-6 z-10 bg-teal-700 text-white p-1.5 rounded-full shadow-md text-xs flex items-center gap-1 hover:bg-teal-800 transition-all"
        >
          <ArrowDown size={14} />
        </button>
      )}

      {/* Message Input / Read-Only Banner */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
        {readOnly ? (
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Consultation chat has ended.
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              disabled={uploadAttachment.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Attach File"
            >
              <Paperclip size={18} />
            </button>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a clinical message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white resize-none"
            />
            <button
              type="button"
              disabled={sendMessage.isPending || !draft.trim()}
              onClick={handleSend}
              className="p-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0 shadow-2xs"
              title="Send Message"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

