"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function ChatroomPage() {
  const params = useParams();
  const router = useRouter();
  const chatroomId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setCurrentUsername(session?.user?.user_metadata?.username ?? null);
    }

    fetchUser();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setCurrentUsername(session?.user?.user_metadata?.username ?? null);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Fetch chatroom details
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

  // Fetch chat messages
  useEffect(() => {
    if (!chatroomId || !currentUsername) return;

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
            isCurrentUser: msg.username === currentUsername,
          }))
        );
      }
    }

    fetchMessages();
  }, [chatroomId, currentUsername]);

  // Real-time message listener
  useEffect(() => {
    if (!chatroomId) return;

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
            isCurrentUser: payload.new.username === currentUsername,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatroomId, currentUsername]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    if (!currentUsername) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          chatroom_id: chatroomId,
          username: currentUsername,
          content,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error sending message:", error.message);
      }
    } catch (e) {
      console.error("Exception in handleSendMessage:", e);
    }
  };

  // Handle chatroom deletion
  const handleDeleteChatroom = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this chatroom? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete messages first
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("chatroom_id", chatroomId);
      if (messagesError) throw messagesError;

      // Delete chatroom
      const { error: chatroomError } = await supabase
        .from("chatrooms")
        .delete()
        .eq("id", chatroomId);
      if (chatroomError) throw chatroomError;

      // Redirect to home
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting chatroom:", error);
      alert("Failed to delete chatroom. Please try again.");
    } finally {
      setIsDeleting(false);
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-400">
                <Users className="h-4 w-4 mr-1" />
                <span>Online</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleDeleteChatroom}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-green-900 bg-gray-900 py-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
