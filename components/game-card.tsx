import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import Link from "next/link";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    image: string;
    users: number;
    messages: number;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Card className="bg-gray-900 border-green-700 hover:border-green-500 transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.image || "/placeholder.svg"} // ✅ Handle missing image
          alt={game.title || "Chatroom"} // ✅ Handle missing title
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
          {game.title || "Unnamed Chatroom"} {/* ✅ Handle missing title */}
        </h3>
      </div>

      <CardContent className="pt-4">
        <div className="flex justify-between text-green-400 text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{game.users ?? 0} online</span>{" "}
            {/* ✅ Handle missing users */}
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{game.messages ?? 0} messages</span>{" "}
            {/* ✅ Handle missing messages */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-green-900 pt-4">
        <Link href={`/chatroom/${game.id}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-black font-bold">
            Join Chatroom
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
