"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  FlameIcon as Fire,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const trendingGames = [
  {
    id: "1",
    title: "Helldivers 2",
    image: "https://images.rawg.io/placeholder.svg",
    users: 450,
    messages: 3800,
    tags: ["Action", "Shooter", "Co-op"],
    news: [
      {
        id: "n7",
        title: "Major Update Adds New Weapons and Enemies",
        content: "Arrowhead Game Studios has released a massive update introducing new weapons, enemy types, and mission objectives to the game.",
        date: "3 days ago",
        hot: true,
      },
      {
        id: "n8",
        title: "Player Count Surpasses 1 Million",
        content: "The game has reached a new milestone with over 1 million active players, making it one of the most successful launches of 2024.",
        date: "1 week ago",
        hot: true,
      },
    ],
  },
  {
    id: "2",
    title: "Suicide Squad: Kill the Justice League",
    image: "https://images.rawg.io/placeholder.svg",
    users: 380,
    messages: 3200,
    tags: ["Action", "Shooter", "Superhero"],
    news: [
      {
        id: "n9",
        title: "Season 1 Content Revealed",
        content: "Rocksteady has unveiled the first season of post-launch content, featuring new characters and story missions.",
        date: "2 days ago",
        hot: true,
      },
      {
        id: "n10",
        title: "Performance Patch Released",
        content: "A new update has improved game performance and fixed several technical issues reported by players.",
        date: "5 days ago",
        hot: false,
      },
    ],
  },
  {
    id: "3",
    title: "Tekken 8",
    image: "https://images.rawg.io/placeholder.svg",
    users: 420,
    messages: 3500,
    tags: ["Fighting", "Competitive", "Action"],
    news: [
      {
        id: "n11",
        title: "New Character Eddy Gordo Announced",
        content: "Bandai Namco has revealed that fan-favorite character Eddy Gordo will be joining the roster in the next update.",
        date: "1 day ago",
        hot: true,
      },
      {
        id: "n12",
        title: "World Tour Finals Set for March",
        content: "The Tekken World Tour 2024 finals have been scheduled for March, with a $100,000 prize pool.",
        date: "4 days ago",
        hot: true,
      },
    ],
  },
  {
    id: "4",
    title: "Persona 3 Reload",
    image: "https://images.rawg.io/placeholder.svg",
    users: 360,
    messages: 3000,
    tags: ["RPG", "Anime", "Turn-Based"],
    news: [
      {
        id: "n13",
        title: "New Game Plus Mode Details",
        content: "Atlus has revealed details about the enhanced New Game Plus mode, including new social links and story content.",
        date: "2 days ago",
        hot: true,
      },
      {
        id: "n14",
        title: "Soundtrack Receives Critical Acclaim",
        content: "The remastered soundtrack has been praised by fans and critics alike, with new arrangements of classic tracks.",
        date: "1 week ago",
        hot: false,
      },
    ],
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    image: "/placeholder.svg?height=200&width=350",
    users: 1280,
    messages: 10240,
    trend: "+15%",
    tags: ["RPG", "Open World"],
    news: [
      {
        id: "n1",
        title: "New DLC 'Phantom Liberty' Released",
        content:
          "CD Projekt Red has released the highly anticipated Phantom Liberty expansion, adding a new district and storyline.",
        date: "2 days ago",
        hot: true,
      },
      {
        id: "n2",
        title: "Patch 2.1 Improves Vehicle Handling",
        content:
          "The latest update brings significant improvements to vehicle physics and handling throughout Night City.",
        date: "1 week ago",
        hot: false,
      },
    ],
  },
  {
    id: "6",
    title: "Elden Ring",
    image: "/placeholder.svg?height=200&width=350",
    users: 2560,
    messages: 20480,
    trend: "+28%",
    tags: ["RPG", "Souls-like"],
    news: [
      {
        id: "n3",
        title: "Shadow of the Erdtree DLC Announced",
        content:
          "FromSoftware has revealed the first major expansion for Elden Ring, promising new challenges and areas to explore.",
        date: "3 days ago",
        hot: true,
      },
      {
        id: "n4",
        title: "Player Defeats Malenia Using Dance Pad",
        content:
          "A skilled player has managed to defeat one of the game's hardest bosses using only a dance pad controller.",
        date: "5 days ago",
        hot: true,
      },
    ],
  },
  {
    id: "7",
    title: "Baldur's Gate 3",
    image: "/placeholder.svg?height=200&width=350",
    users: 1920,
    messages: 15360,
    trend: "+45%",
    tags: ["RPG", "D&D"],
    news: [
      {
        id: "n5",
        title: "Patch 5 Adds New Epilogue Content",
        content:
          "Larian Studios has released a major update adding new epilogue scenes and character interactions based on your choices.",
        date: "1 day ago",
        hot: true,
      },
      {
        id: "n6",
        title: "Game Wins Multiple Game of the Year Awards",
        content:
          "Baldur's Gate 3 has swept award ceremonies, winning Game of the Year at multiple prestigious events.",
        date: "2 weeks ago",
        hot: false,
      },
    ],
  },
];

