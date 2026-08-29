'use client'

import axios from "axios"
import { useEffect, useRef, useState } from "react"

import {
  X,
  Send,
  User,
} from "lucide-react"

export default function ChatBox({
  orderId,
  userId,
  deliveryBoyId,
  onClose,
}: any) {
  const [suggestions, setSuggestions] =
    useState<string[]>([])

  const [aiLoading, setAiLoading] =
    useState(false)
  const [messages, setMessages] =
    useState<any[]>([])

  const [text, setText] =
    useState("")

  const [chatId, setChatId] =
    useState("")

  const bottomRef =
    useRef<HTMLDivElement>(null)
const lastAiMessageRef = useRef("")
  const initChat = async () => {
    if (!orderId) return

    try {
      const res =
        await axios.post(
          "/api/chat/create",
          {
            orderId,
            userId,
            deliveryBoyId,
          }
        )

      setChatId(res.data._id)
    } catch (error) {
      console.log(error)
    }
  }

  const loadMessages = async () => {
    if (!orderId) return

    try {
      const res = await axios.get(
        `/api/chat/get/${orderId}`
      )

     setMessages(res.data)

const lastMessage =
  res.data[
    res.data.length - 1
  ]

if (
  lastMessage &&
  lastMessage.sender?._id !== userId &&
  lastAiMessageRef.current !== lastMessage._id
) {
  lastAiMessageRef.current =
    lastMessage._id

  loadSuggestions(lastMessage.text)
}
    } catch (error) {
      console.log(error)
    }
  }
  

  const sendMessage =
    async () => {
      if (!text.trim()) return

      try {
        await axios.post(
          "/api/chat/send",
          {
            chatId,
            senderId: userId,
            text,
          }
        )

        setText("")

        loadMessages()
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    if (!orderId) return

    initChat()
    loadMessages()

    const interval = setInterval(() => {
      loadMessages()
    }, 2000)

    return () => clearInterval(interval)
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  const loadSuggestions =
    async (message: string) => {
      try {
        setAiLoading(true)

        const res =
          await axios.post(
            "/api/chat/ai-suggestions",
            {
              text: message,
            }
          )

        setSuggestions(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setAiLoading(false)
      }
    }
  return (
    <div
      className="
      fixed inset-0 z-[9999]
      bg-black/40
      flex items-end md:items-center justify-center
      "
    >

      {/* CHAT CARD */}

      <div
        className="
        bg-white
        w-full
        md:w-[420px]
        h-[90vh]
        md:h-[700px]
        rounded-t-3xl
        md:rounded-3xl
        shadow-2xl
        flex flex-col
        overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
          bg-green-600
          text-white
          p-4
          flex
          justify-between
          items-center
          "
        >

          <div>
            <h2 className="font-bold text-lg">
              Delivery Chat
            </h2>

            <p className="text-xs opacity-80">
              Live conversation
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full"
          >
            <X size={22} />
          </button>

        </div>

        {/* MESSAGES */}

        <div
          className="
          flex-1
          overflow-y-auto
          bg-gray-50
          p-4
          "
        >

          {messages.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-400">
                Start conversation 👋
              </p>
            </div>
          )}

          {messages.map((m) => {

            const mine =
              m.sender?._id === userId

            return (
              <div
                key={m._id}
                className={`
                flex mb-3
                ${mine
                    ? "justify-end"
                    : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                  max-w-[75%]
                  px-4 py-2
                  rounded-2xl
                  shadow
                  ${mine
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-black rounded-bl-sm"
                    }
                  `}
                >

                  {!mine && (
                    <p className="text-xs text-green-600 font-semibold mb-1">
                      {m.sender?.name}
                    </p>
                  )}

                  <p>
                    {m.text}
                  </p>

                </div>

              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>
        {
  aiLoading && (
    <div className="px-3 py-2">
      <p className="text-sm text-purple-600 animate-pulse">
        ✨ AI is thinking...
      </p>
    </div>
  )
}
{
  suggestions.length > 0 && (
    <div className="px-3 py-2 border-t">

      <p className="text-xs text-gray-500 mb-2">
        AI Suggestions
      </p>

      <div className="flex gap-2 overflow-x-auto">

        {suggestions.map(
          (s, index) => (
            <button
              key={index}
              onClick={() =>
                setText(s)
              }
              className="
              whitespace-nowrap
              bg-purple-100
              text-purple-700
              px-3 py-2
              rounded-full
              text-sm
              hover:bg-purple-200
              transition
              "
            >
              ✨ {s}
            </button>
          )
        )}

      </div>

    </div>
  )
}

        {/* QUICK REPLIES */}

        <div className="px-3 py-2 border-t flex gap-2 overflow-x-auto">

          {[
            "I'm coming",
            "Where are you?",
            "5 minutes away",
            "Please call me"
          ].map((msg) => (
            <button
              key={msg}
              onClick={() => setText(msg)}
              className="
              whitespace-nowrap
              bg-green-100
              text-green-700
              px-3 py-1
              rounded-full
              text-sm
              "
            >
              {msg}
            </button>
          ))}

        </div>

        {/* INPUT */}

        <div
          className="
          p-3
          border-t
          flex
          gap-2
          bg-white
          "
        >

          <input
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Type a message..."
            className="
            flex-1
            border
            rounded-full
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-green-500
            "
          />

          <button
            onClick={sendMessage}
            className="
            bg-green-600
            hover:bg-green-700
            text-white
            p-3
            rounded-full
            "
          >
            <Send size={18} />
          </button>

        </div>

      </div>
    </div>
  )
}