"use client";

import { useState } from "react";
import { ExpressionInput } from "@/components/features/expression-input";
import { ClassificationResult, type ClassificationMatch } from "@/components/features/classification-result";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";

export default function ClassifyPage() {
  const [expression, setExpression] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<ClassificationMatch[]>([]);

  const handleClassify = async (expr: string) => {
    setExpression(expr);
    setIsLoading(true);
    setError(null);
    setMatches([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMatches: ClassificationMatch[] = [
        {
          standardId: "CCSS.MATH.CONTENT.7.EE.A.1",
          standardName: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions",
          confidence: 0.92,
          reasoning: "Expression involves solving a linear equation with one variable",
        },
        {
          standardId: "CCSS.MATH.CONTENT.6.EE.B.7",
          standardName: "Solve real-world and mathematical problems by writing and solving equations",
          confidence: 0.85,
          reasoning: "Expression represents a typical equation-solving problem",
        },
        {
          standardId: "CCSS.MATH.CONTENT.7.EE.B.4",
          standardName: "Use variables to represent quantities in a real-world or mathematical problem",
          confidence: 0.78,
          reasoning: "Expression uses variable 'x' to represent an unknown quantity",
        },
      ];
      
      setMatches(mockMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setExpression("");
    setMatches([]);
    setError(null);
  };

  return (
    <div>
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Expression Classification</h1>
        <p className="text-gray-600 mt-2">
          Classify mathematical expressions and find matching standards
        </p>
      </div>

      <div className="max-w-3xl">
        <ExpressionInput
          onSubmit={handleClassify}
          disabled={isLoading}
          placeholder="Enter a mathematical expression (e.g., '2x + 5 = 15')"
        />

        {isLoading && (
          <div className="mt-6">
            <LoadingState message="Classifying expression..." />
          </div>
        )}

        {error && (
          <div className="mt-6">
            <ErrorDisplay
              title="Classification Failed"
              message={error}
              onRetry={() => handleClassify(expression)}
            />
          </div>
        )}

        {matches.length > 0 && !isLoading && !error && (
          <div className="mt-6">
            <ClassificationResult
              expression={expression}
              matches={matches}
            />
            <div className="mt-4">
              <Button onClick={handleReset} variant="outline">
                Classify Another Expression
              </Button>
            </div>
          </div>
        )}

        {matches.length === 0 && !isLoading && !error && (
          <div className="mt-12 rounded-lg border border-dashed border-gray-300 p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How it works
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter a mathematical expression above to:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 max-w-md mx-auto text-left">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Analyze the expression structure and components</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Match it against our database of math standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Get aligned standards with confidence scores</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
