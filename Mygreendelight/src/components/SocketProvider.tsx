"use client";

import { useSession }
  from "next-auth/react";

import { useEffect }
  from "react";

import { socket }
  from "@/lib/socket";

export default function SocketProvider() {

  const {
    data: session,
  } = useSession();

  useEffect(() => {

    if (
      !session?.user?.id
    ) return;

    socket.connect();

    socket.on(
      "connect",
      () => {

        console.log(
          "SOCKET CONNECTED:"
        );

        console.log(
          socket.id
        );

        socket.emit(
          "register-user",
          session.user.id
        );

      }
    );

    return () => {

      socket.off(
        "connect"
      );

      socket.disconnect();

    };

  }, [session]);

  return null;
}