// Sample data for weekly top games
const weeklyTopGames = [
  {
    id: "8",
    title: "Starfield",
    image: "/placeholder.svg?height=100&width=150",
    users: 1640,
    messages: 12800,
    trend: "+10%",
  },
  {
    id: "9",
    title: "The Legend of Zelda: Tears of the Kingdom",
    image: "/placeholder.svg?height=100&width=150",
    users: 2100,
    messages: 17920,
    trend: "+8%",
  },
  {
    id: "10",
    title: "Call of Duty: Warzone",
    image: "/placeholder.svg?height=100&width=150",
    users: 3200,
    messages: 25600,
    trend: "+5%",
  },
  {
    id: "11",
    title: "Fortnite",
    image: "/placeholder.svg?height=100&width=150",
    users: 3800,
    messages: 29000,
    trend: "+12%",
  },
  {
    id: "12",
    title: "League of Legends",
    image: "/placeholder.svg?height=100&width=150",
    users: 5200,
    messages: 41000,
    trend: "+7%",
  },
];

// Sample data for upcoming releases
const upcomingReleases = [
  {
    id: "u1",
    title: "Dragon Age: The Veilguard",
    image: "/placeholder.svg?height=100&width=150",
    releaseDate: "October 31, 2024",
    hype: "High",
  },
  {
    id: "u2",
    title: "Fable",
    image: "/placeholder.svg?height=100&width=150",
    releaseDate: "December 15, 2024",
    hype: "Medium",
  },
  {
    id: "u3",
    title: "Star Wars Outlaws",
    image: "/placeholder.svg?height=100&width=150",
    releaseDate: "August 30, 2024",
    hype: "Very High",
  },
  {
    id: "u4",
    title: "Avowed",
    image: "/placeholder.svg?height=100&width=150",
    releaseDate: "November 12, 2024",
    hype: "High",
  },
  {
    id: "u5",
    title: "Metaphor: ReFantazio",
    image: "/placeholder.svg?height=100&width=150",
    releaseDate: "October 11, 2024",
    hype: "Medium",
  },
];

