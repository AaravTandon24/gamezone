"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onSearch,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(inputValue);
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">
          <Search className="h-5 w-5" />
        </div>

        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 py-6 bg-gray-900 border-green-700 focus:border-green-500 text-white text-lg rounded-lg w-full"
        />

        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-400 hover:bg-transparent"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <Button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-black"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
