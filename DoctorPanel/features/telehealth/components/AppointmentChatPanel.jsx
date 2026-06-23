"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneTilt, Paperclip, FilePdf, Image as ImageIcon } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  useAppointmentChat,
  useAppointmentChatSocket,
  useMarkAppointmentChatRead,
  useSendAppointmentMessage,
  useUploadChatAttachment,
  mapChatMessage,
  getChatParticipantLabels,
} from "@/lib/hooks/useTelehealth";

function MessageBubble({ message }) {
  if (message.isSystem) {
    return (
      <div className="text-center py-2">
        <p className="text-[12px] text-neutral-500 bg-neutral-100 rounded-full px-3 py-1 inline-block">
          {message.text}
        </p>
      </div>
    );
  }

  const senderLabel = message.isMine ? "You" : message.senderName || "Participant";

  return (
    <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-[14px] px-4 py-3 ${
          message.isMine
            ? "bg-[var(--color-brand-primary)] text-white"
            : "bg-neutral-100 text-neutral-800"
        }`}
      >
        <p className="text-[10px] uppercase tracking-wide opacity-70 mb-1">{senderLabel}</p>
        {message.text && <p className="text-[14px] whitespace-pre-wrap">{message.text}</p>}
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 mt-2 text-[13px] underline ${
              message.isMine ? "text-white" : "text-[var(--color-brand-primary)]"
            }`}
          >
            {message.type === "image" ? <ImageIcon size={16} /> : <FilePdf size={16} />}
            View attachment
          </a>
        )}
        <p className={`text-[10px] mt-1 ${message.isMine ? "text-white/70" : "text-neutral-400"}`}>
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!draft.trim() || readOnly) return;
    try {
      await sendMessage.mutateAsync({ message: draft.trim(), message_type: "text" });
      setDraft("");
    } catch {
      // toast handled by caller if needed
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
    } finally {
      event.target.value = "";
    }
  };

  const containerClass = dark
    ? "bg-white/5 border border-white/10 text-white"
    : "bg-white border border-neutral-200";

  return (
    <div className={`rounded-[16px] p-4 ${containerClass} ${compact ? "" : "min-h-[420px] flex flex-col"}`}>
      <div className="mb-3">
        <h3 className={`font-bold text-[15px] ${dark ? "text-white" : "text-ink-headline"}`}>
          {participantLabels.panelTitle}
        </h3>
        {access && !access.allowed && !access.readOnly && (
          <p className={`text-[12px] mt-1 ${dark ? "text-white/60" : "text-neutral-500"}`}>{access.reason}</p>
        )}
        {access?.readOnly && (
          <p className={`text-[12px] mt-1 ${dark ? "text-white/60" : "text-neutral-500"}`}>{access.reason}</p>
        )}
        {access?.allowed && !readOnly && (
          <p className={`text-[12px] mt-1 ${dark ? "text-white/60" : "text-neutral-500"}`}>
            Chat is open for this appointment. Share reports, images, or questions here.
          </p>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto space-y-3 mb-3 ${compact ? "max-h-[260px]" : "max-h-[360px]"}`}
      >
        {isLoading ? (
          <p className={dark ? "text-white/50 text-[13px]" : "text-neutral-500 text-[13px]"}>Loading chat...</p>
        ) : messages.length === 0 ? (
          <p className={dark ? "text-white/50 text-[13px]" : "text-neutral-500 text-[13px]"}>
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      {!readOnly && access?.allowed && (
        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="secondary"
            className="shrink-0 px-3"
            disabled={uploadAttachment.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className={dark ? "bg-neutral-900 border-white/10 text-white" : ""}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="button"
            className="shrink-0 px-3"
            disabled={sendMessage.isPending || !draft.trim()}
            onClick={handleSend}
          >
            <PaperPlaneTilt size={18} weight="fill" />
          </Button>
        </div>
      )}
    </div>
  );
}
