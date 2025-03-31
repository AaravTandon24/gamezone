"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import GameCard from "@/components/game-card";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample game data with image fetching
const allGames = [
  // RPG Games
  {
    id: "1",
    title: "Cyberpunk 2077",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 128,
    messages: 1024,
    tags: ["RPG", "Open World", "Sci-Fi"],
  },
  {
    id: "2",
    title: "Elden Ring",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 256,
    messages: 2048,
    tags: ["RPG", "Open World", "Fantasy"],
  },
  {
    id: "3",
    title: "Baldur's Gate 3",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 192,
    messages: 1536,
    tags: ["RPG", "Fantasy", "Turn-Based"],
  },
  {
    id: "4",
    title: "Starfield",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 164,
    messages: 1280,
    tags: ["RPG", "Space", "Open World"],
  },
  {
    id: "5",
    title: "The Legend of Zelda: Tears of the Kingdom",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 210,
    messages: 1792,
    tags: ["RPG", "Adventure", "Action"],
  },
  {
    id: "6",
    title: "Final Fantasy XVI",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["RPG", "Fantasy", "Action"],
  },
  {
    id: "7",
    title: "Diablo IV",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 220,
    messages: 1900,
    tags: ["RPG", "Action", "Loot"],
  },
  {
    id: "8",
    title: "Persona 5 Royal",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 150,
    messages: 1200,
    tags: ["RPG", "Turn-Based", "Anime"],
  },

  // FPS Games
  {
    id: "9",
    title: "Call of Duty: Warzone",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 320,
    messages: 2560,
    tags: ["FPS", "Battle Royale", "Multiplayer"],
  },
  {
    id: "10",
    title: "Valorant",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 290,
    messages: 2300,
    tags: ["FPS", "Tactical", "Multiplayer"],
  },
  {
    id: "11",
    title: "Apex Legends",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 310,
    messages: 2700,
    tags: ["FPS", "Battle Royale", "Multiplayer"],
  },
  {
    id: "12",
    title: "Counter-Strike 2",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 350,
    messages: 3000,
    tags: ["FPS", "Tactical", "Competitive"],
  },
  {
    id: "13",
    title: "Overwatch 2",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 280,
    messages: 2400,
    tags: ["FPS", "Hero Shooter", "Team-Based"],
  },
  {
    id: "14",
    title: "Rainbow Six Siege",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 260,
    messages: 2200,
    tags: ["FPS", "Tactical", "Competitive"],
  },

  // Battle Royale Games
  {
    id: "15",
    title: "Fortnite",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 380,
    messages: 2900,
    tags: ["Battle Royale", "Building", "Multiplayer"],
  },
  {
    id: "16",
    title: "PUBG: Battlegrounds",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 300,
    messages: 2500,
    tags: ["Battle Royale", "FPS", "Survival"],
  },
  {
    id: "17",
    title: "Fall Guys",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 250,
    messages: 2000,
    tags: ["Battle Royale", "Party", "Multiplayer"],
  },

  // Strategy Games
  {
    id: "18",
    title: "League of Legends",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 520,
    messages: 4100,
    tags: ["MOBA", "Strategy", "Multiplayer"],
  },
  {
    id: "19",
    title: "Dota 2",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 450,
    messages: 3800,
    tags: ["MOBA", "Strategy", "Competitive"],
  },
  {
    id: "20",
    title: "Age of Empires IV",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Strategy", "RTS", "Historical"],
  },
  {
    id: "21",
    title: "Civilization VI",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 200,
    messages: 1700,
    tags: ["Strategy", "Turn-Based", "Historical"],
  },
  {
    id: "22",
    title: "Total War: Warhammer III",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 160,
    messages: 1400,
    tags: ["Strategy", "RTS", "Fantasy"],
  },

  // Sports Games
  {
    id: "23",
    title: "EA Sports FC 24",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 300,
    messages: 2500,
    tags: ["Sports", "Football", "Simulation"],
  },
  {
    id: "24",
    title: "NBA 2K24",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 250,
    messages: 2100,
    tags: ["Sports", "Basketball", "Simulation"],
  },
  {
    id: "25",
    title: "Madden NFL 24",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 280,
    messages: 2300,
    tags: ["Sports", "Football", "Simulation"],
  },

  // Racing Games
  {
    id: "26",
    title: "Forza Motorsport",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 220,
    messages: 1800,
    tags: ["Racing", "Simulation", "Sports"],
  },
  {
    id: "27",
    title: "Need for Speed Unbound",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Racing", "Action", "Arcade"],
  },
  {
    id: "28",
    title: "The Crew Motorfest",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 150,
    messages: 1200,
    tags: ["Racing", "Open World", "Multiplayer"],
  },

  // Fighting Games
  {
    id: "29",
    title: "Street Fighter 6",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 200,
    messages: 1700,
    tags: ["Fighting", "Competitive", "Arcade"],
  },
  {
    id: "30",
    title: "Mortal Kombat 1",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Fighting", "Action", "Competitive"],
  },
  {
    id: "31",
    title: "Tekken 8",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 160,
    messages: 1400,
    tags: ["Fighting", "Competitive", "Arcade"],
  },

  // Survival Games
  {
    id: "32",
    title: "Minecraft",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 450,
    messages: 3200,
    tags: ["Survival", "Sandbox", "Building"],
  },
  {
    id: "33",
    title: "ARK: Survival Ascended",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Survival", "Open World", "Dinosaurs"],
  },
  {
    id: "34",
    title: "Rust",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 220,
    messages: 1900,
    tags: ["Survival", "Multiplayer", "PvP"],
  },

  // Adventure Games
  {
    id: "35",
    title: "God of War Ragnarök",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 280,
    messages: 2400,
    tags: ["Adventure", "Action", "Story"],
  },
  {
    id: "36",
    title: "Horizon Forbidden West",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 240,
    messages: 2000,
    tags: ["Adventure", "Open World", "Action"],
  },
  {
    id: "37",
    title: "Spider-Man 2",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 260,
    messages: 2200,
    tags: ["Adventure", "Action", "Open World"],
  },

  // Indie Games
  {
    id: "38",
    title: "Sea of Stars",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 150,
    messages: 1200,
    tags: ["Indie", "RPG", "Retro"],
  },
  {
    id: "39",
    title: "Dave the Diver",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Indie", "Adventure", "Simulation"],
  },
  {
    id: "40",
    title: "Bomb Rush Cyberfunk",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 120,
    messages: 1000,
    tags: ["Indie", "Action", "Rhythm"],
  },

  // Simulation Games
  {
    id: "41",
    title: "The Sims 4",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 300,
    messages: 2500,
    tags: ["Simulation", "Life", "Sandbox"],
  },
  {
    id: "42",
    title: "Cities: Skylines II",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 200,
    messages: 1700,
    tags: ["Simulation", "City Building", "Strategy"],
  },
  {
    id: "43",
    title: "PowerWash Simulator",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 150,
    messages: 1200,
    tags: ["Simulation", "Relaxing", "Indie"],
  },

  // Horror Games
  {
    id: "44",
    title: "Resident Evil 4 Remake",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 220,
    messages: 1900,
    tags: ["Horror", "Action", "Survival"],
  },
  {
    id: "45",
    title: "Dead Space Remake",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Horror", "Action", "Sci-Fi"],
  },
  {
    id: "46",
    title: "Alan Wake 2",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 160,
    messages: 1400,
    tags: ["Horror", "Action", "Story"],
  },

  // Platform Games
  {
    id: "47",
    title: "Super Mario Wonder",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 240,
    messages: 2000,
    tags: ["Platform", "Family", "Nintendo"],
  },
  {
    id: "48",
    title: "Sonic Superstars",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 180,
    messages: 1500,
    tags: ["Platform", "Family", "Action"],
  },
  {
    id: "49",
    title: "Crash Bandicoot 4",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 160,
    messages: 1400,
    tags: ["Platform", "Family", "Action"],
  },
  {
    id: "50",
    title: "Spyro Reignited Trilogy",
    image:
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
    users: 140,
    messages: 1200,
    tags: ["Platform", "Family", "Adventure"],
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [games, setGames] = useState(allGames);

  useEffect(() => {
    const fetchGameImages = async () => {
      const updatedGames = await Promise.all(
        games.map(async (game) => {
          try {
            const response = await fetch(
              `https://api.rawg.io/api/games?key=${
                process.env.NEXT_PUBLIC_RAWG_API_KEY
              }&search=${encodeURIComponent(game.title)}&page_size=1`,
              {
                headers: {
                  Accept: "application/json",
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
                    Accept: "application/json",
                  },
                }
              );
              const details = await gameDetails.json();
              return {
                ...game,
                image:
                  details.background_image ||
                  details.background_image_additional ||
                  "https://images.rawg.io/placeholder.svg",
              };
            }
            return game;
          } catch (error) {
            console.error(`Error fetching image for ${game.title}:`, error);
            return game;
          }
        })
      );
      setGames(updatedGames);
    };

    fetchGameImages();
  }, [games]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(games.flatMap((game) => game.tags))
  ).sort();

  // Filter games based on search query and selected tag
  const filteredGames = games.filter((game) => {
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
                  Try adjusting your search or filters to find what you are
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
                          <Image
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
                            <Link href={`/chatroom/${game.id}`}>
                              <Button
                                className="bg-green-600 hover:bg-green-700 text-black font-bold"
                                size="sm"
                              >
                                Join
                              </Button>
                            </Link>
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
