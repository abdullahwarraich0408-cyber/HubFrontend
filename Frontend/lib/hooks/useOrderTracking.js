"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

function invalidateCustomerOrders(queryClient, payload) {
  queryClient.invalidateQueries({ queryKey: ["all-orders"] });
  queryClient.invalidateQueries({ queryKey: ["orders"] });

  if (payload?.type === "prescription" || payload?.orderId?.startsWith?.("rx-")) {
    queryClient.invalidateQueries({ queryKey: ["prescription-orders"] });
    if (payload.orderId) {
      queryClient.invalidateQueries({
        queryKey: ["prescription-orders", payload.orderId],
      });
    }
  }

  if (payload?.orderId) {
    queryClient.invalidateQueries({
      queryKey: ["order-detail", payload.orderId],
    });
  }
}

/**
 * Real-time order tracking for customer web app.
 * Joins personal customer room on connect; optionally subscribes to one order room.
 */
export function useCustomerOrderTracking({ orderId, enabled = true } = {}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const socket = getSocket("customer");
    if (!socket) return undefined;

    const joinOrderRoom = () => {
      if (orderId) {
        socket.emit("join_order_room", orderId);
      }
    };

    const onUpdated = (payload) => {
      invalidateCustomerOrders(queryClient, payload);
    };

    const onNew = (payload) => {
      invalidateCustomerOrders(queryClient, payload);
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
