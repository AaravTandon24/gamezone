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
import Image from "next/image";

// Define the game interface types
interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  hot: boolean;
}

interface Game {
  id: string;
  title: string;
  image: string;
  users: number;
  messages: number;
  trend: string;
  tags?: string[];
  news?: NewsItem[];
  releaseDate?: string;
  hype?: string;
}

// API response interfaces
interface RawgGameResult {
  id: number;
  name: string;
  background_image: string | null;
}

interface RawgSearchResponse {
  results: RawgGameResult[];
}

interface RawgGameDetails {
  id: number;
  background_image: string | null;
  background_image_additional: string | null;
}

const trendingGames = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
    title: "Starfield",
    image: "/placeholder.svg?height=100&width=150",
    users: 1640,
    messages: 12800,
    trend: "+10%",
  },
  {
    id: "5",
    title: "The Legend of Zelda: Tears of the Kingdom",
    image: "/placeholder.svg?height=100&width=150",
    users: 2100,
    messages: 17920,
    trend: "+8%",
  },
  {
    id: "6",
    title: "Call of Duty: Warzone",
    image: "/placeholder.svg?height=100&width=150",
    users: 3200,
    messages: 25600,
    trend: "+5%",
  },
  {
    id: "7",
    title: "Fortnite",
    image: "/placeholder.svg?height=100&width=150",
    users: 3800,
    messages: 29000,
    trend: "+12%",
  },
  {
    id: "8",
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
  const [trendingGamesWithImages, setTrendingGamesWithImages] =
    useState<Game[]>(trendingGames);
  const [weeklyTopGamesWithImages, setWeeklyTopGamesWithImages] =
    useState<Game[]>(weeklyTopGames);
  const [upcomingReleasesWithImages, setUpcomingReleasesWithImages] =
    useState<Game[]>(upcomingReleases);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameImages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Process each game list in parallel
        await Promise.all([
          processGameList(trendingGames, setTrendingGamesWithImages),
          processGameList(weeklyTopGames, setWeeklyTopGamesWithImages),
          processGameList(upcomingReleases, setUpcomingReleasesWithImages),
        ]);
      } catch (err) {
        console.error("Error in fetchGameImages:", err);
        setError("Failed to fetch game images. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const processGameList = async (
      games: Game[],
      setGames: React.Dispatch<React.SetStateAction<Game[]>>
    ) => {
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      if (!apiKey) {
        console.error("RAWG API key is missing");
        return;
      }

      const updatedGames = await Promise.all(
        games.map(async (game) => {
          try {
            // Search for the game
            const searchUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(
              game.title
            )}&page_size=1`;

            const searchResponse = await fetch(searchUrl);

            if (!searchResponse.ok) {
              throw new Error(`Search API error: ${searchResponse.status}`);
            }

            const searchData: RawgSearchResponse = await searchResponse.json();

            // If no game was found, return the original game object
            if (!searchData.results || searchData.results.length === 0) {
              return game;
            }

            const gameId = searchData.results[0].id;

            // Get the game details
            const detailsUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
            const detailsResponse = await fetch(detailsUrl);

            if (!detailsResponse.ok) {
              throw new Error(`Details API error: ${detailsResponse.status}`);
            }

            const details: RawgGameDetails = await detailsResponse.json();

            // Update the game image if available
            return {
              ...game,
              image:
                details.background_image ||
                details.background_image_additional ||
                game.image,
            };
          } catch (error) {
            console.error(`Error fetching image for ${game.title}:`, error);
            // Return the original game without modifying it on error
            return game;
          }
        })
      );

      setGames(updatedGames);
    };

    fetchGameImages();
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

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-green-400 text-center py-8">
            Loading game data...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - Trending games with news */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-semibold text-green-500 flex items-center">
                <Fire className="h-5 w-5 mr-2" />
                Trending Now
              </h2>

              {trendingGamesWithImages.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-900 border border-green-700 rounded-lg overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      className="w-full h-48 object-cover"
                      width={350}
                      height={200}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {game.title}
                        </h3>
                        <div className="flex space-x-2 mt-1">
                          {game.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-green-800 text-green-100"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="bg-green-600 text-black font-bold px-3 py-1 rounded-full flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {game.trend}
                      </div>
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

                    <h4 className="text-xl font-semibold text-green-500 mb-3">
                      Latest News
                    </h4>
                    <div className="space-y-4">
                      {game.news?.map((item) => (
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

                    <div className="mt-4 flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-black font-bold"
                        asChild
                      >
                        <Link href={`/chatroom/${game.id}`}>Join Chatroom</Link>
                      </Button>
                    </div>
                  </div>
                </div>
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
                      {weeklyTopGamesWithImages.map((game, index) => (
                        <div
                          key={game.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <div className="font-bold text-xl text-green-500 w-6 text-center">
                            {index + 1}
                          </div>
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.title}
                            className="w-16 h-16 object-cover rounded"
                            width={150}
                            height={100}
                          />
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
                        <div
                          key={game.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.title}
                            className="w-16 h-16 object-cover rounded"
                            width={150}
                            height={100}
                          />
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
                        Check out GameMaster64&apos;s amazing Elden Ring boss
                        guide that&apos;s helping thousands of players.
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
        )}
      </main>
    </div>
  );
}
