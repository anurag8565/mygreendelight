"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getCleanUserId } from "@/redux/CartSlice";

export default function SocketProvider() {
  const { data: session } = useSession();
  const { userdata } = useSelector((state: RootState) => state.user);

  const cleanUserId = getCleanUserId(
    userdata?._id ||
    (userdata as any)?.id ||
    (session?.user as any)?._id ||
    session?.user?.id ||
    session?.user?.email
  );

  useEffect(() => {
    // Determine user ID or persistent guest device ID for live socket room
    let targetId = cleanUserId;
    if (!targetId && typeof window !== "undefined") {
      let guestId = localStorage.getItem("subziquick_guest_id");
      if (!guestId) {
        guestId = "guest_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
        localStorage.setItem("subziquick_guest_id", guestId);
      }
      targetId = guestId;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      if (targetId) {
        socket.emit("register-user", targetId);
      }
    };

    if (socket.connected) {
      if (targetId) {
        socket.emit("register-user", targetId);
      }
    } else {
      socket.on("connect", onConnect);
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [cleanUserId]);

  return null;
}