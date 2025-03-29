import { Button } from "@/components/ui/button";
import GameCard from "@/components/game-card";
import Navbar from "@/components/navbar";

const games = [
  {
    id: "1",
    title: "Cyberpunk 2077",
    image: "/placeholder.svg?height=200&width=350",
    users: 128,
    messages: 1024,
  },
  {
    id: "2",
    title: "Elden Ring",
    image: "/placeholder.svg?height=200&width=350",
    users: 256,
    messages: 2048,
  },
  {
    id: "3",
    title: "Baldur's Gate 3",
    image: "/placeholder.svg?height=200&width=350",
    users: 192,
    messages: 1536,
  },
  {
    id: "4",
    title: "Starfield",
    image: "/placeholder.svg?height=200&width=350",
    users: 164,
    messages: 1280,
  },
  {
    id: "5",
    title: "The Legend of Zelda",
    image: "/placeholder.svg?height=200&width=350",
    users: 210,
    messages: 1792,
  },
  {
    id: "6",
    title: "Call of Duty: Warzone",
    image: "/placeholder.svg?height=200&width=350",
    users: 320,
    messages: 2560,
  },
];

export default function Home() {
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
