"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { telehealthApi, uploadApi } from "@/lib/api";

export function useAppointmentChat(appointmentId, options = {}) {
  const { auth, poll, ...queryOptions } = options;
  return useQuery({
    queryKey: ["appointment-chat", appointmentId],
    queryFn: () => telehealthApi.getChat(appointmentId, auth ? { auth } : {}),
    enabled: Boolean(appointmentId),
    refetchInterval: poll !== false ? 4000 : false,
    ...queryOptions,
  });
}

export function useSendAppointmentMessage(appointmentId, authMode) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      telehealthApi.sendMessage(appointmentId, payload, authMode ? { auth: authMode } : {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-chat", appointmentId] });
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

export function mapChatMessage(message, currentUserId) {
  if (!message) return null;
  return {
    id: message.id,
    text: message.message,
    type: message.message_type,
    attachmentUrl: message.attachment_url,
    senderRole: message.sender_role,
    isMine: message.sender_id === currentUserId,
    isSystem: message.sender_role === "system",
    isRead: message.is_read,
    createdAt: message.created_at,
  };
}
