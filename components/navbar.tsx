import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-green-900 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-green-500 font-bold text-2xl mr-8">
            GameChat
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-green-400 hover:text-green-300">
              Home
            </Link>
            <Link
              href="/explore"
              className="text-green-400 hover:text-green-300"
            >
              Explore
            </Link>
            <Link
              href="/popular"
              className="text-green-400 hover:text-green-300"
            >
              Popular
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search games..."
              className="pl-10 bg-black border-green-700 text-green-100 focus:border-green-500 w-64"
            />
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-black font-bold">
            Sign In
          </Button>
        </div>

        <Button variant="ghost" className="md:hidden text-green-500">
          <Menu />
        </Button>
      </div>
    </nav>
  );
}
