"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateChatroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_GAMES = [
  // Competitive Games
  "League of Legends",
  "Valorant",
  "Counter-Strike 2",
  "Dota 2",
  "Fortnite",
  "Apex Legends",
  "Overwatch 2",
  "Rainbow Six Siege",
  "Team Fortress 2",
  "PUBG: Battlegrounds",
  "Call of Duty: Modern Warfare III",
  "Call of Duty: Warzone",
  "Halo Infinite",
  "Paladins",
  "Brawlhalla",
  "Smite",
  "Splitgate",
  
  // MMORPGs
  "World of Warcraft",
  "Final Fantasy XIV",
  "Lost Ark",
  "Path of Exile",
  "Destiny 2",
  "Warframe",
  "Black Desert Online",
  "Elder Scrolls Online",
  "Guild Wars 2",
  "New World",
  "Star Wars: The Old Republic",
  "RuneScape",
  "MapleStory",
  
  // Action RPGs
  "Elden Ring",
  "Baldur's Gate 3",
  "Diablo IV",
  "Cyberpunk 2077",
  "Hogwarts Legacy",
  "Starfield",
  "The Witcher 3: Wild Hunt",
  "Dark Souls III",
  "Bloodborne",
  "Sekiro: Shadows Die Twice",
  "Monster Hunter: World",
  "Monster Hunter Rise",
  "Dragon's Dogma 2",
  
  // Sports Games
  "FIFA 24",
  "NBA 2K24",
  "Rocket League",
  "Gran Turismo 7",
  "Forza Horizon 5",
  "Madden NFL 24",
  "NHL 24",
  "WWE 2K24",
  "UFC 5",
  
  // Fighting Games
  "Street Fighter 6",
  "Mortal Kombat 1",
  "Tekken 8",
  "Guilty Gear Strive",
  "Dragon Ball FighterZ",
  "Super Smash Bros. Ultimate",
  "King of Fighters XV",
  "Melty Blood: Type Lumina",
  
  // Action-Adventure
  "GTA V",
  "Red Dead Redemption 2",
  "God of War",
  "The Last of Us",
  "Assassin's Creed Mirage",
  "Spider-Man 2",
  "Horizon Forbidden West",
  "Ghost of Tsushima",
  "Death Stranding",
  "Marvel's Spider-Man",
  "Ratchet & Clank: Rift Apart",
  "Returnal",
  
  // Survival Games
  "Minecraft",
  "Among Us",
  "ARK: Survival Evolved",
  "Rust",
  "DayZ",
  "Project Zomboid",
  "Valheim",
  "7 Days to Die",
  "The Forest",
  "Subnautica",
  
  // Horror Games
  "Resident Evil 4",
  "Dead Space",
  "Alan Wake 2",
  "Lies of P",
  "Amnesia: The Bunker",
  "Phasmophobia",
  "Dead by Daylight",
  
  // Strategy Games
  "Age of Empires IV",
  "Civilization VI",
  "Total War: Warhammer III",
  "Company of Heroes 3",
  "XCOM 2",
  "Crusader Kings III",
  "Europa Universalis IV",
  "Stellaris",
  
  // Racing Games
  "Forza Motorsport",
  "Need for Speed Unbound",
  "The Crew Motorfest",
  "Wreckfest",
  "Dirt Rally 2.0",
  "F1 23",
  
  // Platformers
  "Super Mario Wonder",
  "Sonic Superstars",
  "Crash Bandicoot 4",
  "Spyro Reignited Trilogy",
  "Hollow Knight",
  "Ori and the Will of the Wisps",
  
  // Indie Games
  "Baldur's Gate 3",
  "Sea of Stars",
  "Dave the Diver",
  "Bomb Rush Cyberfunk",
  "Cocoon",
  "Viewfinder",
  "Jusant",
  "Venba"
];

export default function CreateChatroomModal({ isOpen, onClose }: CreateChatroomModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchGameImage = async (gameName: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(gameName)}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
      return "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop";
    } catch (error) {
      console.error("Error fetching image:", error);
      return "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!selectedGame) {
      setError("Please select a game");
      setIsLoading(false);
      return;
    }

    try {
      const game = POPULAR_GAMES.find(g => g === selectedGame);
      if (!game) throw new Error("Invalid game selected");

      // First check if a chatroom with this name already exists
      const { data: existingChatroom, error: checkError } = await supabase
        .from("chatrooms")
        .select("id")
        .eq("name", game)
        .single();

      if (checkError && checkError.code !== "PGRST116") { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingChatroom) {
        setError(`A chatroom for ${game} already exists!`);
        setIsLoading(false);
        return;
      }

      // Fetch image for the game
      const imageUrl = await fetchGameImage(game);

      const { data, error } = await supabase
        .from("chatrooms")
        .insert([
          {
            name: game,
            title: title || game,
            image: imageUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onClose();
        router.push(`/chatroom/${data.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-500 mb-4">Create New Chatroom</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-400 mb-2">Select Game</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-black border-green-700 text-green-100 hover:bg-gray-800"
                >
                  {selectedGame
                    ? selectedGame
                    : "Select a game..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-gray-900 border-green-700">
                <Command className="bg-gray-900">
                  <CommandInput 
                    placeholder="Search games..." 
                    className="text-green-100 border-green-700 focus:border-green-500"
                  />
                  <CommandEmpty className="text-green-400 py-6 text-center">No game found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {POPULAR_GAMES.map((game) => (
                      <div
                        key={game}
                        onClick={() => {
                          setSelectedGame(game);
                          setOpen(false);
                        }}
                        className="text-green-100 hover:bg-green-900/50 cursor-pointer flex items-center justify-between px-4 py-2 hover:text-green-400 transition-colors"
                      >
                        <span>{game}</span>
                        {selectedGame === game && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-green-400 mb-2">Custom Title (Optional)</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border-green-700 text-green-100 focus:border-green-500"
              placeholder="Enter custom title (optional)"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-black font-bold"
              disabled={isLoading || !selectedGame}
            >
              {isLoading ? "Creating..." : "Create Chatroom"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 