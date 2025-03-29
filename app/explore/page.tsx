"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import GameCard from "@/components/game-card";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

// Sample game data
const allGames = [
  {
    id: "1",
    title: "Cyberpunk 2077",
    image: "/placeholder.svg?height=200&width=350",
    users: 128,
    messages: 1024,
    tags: ["RPG", "Open World", "Sci-Fi"],
  },
  {
    id: "2",
    title: "Elden Ring",
    image: "/placeholder.svg?height=200&width=350",
    users: 256,
    messages: 2048,
    tags: ["RPG", "Open World", "Fantasy"],
  },
  {
    id: "3",
    title: "Baldur's Gate 3",
    image: "/placeholder.svg?height=200&width=350",
    users: 192,
    messages: 1536,
    tags: ["RPG", "Fantasy", "Turn-Based"],
  },
  {
    id: "4",
    title: "Starfield",
    image: "/placeholder.svg?height=200&width=350",
    users: 164,
    messages: 1280,
    tags: ["RPG", "Space", "Open World"],
  },
  {
    id: "5",
    title: "The Legend of Zelda",
    image: "/placeholder.svg?height=200&width=350",
    users: 210,
    messages: 1792,
    tags: ["Adventure", "Fantasy", "Action"],
  },
  {
    id: "6",
    title: "Call of Duty: Warzone",
    image: "/placeholder.svg?height=200&width=350",
    users: 320,
    messages: 2560,
    tags: ["FPS", "Battle Royale", "Multiplayer"],
  },
  {
    id: "7",
    title: "Minecraft",
    image: "/placeholder.svg?height=200&width=350",
    users: 450,
    messages: 3200,
    tags: ["Sandbox", "Survival", "Building"],
  },
  {
    id: "8",
    title: "Fortnite",
    image: "/placeholder.svg?height=200&width=350",
    users: 380,
    messages: 2900,
    tags: ["Battle Royale", "Building", "Multiplayer"],
  },
  {
    id: "9",
    title: "League of Legends",
    image: "/placeholder.svg?height=200&width=350",
    users: 520,
    messages: 4100,
    tags: ["MOBA", "Strategy", "Multiplayer"],
  },
  {
    id: "10",
    title: "Valorant",
    image: "/placeholder.svg?height=200&width=350",
    users: 290,
    messages: 2300,
    tags: ["FPS", "Tactical", "Multiplayer"],
  },
  {
    id: "11",
    title: "Apex Legends",
    image: "/placeholder.svg?height=200&width=350",
    users: 310,
    messages: 2700,
    tags: ["FPS", "Battle Royale", "Multiplayer"],
  },
  {
    id: "12",
    title: "Genshin Impact",
    image: "/placeholder.svg?height=200&width=350",
    users: 280,
    messages: 2200,
    tags: ["RPG", "Open World", "Gacha"],
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(allGames.flatMap((game) => game.tags))
  ).sort();

  // Filter games based on search query and selected tag
  const filteredGames = allGames.filter((game) => {
    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? game.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-500 mb-6">
            Explore Game Chatrooms
          </h1>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for games..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/4">
            <div className="bg-gray-900 border border-green-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-500 mb-4">
                Filters
              </h2>

              <div className="mb-4">
                <h3 className="text-green-400 font-medium mb-2">
                  Game Categories
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    className={`mr-2 mb-2 ${
                      selectedTag === null
                        ? "bg-green-600 hover:bg-green-700 text-black"
                        : "text-green-400 border-green-700"
                    }`}
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className={`mr-2 mb-2 ${
                        selectedTag === tag
                          ? "bg-green-600 hover:bg-green-700 text-black"
                          : "text-green-400 border-green-700"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-green-400 font-medium mb-2">View Mode</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    className={`${
                      viewMode === "grid"
                        ? "bg-green-600 hover:bg-green-700 text-black"
                        : "text-green-400 border-green-700"
                    }`}
                    onClick={() => setViewMode("grid")}
                    size="icon"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    className={`${
                      viewMode === "list"
                        ? "bg-green-600 hover:bg-green-700 text-black"
                        : "text-green-400 border-green-700"
                    }`}
                    onClick={() => setViewMode("list")}
                    size="icon"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            {filteredGames.length === 0 ? (
              <div className="bg-gray-900 border border-green-900 rounded-lg p-8 text-center">
                <h2 className="text-xl font-semibold text-green-500 mb-2">
                  No games found
                </h2>
                <p className="text-gray-400">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-green-500">
                    {filteredGames.length}{" "}
                    {filteredGames.length === 1 ? "Game" : "Games"} Found
                  </h2>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <div
                        key={game.id}
                        className="flex bg-gray-900 border border-green-700 hover:border-green-500 rounded-lg overflow-hidden transition-all duration-300"
                      >
                        <div className="w-1/4 h-32">
                          <img
                            src={game.image || "/placeholder.svg"}
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-3/4 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {game.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {game.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-green-400">
                              {game.users} users • {game.messages} messages
                            </div>
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-black font-bold"
                              size="sm"
                              asChild
                            >
                              <a href={`/chatroom/${game.id}`}>Join</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
