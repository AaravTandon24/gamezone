"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";
import Navbar from "@/components/navbar";
import CreateChatroomModal from "@/components/create-chatroom-modal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const [filteredGames, setFilteredGames] = useState<typeof games>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error } = await supabase
          .from("chatrooms")
          .select("id, name, image");

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Supabase error fetching chatrooms:", error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No chatrooms found.");
          return;
        }

        // Format games with initial data
        const formattedGames = data.map((game) => ({
          id: game.id,
          title: game.name,
          image: game.image || "/placeholder.svg",
          users: Math.floor(Math.random() * 100),
          messages: Math.floor(Math.random() * 500),
        }));

        // Fetch images from RAWG API
        const gamesWithImages = await Promise.all(
          formattedGames.map(async (game) => {
            try {
              const response = await fetch(
                `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodeURIComponent(game.title)}&page_size=1`,
                {
                  headers: {
                    'Accept': 'application/json',
                  },
                }
              );
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                // Get the background image from the game details
                const gameDetails = await fetch(
                  `https://api.rawg.io/api/games/${data.results[0].id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`,
                  {
                    headers: {
                      'Accept': 'application/json',
                    },
                  }
                );
                const details = await gameDetails.json();
                return {
                  ...game,
                  image: details.background_image || details.background_image_additional || game.image,
                };
              }
              return game;
            } catch (error) {
              console.error(`Error fetching image for ${game.title}:`, error);
              return game;
            }
          })
        );

        setGames(gamesWithImages);
        setFilteredGames(gamesWithImages);
      } catch (err) {
        console.error("Unexpected error fetching chatrooms:", err);
      }
    }

    fetchGames();
  }, []);

  // Filter games based on search query
  useEffect(() => {
    const filtered = games.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-green-500">Game Chatrooms</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-green-700 text-white placeholder:text-gray-400 focus:border-green-500"
              />
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-black font-bold whitespace-nowrap"
            >
              Create Chatroom
            </Button>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="bg-gray-900 border border-green-900 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-green-500 mb-2">
              No games found
            </h2>
            <p className="text-gray-400">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>

      <CreateChatroomModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
