"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        if (data?.user) router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw new Error(error.message);
        if (data?.user) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            {
              email,
              password,
            }
          );
          if (signInError) throw new Error(signInError.message);
          router.push("/");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-green-500 mb-2 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-green-400 text-center mb-8">
            {isLogin
              ? "Sign in to continue to GameChat"
              : "Join the gaming community today"}
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}
          <div className="bg-black border border-green-900 rounded-lg p-6 md:p-8 shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-green-400 block">Username</label>
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border-green-700 text-green-100 focus:border-green-500"
                    placeholder="Enter your username"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-green-400 block">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border-green-700 text-green-100 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-green-400 block">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-green-700 text-green-100 focus:border-green-500"
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:text-green-300 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