export default function PopularPage() {
  const [trendingGamesWithImages, setTrendingGamesWithImages] = useState(trendingGames);
  const [weeklyTopGamesWithImages, setWeeklyTopGamesWithImages] = useState(weeklyTopGames);
  const [upcomingReleasesWithImages, setUpcomingReleasesWithImages] = useState(upcomingReleases);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinChatroom = async (gameId: string, gameTitle: string) => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      if (!session) {
        // Redirect to login page if not authenticated
        router.push('/auth');
        return;
      }

      // First, check if the game exists in the games table
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("id")
        .eq("id", gameId)
        .single();

      if (gameError && gameError.code !== "PGRST116") {
        console.error("Game error:", gameError);
        throw gameError;
      }

      // If game doesn't exist, create it first
      if (!gameData) {
        const gameToInsert = {
          id: gameId,
          title: gameTitle,
          image: trendingGamesWithImages.find(g => g.id === gameId)?.image || 
                 weeklyTopGamesWithImages.find(g => g.id === gameId)?.image || 
                 upcomingReleasesWithImages.find(g => g.id === gameId)?.image || 
                 "https://images.rawg.io/placeholder.svg",
          users: 0,
          messages: 0,
          tags: trendingGamesWithImages.find(g => g.id === gameId)?.tags || [],
        };

        const { data: newGame, error: createGameError } = await supabase
          .from("games")
          .insert([gameToInsert])
          .select()
          .single();

        if (createGameError) {
          console.error("Create game error:", createGameError);
          throw createGameError;
        }

        if (!newGame) {
          throw new Error("Failed to create game");
        }
      }

      // Now check if chatroom exists for this game
      const { data: existingChatroom, error: chatroomError } = await supabase
        .from("chatrooms")
        .select("id")
        .eq("game_id", gameId)
        .single();

      if (chatroomError && chatroomError.code !== "PGRST116") {
        console.error("Chatroom error:", chatroomError);
        throw chatroomError;
      }

      if (!existingChatroom) {
        // Create new chatroom if it doesn't exist
        const chatroomToInsert = {
          name: gameTitle,
          title: gameTitle,
          game_id: gameId,
          image: trendingGamesWithImages.find(g => g.id === gameId)?.image || 
                 weeklyTopGamesWithImages.find(g => g.id === gameId)?.image || 
                 upcomingReleasesWithImages.find(g => g.id === gameId)?.image || 
                 "https://images.rawg.io/placeholder.svg",
          created_by: session.user.id,
          users: 0,
          messages: 0,
        };

        const { data: newChatroom, error: createError } = await supabase
          .from("chatrooms")
          .insert([chatroomToInsert])
          .select()
          .single();

        if (createError) {
          console.error("Create chatroom error:", createError);
          throw createError;
        }

        if (!newChatroom) {
          throw new Error("Failed to create chatroom");
        }

        router.push(`/chatroom/${newChatroom.id}`);
      } else {
        router.push(`/chatroom/${existingChatroom.id}`);
      }
    } catch (error) {
      console.error("Error joining chatroom:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGameImages = async (games: any[], setGames: (games: any[]) => void) => {
      const updatedGames = await Promise.all(
        games.map(async (game) => {
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
      setGames(updatedGames);
    };

    // Fetch images for all game lists
    fetchGameImages(trendingGames, setTrendingGamesWithImages);
    fetchGameImages(weeklyTopGames, setWeeklyTopGamesWithImages);
    fetchGameImages(upcomingReleases, setUpcomingReleasesWithImages);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-500">Popular Games</h1>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Updated hourly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Trending games with news */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-semibold text-green-500 flex items-center">
              <Fire className="h-5 w-5 mr-2" />
              Trending Now
            </h2>

            {trendingGamesWithImages.map((game) => (
              <Card key={game.id} className="bg-gray-900 border-green-900">
                <CardContent className="p-0">
                  <div className="relative group">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        onClick={() => handleJoinChatroom(game.id, game.title)}
                        className="bg-green-600 hover:bg-green-700 text-black font-bold"
                        disabled={isLoading}
                      >
                        {isLoading ? "Joining..." : "Join Chatroom"}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm text-green-400 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{game.users.toLocaleString()} active users</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{game.messages.toLocaleString()} messages</span>
                      </div>
                    </div>

                    {game.news && game.news.length > 0 && (
                      <>
                        <h4 className="text-xl font-semibold text-green-500 mb-3">
                          Latest News
                        </h4>
                        <div className="space-y-4">
                          {game.news.map((item) => (
                            <div
                              key={item.id}
                              className="border-l-4 border-green-600 pl-4 py-1"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="text-lg font-medium text-white flex items-center">
                                  {item.title}
                                  {item.hot && (
                                    <Badge className="ml-2 bg-red-600 text-white">
                                      Hot
                                    </Badge>
                                  )}
                                </h5>
                                <div className="text-xs text-gray-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.date}
                                </div>
                              </div>
                              <p className="text-gray-300">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar - Weekly top and upcoming */}
          <div className="space-y-8">
            <Card className="bg-gray-900 border-green-700">
              <CardContent className="p-0">
                <Tabs defaultValue="weekly" className="w-full">
                  <div className="border-b border-green-900 px-4 py-2">
                    <TabsList className="bg-gray-800 grid w-full grid-cols-2">
                      <TabsTrigger
                        value="weekly"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-black"
                      >
                        Weekly Top
                      </TabsTrigger>
                      <TabsTrigger
                        value="upcoming"
                        className="data-[state=active]:bg-green-600 data-[state=active]:text-black"
                      >
                        Upcoming
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="weekly" className="p-4 space-y-4">
                    {weeklyTopGamesWithImages.map((game) => (
                      <div key={game.id} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                        <div className="relative group">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                            <Button
                              onClick={() => handleJoinChatroom(game.id, game.title)}
                              className="bg-green-600 hover:bg-green-700 text-black font-bold"
                              disabled={isLoading}
                            >
                              {isLoading ? "Joining..." : "Join"}
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">
                            {game.title}
                          </h4>
                          <div className="flex justify-between text-xs text-green-400 mt-1">
                            <span>{game.users.toLocaleString()} users</span>
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {game.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full border-green-700 text-green-400 hover:bg-green-900 hover:text-green-300"
                    >
                      View All
                    </Button>
                  </TabsContent>

                  <TabsContent value="upcoming" className="p-4 space-y-4">
                    {upcomingReleasesWithImages.map((game) => (
                      <div key={game.id} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                        <div className="relative group">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                            <Button
                              onClick={() => handleJoinChatroom(game.id, game.title)}
                              className="bg-green-600 hover:bg-green-700 text-black font-bold"
                              disabled={isLoading}
                            >
                              {isLoading ? "Joining..." : "Join"}
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">
                            {game.title}
                          </h4>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-400">
                              {game.releaseDate}
                            </span>
                            <Badge
                              className={`
                              ${
                                game.hype === "Very High"
                                  ? "bg-red-600"
                                  : game.hype === "High"
                                  ? "bg-orange-600"
                                  : "bg-yellow-600"
                              } 
                              text-white
                            `}
                            >
                              {game.hype} Hype
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full border-green-700 text-green-400 hover:bg-green-900 hover:text-green-300"
                    >
                      View All Upcoming
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-700">
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-green-500 mb-4">
                  Community Highlights
                </h3>

                <div className="space-y-4">
                  <div className="border border-green-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">
                        Weekly Tournament
                      </h4>
                      <Badge className="bg-purple-600">Event</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Join our weekly Valorant tournament this Saturday at 8PM
                      EST. Prize pool of $500!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-700 text-green-400 hover:bg-green-900"
                    >
                      Learn More
                    </Button>
                  </div>

                  <div className="border border-green-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">
                        Creator Spotlight
                      </h4>
                      <Badge className="bg-blue-600">Featured</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Check out GameMaster64's amazing Elden Ring boss guide
                      that's helping thousands of players.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-700 text-green-400 hover:bg-green-900"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
