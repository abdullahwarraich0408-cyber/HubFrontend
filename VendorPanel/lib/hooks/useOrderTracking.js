"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getVendorSocket } from "@/lib/socket";

function invalidateVendorOrders(queryClient, payload) {
  queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
  queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
  queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
  queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
  queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });

  if (payload?.orderId) {
    queryClient.invalidateQueries({
      queryKey: ["orders", payload.orderId],
    });
  }
}

/** Real-time order tracking for vendor dashboard. */
export function useVendorOrderTracking({ orderId, enabled = true } = {}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const socket = getVendorSocket();
    if (!socket) return undefined;

    const joinOrderRoom = () => {
      if (orderId) {
        socket.emit("join_order_room", orderId);
      }
    };

    const onUpdated = (payload) => {
      invalidateVendorOrders(queryClient, payload);
    };

    const onNew = (payload) => {
      invalidateVendorOrders(queryClient, payload);
    };

    if (socket.connected) {
      joinOrderRoom();
    } else {
      socket.on("connect", joinOrderRoom);
    }

    socket.on("order:updated", onUpdated);
    socket.on("order:new", onNew);

    return () => {
      if (orderId) {
        socket.emit("leave_order_room", orderId);
      }
      socket.off("connect", joinOrderRoom);
      socket.off("order:updated", onUpdated);
      socket.off("order:new", onNew);
    };
  }, [enabled, orderId, queryClient]);
}
