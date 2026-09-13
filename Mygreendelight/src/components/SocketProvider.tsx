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
    if (!cleanUserId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      socket.emit("register-user", cleanUserId);
    };

    if (socket.connected) {
      socket.emit("register-user", cleanUserId);
    } else {
      socket.on("connect", onConnect);
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [cleanUserId]);

  return null;
}