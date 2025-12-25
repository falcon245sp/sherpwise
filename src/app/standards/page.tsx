"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StandardCard, type Standard } from "@/components/features/standard-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function StandardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [standards, setStandards] = useState<Standard[]>([]);

  const mockStandards: Standard[] = [
    {
      id: "1",
      name: "CCSS.MATH.CONTENT.6.EE.A.1",
      description: "Write and evaluate numerical expressions involving whole-number exponents.",
      grade: "6",
      domain: "Expressions & Equations",
      subject: "Mathematics",
    },
    {
      id: "2",
      name: "CCSS.MATH.CONTENT.6.EE.A.2",
      description: "Write, read, and evaluate expressions in which letters stand for numbers.",
      grade: "6",
      domain: "Expressions & Equations",
      subject: "Mathematics",
    },
    {
      id: "3",
      name: "CCSS.MATH.CONTENT.7.EE.A.1",
      description: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.",
      grade: "7",
      domain: "Expressions & Equations",
      subject: "Mathematics",
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setStandards([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockStandards.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setStandards(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Standards Browser</h1>
        <p className="text-gray-600 mt-2">
          Search and explore mathematics standards across all grade levels
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search standards by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading && <LoadingState message="Searching standards..." />}

      {error && (
        <ErrorDisplay
          title="Search Failed"
          message={error}
          onRetry={handleSearch}
        />
      )}

      {!isLoading && !error && standards.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-600">No standards found matching your search.</p>
        </div>
      )}

      {!isLoading && !error && standards.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Enter a search query to find standards</p>
        </div>
      )}

      {!isLoading && !error && standards.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found {standards.length} {standards.length === 1 ? "standard" : "standards"}
          </p>
          {standards.map((standard) => (
            <StandardCard key={standard.id} standard={standard} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookOpen({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
