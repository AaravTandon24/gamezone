"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";
import Navbar from "@/components/navbar";

export default function Home() {
  const [games, setGames] = useState<
    Array<{
      id: string;
      title: string;
      image: string;
      users: number;
      messages: number;
    }>
  >([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error } = await supabase
          .from("chatrooms")
          .select("id, title, image");

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Supabase error fetching chatrooms:", error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No chatrooms found.");
          return;
        }

        // Use the actual image from the database, and provide defaults if missing
        const formattedGames = data.map((game) => ({
          id: game.id,
          title: game.title,
          image: game.image || "/placeholder.svg", // Use database image, fallback to placeholder
          users: Math.floor(Math.random() * 100), // Fake user count for now
          messages: Math.floor(Math.random() * 500), // Fake messages for now
        }));

        setGames(formattedGames);
      } catch (err) {
        console.error("Unexpected error fetching chatrooms:", err);
      }
    }

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-500">Game Chatrooms</h1>
          <Button className="bg-green-600 hover:bg-green-700 text-black font-bold">
            Create Chatroom
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
