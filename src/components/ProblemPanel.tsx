// ProblemPanel.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import { Problem } from "../types";

interface ProblemPanelProps {
  problem: Problem;
  onOpenSidebar?: () => void;
  currentQuestion: number;
  totalProblems: number;
  onSkip?: () => void;
  sidebarCollapsed?: boolean;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  onOpenSidebar,
  currentQuestion,
  totalProblems,
  onSkip,
  sidebarCollapsed,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const difficultyText =
    problem.nxthyre_diff.charAt(0).toUpperCase() +
    problem.nxthyre_diff.slice(1);

  return (
    <div className="bg-white pt-5 pb-6 rounded-lg h-full relative overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-button]:hidden">
      {onOpenSidebar && (
        <div className="flex px-6 items-center justify-between border-b-2 border-gray-300 pb-4 mb-2 ">
          <div className="flex items-center space-x-4 ">
            {sidebarCollapsed && (
              <button
                onClick={onOpenSidebar}
                className="flex space-x-2 items-center px-3 py-2 bg-white text-gray-500 border border-gray-500 rounded-md transition-colors text-sm font-medium"
              >
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 18 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5"
                >
                  <path
                    d="M2.25 7.16406C2.25 7.38266 2.18402 7.59635 2.0604 7.77811C1.93679 7.95987 1.76109 8.10154 1.55552 8.18519C1.34995 8.26885 1.12375 8.29074 0.905524 8.24809C0.687295 8.20544 0.486839 8.10017 0.329505 7.9456C0.172171 7.79103 0.0650254 7.59409 0.0216171 7.37969C-0.0217913 7.16529 0.000487447 6.94306 0.085636 6.7411C0.170785 6.53914 0.314979 6.36652 0.499984 6.24507C0.684989 6.12362 0.902497 6.0588 1.125 6.0588C1.42327 6.05913 1.70922 6.17568 1.92013 6.38288C2.13103 6.59009 2.24967 6.87103 2.25 7.16406ZM1.125 11.9535C0.902497 11.9535 0.684989 12.0184 0.499984 12.1398C0.314979 12.2613 0.170785 12.4339 0.085636 12.6358C0.000487447 12.8378 -0.0217913 13.06 0.0216171 13.2744C0.0650254 13.4888 0.172171 13.6858 0.329505 13.8403C0.486839 13.9949 0.687295 14.1002 0.905524 14.1428C1.12375 14.1855 1.34995 14.1636 1.55552 14.0799C1.76109 13.9963 1.93679 13.8546 2.0604 13.6729C2.18402 13.4911 2.25 13.2774 2.25 13.0588C2.24967 12.7658 2.13103 12.4848 1.92013 12.2776C1.70922 12.0704 1.42327 11.9539 1.125 11.9535ZM1.125 0.164062C0.902497 0.164062 0.684989 0.228885 0.499984 0.350333C0.314979 0.471781 0.170785 0.644399 0.085636 0.84636C0.000487447 1.04832 -0.0217913 1.27055 0.0216171 1.48495C0.0650254 1.69935 0.172171 1.89629 0.329505 2.05086C0.486839 2.20544 0.687295 2.3107 0.905524 2.35335C1.12375 2.396 1.34995 2.37411 1.55552 2.29046C1.76109 2.2068 1.93679 2.06514 2.0604 1.88338C2.18402 1.70162 2.25 1.48793 2.25 1.26933C2.24967 0.976292 2.13103 0.695354 1.92013 0.488148C1.70922 0.280942 1.42327 0.16439 1.125 0.164062ZM5.25 2.00617H17.25C17.4489 2.00617 17.6397 1.92854 17.7803 1.79035C17.921 1.65217 18 1.46475 18 1.26933C18 1.0739 17.921 0.886484 17.7803 0.7483C17.6397 0.610115 17.4489 0.532484 17.25 0.532484H5.25C5.05109 0.532484 4.86032 0.610115 4.71967 0.7483C4.57902 0.886484 4.5 1.0739 4.5 1.26933C4.5 1.46475 4.57902 1.65217 4.71967 1.79035C4.86032 1.92854 5.05109 2.00617 5.25 2.00617ZM17.25 6.42722H5.25055C5.05164 6.42722 4.86087 6.50485 4.72022 6.64304C4.57957 6.78122 4.50055 6.96864 4.50055 7.16406C4.50055 7.35949 4.57957 7.5469 4.72022 7.68509C4.86087 7.82327 5.05164 7.9009 5.25055 7.9009H17.25C17.4489 7.9009 17.6397 7.82327 17.7803 7.68509C17.921 7.5469 18 7.35949 18 7.16406C18 6.96864 17.921 6.78122 17.7803 6.64304C17.6397 6.50485 17.4489 6.42722 17.25 6.42722ZM17.25 12.322H5.25055C5.05164 12.322 4.86087 12.3996 4.72022 12.5378C4.57957 12.676 4.50055 12.8634 4.50055 13.0588C4.50055 13.2542 4.57957 13.4416 4.72022 13.5798C4.86087 13.718 5.05164 13.7956 5.25055 13.7956H17.25C17.4489 13.7956 17.6397 13.718 17.7803 13.5798C17.921 13.4416 18 13.2542 18 13.0588C18 12.8634 17.921 12.676 17.7803 12.5378C17.6397 12.3996 17.4489 12.322 17.25 12.322Z"
                    fill="#181D25"
                  />
                </svg>
                <div>
                  Problem {currentQuestion + 1}/{totalProblems}
                </div>
              </button>
            )}
            <span
              className={`px-3 py-2 rounded-md text-sm font-medium ${getDifficultyColor(
                problem.nxthyre_diff
              )}`}
            >
              {difficultyText}
            </span>
          </div>
          <div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-2 bg-white text-gray-500 rounded-md transition-colors text-sm font-[400] border border-gray-400"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      )}
      <div className="mb-3 px-6">
        <h2 className="text-xl font-bold text-gray-500 mb-3">
          {problem.name.split(".")[1]}
        </h2>
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>Time Limit: {problem.time_limit_seconds}s</span>
          <span>
            Memory Limit:{" "}
            {Math.round(problem.memory_limit_bytes / (1024 * 1024))}MB
          </span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none mb-8 px-6">
        <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </div>
      </div>

      <div className="space-y-6 px-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">
            Sample Input
          </h3>
          <pre className="bg-gray-50 p-3 rounded text-sm text-gray-500 overflow-x-auto">
            {problem.sample_test_case.input_data.trim()}
          </pre>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">
            Sample Output
          </h3>
          <pre className="bg-gray-50 p-3 rounded text-sm text-gray-500 overflow-x-auto">
            {problem.sample_test_case.expected_output.trim()}
          </pre>
        </div>
      </div>
    </div>
  );
};
