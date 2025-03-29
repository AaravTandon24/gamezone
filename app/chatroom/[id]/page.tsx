"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

// Sample data for demonstration
const games = {
  "1": { title: "Cyberpunk 2077", users: 128 },
  "2": { title: "Elden Ring", users: 256 },
  "3": { title: "Baldur's Gate 3", users: 192 },
  "4": { title: "Starfield", users: 164 },
  "5": { title: "The Legend of Zelda", users: 210 },
  "6": { title: "Call of Duty: Warzone", users: 320 },
};

const sampleMessages = [
  {
    id: 1,
    user: "CyberNinja",
    content: "Has anyone found the secret ending yet?",
    timestamp: "10:23 AM",
    isCurrentUser: false,
  },
  {
    id: 2,
    user: "EldenLord",
    content: "I'm stuck on the final boss, any tips?",
    timestamp: "10:25 AM",
    isCurrentUser: false,
  },
  {
    id: 3,
    user: "GameMaster",
    content: "Try using the fire enchantment on your weapon.",
    timestamp: "10:27 AM",
    isCurrentUser: true,
  },
  {
    id: 4,
    user: "QuestHunter",
    content:
      "The side quest in the northern region gives you a really good shield.",
    timestamp: "10:30 AM",
    isCurrentUser: false,
  },
  {
    id: 5,
    user: "NightStalker",
    content: "Anyone want to team up for the raid tonight?",
    timestamp: "10:32 AM",
    isCurrentUser: false,
  },
  {
    id: 6,
    user: "GameMaster",
    content: "I'll be online around 8pm EST if anyone wants to join.",
    timestamp: "10:35 AM",
    isCurrentUser: true,
  },
];

export default function ChatroomPage() {
  const params = useParams();
  const id = params.id as string;
  const game = games[id as keyof typeof games] || {
    title: "Unknown Game",
    users: 0,
  };

  const [messages, setMessages] = useState(sampleMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: messages.length + 1,
      user: "GameMaster",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };
    setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-green-900">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="mr-2 text-green-500 hover:text-green-400 p-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-green-500">
                {game.title} Chatroom
              </h1>
            </div>
            <div className="flex items-center text-green-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{game.users} online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-green-900 bg-gray-900 py-4">
          <div className="container mx-auto px-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
