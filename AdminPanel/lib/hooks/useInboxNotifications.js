"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/api/index";

export function formatNotificationTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  if (diff < 60 * 1000) return "Just now";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

export function useInboxNotifications({ enabled = true, getSocket } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["inbox-notifications"],
    enabled,
    queryFn: async () => {
      const data = await notificationsApi.list();
      return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
      };
    },
    refetchInterval: enabled ? 20000 : false,
  });

  useEffect(() => {
    if (!enabled || !getSocket) return undefined;
    let socket = null;
    try {
      socket = typeof getSocket === "function" ? getSocket() : null;
    } catch {
      socket = null;
    }
    if (!socket?.on) return undefined;

    const onNew = (payload) => {
      queryClient.invalidateQueries({ queryKey: ["inbox-notifications"] });
      if (payload?.title) {
        toast.message(payload.title, { description: payload.message });
      }
    };

    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [enabled, getSocket, queryClient]);

  const markRead = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-notifications"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox-notifications"] });
    },
  });

  return {
    notifications: query.data?.notifications || [],
    unreadCount: query.data?.unreadCount || 0,
    isLoading: query.isLoading,
    markRead: (id) => markRead.mutate(id),
    markAllRead: () => markAllRead.mutate(),
  };
}
