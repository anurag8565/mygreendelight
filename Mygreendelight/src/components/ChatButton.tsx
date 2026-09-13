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
          bg-[#0a3d24] hover:bg-[#072817]
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