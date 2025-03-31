"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUsername(session.user.user_metadata.username);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUsername(session.user.user_metadata.username);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    router.push("/auth");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-green-400">{username}</span>
              <Button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleSignIn}
              className="bg-green-600 hover:bg-green-700 text-black font-bold"
            >
              Sign In
            </Button>
          )}
        </div>

        <Button variant="ghost" className="md:hidden text-green-500">
          <Menu />
        </Button>
      </div>
    </nav>
  );
}
