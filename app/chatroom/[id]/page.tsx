"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function ChatroomPage() {
  const params = useParams();
  const chatroomId = params.id as string;

  const [chatroom, setChatroom] = useState<{ id: string; name: string } | null>(
    null
  );
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      user: string;
      content: string;
      created_at: string;
      isCurrentUser: boolean;
    }>
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatroomId || chatroomId.length !== 36) {
      console.error("Invalid Chatroom ID:", chatroomId);
      return;
    }

    async function fetchChatroom() {
      const { data, error } = await supabase
        .from("chatrooms")
        .select("*")
        .eq("id", chatroomId)
        .single();
      if (error) {
        console.error("Error fetching chatroom:", error.message);
      } else {
        setChatroom(data);
      }
    }

    fetchChatroom();
  }, [chatroomId]);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chatroom_id", chatroomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            user: msg.username,
            content: msg.content,
            created_at: msg.created_at,
            isCurrentUser: msg.user === "GameMaster",
          }))
        );
      }
    }

    fetchMessages();
  }, [chatroomId]);

  // Real-time message listener
  useEffect(() => {
    const channel = supabase
      .channel(`chatroom-${chatroomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chatroom_id=eq.${chatroomId}`,
        },
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            user: payload.new.username,
            content: payload.new.content,
            created_at: payload.new.created_at,
            isCurrentUser: payload.new.username === "GameMaster",
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatroomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      const newMessage = {
        chatroom_id: chatroomId,
        username: "GameMaster",
        content,
        created_at: new Date().toISOString(),
      };

      console.log("Sending message:", newMessage);

      const { data, error } = await supabase
        .from("messages")
        .insert([newMessage])
        .select("id, username, content, created_at");

      if (error) {
        console.error(
          "Error sending message:",
          error.message,
          error.details,
          error.hint
        );
      }
    } catch (e) {
      console.error("Exception in handleSendMessage:", e);
    }
  };

  if (!chatroom)
    return <p className="text-center text-white">Loading chatroom...</p>;

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
                {chatroom.name} Chatroom
              </h1>
            </div>
            <div className="flex items-center text-green-400">
              <Users className="h-4 w-4 mr-1" />
              <span>Online</span>
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
