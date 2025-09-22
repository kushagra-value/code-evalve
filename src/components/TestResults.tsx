import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { RunCodeResponse } from "../types";

interface TestResultsProps {
  results: RunCodeResponse | null;
  isLoading: boolean;
  error: string | null;
  type: "run" | "submit";
  submissionResult?: {
    total_test_cases: number;
    passed_test_cases: number;
    overall_status: string;
    message?: string;
  } | null;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  isLoading,
  error,
  type,
  submissionResult,
}) => {
  // Status mapping based on typical Judge0 status IDs
  const getStatusMessage = (statusId?: number) => {
    switch (statusId) {
      case 3:
        return "Accepted";
      case 4:
        return "Wrong Answer";
      case 5:
        return "Time Limit Exceeded";
      case 6:
        return "Compilation Error";
      case 7:
        return "Runtime Error";
      default:
        return "Processing";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center py-8">
          <Clock className="animate-spin text-blue-500 mr-3" size={24} />
          <span className="text-gray-600">
            {type === "run" ? "Running code..." : "Submitting solution..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-red-500">
        <div className="flex items-center mb-4">
          <XCircle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-600">Error</h3>
        </div>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (type === "submit" && submissionResult) {
    const isSuccess = submissionResult.overall_status === "Accepted";
    const IconComponent = isSuccess ? CheckCircle : XCircle;
    const iconColor = isSuccess ? "text-green-500" : "text-red-500";
    const borderColor = isSuccess ? "border-green-500" : "border-red-500";
    const textColor = isSuccess ? "text-green-600" : "text-red-600";

    return (
      <div className={`bg-white p-6 rounded-lg border ${borderColor}`}>
        <div className="flex items-center mb-4">
          <IconComponent className={iconColor + " mr-3"} size={24} />
          <h3 className="text-lg font-semibold text-gray-600">
            Submission Result
          </h3>
        </div>
        <div className="space-y-2">
          <p className="text-gray-500">
            <span className="font-medium">Status:</span>{" "}
            <span className={textColor}>{submissionResult.overall_status}</span>
          </p>
          <p className="text-gray-500">
            <span className="font-medium">Test Cases</span>{" "}
            {/* <span className={textColor}>
              {submissionResult.passed_test_cases}/
              {submissionResult.total_test_cases} passed
            </span> */}
          </p>
        </div>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                isSuccess ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${
                  (submissionResult.passed_test_cases /
                    submissionResult.total_test_cases) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {submissionResult.passed_test_cases}/
            {submissionResult.total_test_cases} test cases passed
          </p>
        </div>
      </div>
    );
  }

  if (results) {
    const hasError = results.stderr || results.compile_output;
    const isSuccess = !hasError && results.stdout;
    const statusMessage = getStatusMessage(results.status_id);

    return (
      <div className="bg-white p-6 rounded-lg rounded-t-none space-y-4 min-h-[270px]">
        <div className="flex items-center mb-4">
          {isSuccess ? (
            <CheckCircle
              className={`mr-3 ${
                results.status_id == 3 ? "text-green-500" : "text-red-500"
              }`}
              size={24}
            />
          ) : hasError ? (
            <XCircle className="text-red-500 mr-3" size={24} />
          ) : (
            <AlertCircle className="text-yellow-500 mr-3" size={24} />
          )}
          <h3
            className={`text-lg font-semibold ${
              results.status_id == 3 ? "text-green-500" : "text-red-500"
            }`}
          >
            Test Results - {statusMessage}
          </h3>
        </div>

        {results.stdout && (
          <div>
            <h4
              className={`font-medium mb-2 ${
                results.status_id == 3 ? "text-green-500" : "text-red-500"
              }`}
            >
              Output:
            </h4>
            <pre className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500 overflow-x-auto">
              {results.stdout}
            </pre>
          </div>
        )}

        {results.stderr && (
          <div>
            <h4 className="text-red-400 font-medium mb-2">Runtime Error:</h4>
            <pre className="bg-white p-3 rounded text-sm text-red-400 overflow-x-auto">
              {results.stderr}
            </pre>
          </div>
        )}

        {results.compile_output && (
          <div>
            <h4 className="text-red-400 font-medium mb-2">Compile Error:</h4>
            <pre className="bg-white p-3 rounded text-sm text-red-400 overflow-x-auto">
              {results.compile_output}
            </pre>
          </div>
        )}

        {(results.time || results.memory) && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 font-semibold">
            {results.time && <span>Execution Time: {results.time}s</span>}
            {results.memory && <span>Memory: {results.memory} KB</span>}
            {results.status_id && (
              <span>Status: {getStatusMessage(results.status_id)}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg rounded-t-none min-h-[270px]">
      <div className="flex flex-col justify-center py-16 items-center text-gray-600">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>Run your code to see the results</p>
      </div>
    </div>
  );
};
