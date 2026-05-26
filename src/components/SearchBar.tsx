"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

interface SearchBarProps {
  initialSearch?: string;
  initialLocation?: string;
}

export default function SearchBar({
  initialSearch = "",
  initialLocation = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());

      if (search) params.set("search", search);
      else params.delete("search");

      if (location) params.set("location", location);
      else params.delete("location");

      params.delete("page");
      router.push(`/jobs?${params.toString()}`);
    },
    [search, location, searchParams, router]
  );

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Посада, ключові слова..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Місто, регіон..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        Знайти вакансії
      </button>
    </form>
  );
}
