"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, FormEvent, useRef } from "react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const toggleChatbot = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log(userMessage.text);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.ok
          ? data.response
          : data.error || "Something went wrong",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching chat: ", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "An unexpected error occurred",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {session && (
        <div
          className="fixed bottom-5 right-5 w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all duration-300"
          onClick={toggleChatbot}
        >
          💬
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-gray-900 rounded-lg shadow-lg flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Neutra Chat</span>
            <button
              onClick={toggleChatbot}
              className="text-white text-xl hover:text-gray-200"
            >
              &times;
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 max-w-xs text-sm rounded-lg ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex p-3 bg-gray-800 border-t border-gray-700"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-white bg-gray-700 border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
