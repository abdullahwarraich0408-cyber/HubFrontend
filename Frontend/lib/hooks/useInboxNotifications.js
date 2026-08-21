"use client";

import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/api/index";
import { showSystemNotificationBanner } from "@/lib/notifications/browserNotify";

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

function alertNewNotification(item) {
  if (!item?.title) return;

  // 1) In-app slide-down banner (always)
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("inbox-notification-alert", { detail: item })
    );
  }

  // 2) OS / browser system banner (works when tab is in background)
  const shown = showSystemNotificationBanner({
    id: item.id,
    title: item.title,
    message: item.message,
    link: item.link,
  });

  // 3) Fallback toast only if system notifications are not available/allowed
  if (!shown) {
    toast.info(item.title, {
      id: `inbox-${item.id}`,
      description: item.message || undefined,
      duration: 6500,
    });
  }
}

export function useInboxNotifications({ enabled = true, getSocket } = {}) {
  const queryClient = useQueryClient();
  const seenIdsRef = useRef(new Set());
  const hydratedRef = useRef(false);
  const toastedIdsRef = useRef(new Set());

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
    refetchInterval: enabled ? 10000 : false,
    refetchOnWindowFocus: true,
  });

  // Toast when new notifications appear (poll / invalidate), skip first hydrate
  useEffect(() => {
    if (!enabled) return;
    const list = query.data?.notifications;
    if (!Array.isArray(list)) return;

    if (!hydratedRef.current) {
      list.forEach((item) => {
        if (item?.id) seenIdsRef.current.add(item.id);
      });
      hydratedRef.current = true;
      return;
    }

    for (const item of list) {
      if (!item?.id || seenIdsRef.current.has(item.id)) continue;
      seenIdsRef.current.add(item.id);

      if (!item.read && !toastedIdsRef.current.has(item.id)) {
        toastedIdsRef.current.add(item.id);
        alertNewNotification(item);
      }
    }
  }, [enabled, query.data]);

  useEffect(() => {
    if (!enabled || !getSocket) return undefined;

    let socket = null;
    let cancelled = false;

    const attach = () => {
      if (cancelled) return;
      try {
        socket = typeof getSocket === "function" ? getSocket() : null;
      } catch {
        socket = null;
      }
      if (!socket?.on) return;

      const onNew = (payload) => {
        const id = payload?.id;
        if (id) {
          seenIdsRef.current.add(id);
          if (!toastedIdsRef.current.has(id)) {
            toastedIdsRef.current.add(id);
            alertNewNotification(payload);
          }
        } else if (payload?.title) {
          alertNewNotification(payload);
        }
        queryClient.invalidateQueries({ queryKey: ["inbox-notifications"] });
      };

      socket.off("notification:new", onNew);
      socket.on("notification:new", onNew);

      if (!socket.connected && typeof socket.connect === "function") {
        socket.connect();
      }
    };

    attach();

    const onAuthUpdated = () => {
      // Re-bind after login / token refresh
      setTimeout(attach, 50);
    };
    window.addEventListener("auth-updated", onAuthUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("auth-updated", onAuthUpdated);
      if (socket?.off) {
        socket.off("notification:new");
      }
    };
  }, [enabled, getSocket, queryClient]);

  // Reset hydrate tracking on logout
  useEffect(() => {
    if (enabled) return;
    hydratedRef.current = false;
    seenIdsRef.current = new Set();
    toastedIdsRef.current = new Set();
  }, [enabled]);

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
