'use client'

import { MessageCircle } from "lucide-react"
import { useState } from "react"
import ChatBox from "./ChatBox"

export default function ChatButton({
  orderId,
  userId,
  deliveryBoyId,
}: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
          fixed bottom-5 right-5 z-[999]
          bg-green-600 hover:bg-green-700
          text-white
          shadow-2xl
          rounded-full
          px-5 py-3
          flex items-center gap-2
          transition-all duration-300
          "
        >
          <MessageCircle size={22} />
          <span className="font-medium">
            Chat
          </span>
        </button>
      )}

      {open && (
        <ChatBox
          orderId={orderId}
          userId={userId}
          deliveryBoyId={deliveryBoyId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}