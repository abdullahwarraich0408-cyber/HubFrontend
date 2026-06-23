"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { telehealthApi, uploadApi } from "@/lib/api/index";
import { getSocket } from "@/lib/socket";

function appendChatMessage(old, message) {
  if (!old || !message) return old;
  if (old.messages?.some((item) => item.id === message.id)) return old;
  return { ...old, messages: [...(old.messages || []), message] };
}

export function useAppointmentChat(appointmentId, options = {}) {
  const { auth, poll, ...queryOptions } = options;
  return useQuery({
    queryKey: ["appointment-chat", appointmentId],
    queryFn: () => telehealthApi.getChat(appointmentId, auth ? { auth } : {}),
    enabled: Boolean(appointmentId),
    refetchInterval: poll ? 4000 : false,
    ...queryOptions,
  });
}

export function useAppointmentChatSocket(appointmentId, authMode) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!appointmentId) return undefined;

    const socket = getSocket(authMode);
    if (!socket) return undefined;

    const joinChat = () => {
      socket.emit("join-chat", { appointmentId });
    };

    const onNewMessage = ({ appointmentId: eventAppointmentId, message }) => {
      if (eventAppointmentId !== appointmentId || !message) return;
      queryClient.setQueryData(["appointment-chat", appointmentId], (old) =>
        appendChatMessage(old, message)
      );
    };

    if (socket.connected) {
      joinChat();
    } else {
      socket.on("connect", joinChat);
    }
    socket.on("new-message", onNewMessage);

    return () => {
      socket.emit("leave-chat", { appointmentId });
      socket.off("connect", joinChat);
      socket.off("new-message", onNewMessage);
    };
  }, [appointmentId, authMode, queryClient]);
}

export function useSendAppointmentMessage(appointmentId, authMode) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      telehealthApi.sendMessage(appointmentId, payload, authMode ? { auth: authMode } : {}),
    onSuccess: (data) => {
      const message = data?.message ?? data;
      queryClient.setQueryData(["appointment-chat", appointmentId], (old) =>
        appendChatMessage(old, message)
      );
    },
  });
}

export function useMarkAppointmentChatRead(appointmentId, authMode) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      telehealthApi.markRead(appointmentId, authMode ? { auth: authMode } : {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-chat", appointmentId] });
    },
  });
}

export function useAppointmentVideoAccess(appointmentId, options = {}) {
  const { auth, ...queryOptions } = options;
  return useQuery({
    queryKey: ["appointment-video", appointmentId],
    queryFn: () => telehealthApi.getVideoAccess(appointmentId, auth ? { auth } : {}),
    enabled: Boolean(appointmentId),
    ...queryOptions,
  });
}

export function useUploadChatAttachment() {
  return useMutation({
    mutationFn: async (file) => {
      const isImage = file.type.startsWith("image/");
      const response = isImage
        ? await uploadApi.uploadImage(file)
        : await uploadApi.uploadDocument(file);
      return response.url;
    },
  });
}

export function formatDoctorDisplayName(name) {
  if (!name) return "Doctor";
  const trimmed = String(name).trim();
  if (/^dr\.?\s/i.test(trimmed)) return trimmed;
  return `Dr. ${trimmed}`;
}

export function getChatParticipantLabels(appointment, authMode) {
  const doctorName = formatDoctorDisplayName(appointment?.doctor?.name);
  const patientName = appointment?.customer?.name?.trim() || "Patient";
  const isDoctorView = authMode === "partner" || authMode === "doctor";

  return {
    doctorName,
    patientName,
    pageTitle: isDoctorView ? `Chat with ${patientName}` : `Chat with ${doctorName}`,
    subtitleName: isDoctorView ? patientName : doctorName,
    panelTitle: isDoctorView ? patientName : doctorName,
  };
}

export function mapChatMessage(message, currentUserId, participantLabels) {
  if (!message) return null;

  const senderName =
    message.sender_role === "doctor"
      ? participantLabels?.doctorName || "Doctor"
      : message.sender_role === "customer"
        ? participantLabels?.patientName || "Patient"
        : null;

  return {
    id: message.id,
    text: message.message,
    type: message.message_type,
    attachmentUrl: message.attachment_url,
    senderRole: message.sender_role,
    senderName,
    isMine: message.sender_id === currentUserId,
    isSystem: message.sender_role === "system",
    isRead: message.is_read,
    createdAt: message.created_at,
  };
}
