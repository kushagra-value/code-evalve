// src/pages/AssessmentPage.tsx
import React, { useState, useEffect, useCallback } from "react";
// import { Timer } from "../components/Timer";
import { Sidebar } from "../components/Sidebar";
import { ProblemPanel } from "../components/ProblemPanel";
import { CodeEditor } from "../components/CodeEditor";
import { TestResults } from "../components/TestResults";
// import { ActionButtons } from "../components/ActionButtons";
import { LoadingScreen } from "../components/LoadingScreen";
import { useQuestionStatus } from "../hooks/useQuestionStatus";
import { apiService } from "../services/api";
import { Assessment, Language, RunCodeResponse } from "../types";
import CandidateScreenHeader from "../components/Header";

interface Props {
  assessment: Assessment;
  setAssessment?: React.Dispatch<React.SetStateAction<Assessment | null>>;
}

export const AssessmentPage: React.FC<Props> = ({
  assessment,
  setAssessment,
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<RunCodeResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [lastTestAction, setLastTestAction] = useState<"run" | "submit" | null>(
    null
  );

  const handleTimeUp = useCallback(async () => {
    try {
      await apiService.updateAssessmentStatus(assessment.id, "completed");
      if (setAssessment) {
        setAssessment((prev) =>
          prev ? { ...prev, status: "completed" } : null
        );
      }
      alert("Time is up! Your assessment has been automatically submitted.");
    } catch (error) {
      console.error("Failed to auto-submit assessment:", error);
    }
  }, [assessment, setAssessment]);

  const { questionStatus, updateQuestionStatus, getQuestionStatus } =
    useQuestionStatus(assessment?.problems.length || 5);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await apiService.getLanguages();
        setLanguages(languagesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load languages"
        );
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  useEffect(() => {
    // Assuming assessment.duration is in minutes
    const durationMs = assessment.contest.duration * 60 * 1000;
    const timer = setTimeout(handleTimeUp, durationMs);

    return () => clearTimeout(timer);
  }, [assessment, handleTimeUp]);

  const handleCodeChange = useCallback(
    (code: string) => {
      updateQuestionStatus(currentQuestion, {
        code,
        status: code.trim() ? "attempted" : "not-attempted",
      });
    },
    [currentQuestion, updateQuestionStatus]
  );

  const handleLanguageChange = useCallback(
    (languageId: number) => {
      updateQuestionStatus(currentQuestion, { languageId });
    },
    [currentQuestion, updateQuestionStatus]
  );

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestion(index);
    setTestResults(null);
    setTestError(null);
    setSubmissionResult(null);
    setLastTestAction(null);
  }, []);

  const handleSkip = useCallback(() => {
    const nextQuestion = (currentQuestion + 1) % assessment.problems.length;
    handleQuestionSelect(nextQuestion);
  }, [currentQuestion, assessment, handleQuestionSelect]);

  const handleRunCode = useCallback(async () => {
    const currentStatus = getQuestionStatus(currentQuestion);
    if (!currentStatus.code.trim()) {
      setTestError("Please write some code before running.");
      return;
    }

    setLastTestAction("run");
    setIsRunning(true);
    setTestError(null);
    setSubmissionResult(null);

    try {
      const problem = assessment.problems[currentQuestion];
      const result = await apiService.runCode({
        language_id: currentStatus.languageId,
        source_code: currentStatus.code,
        stdin: problem.sample_test_case.input_data,
        expected_output: problem.sample_test_case.expected_output,
      });

      setTestResults(result);
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "Failed to run code");
    } finally {
      setIsRunning(false);
    }
  }, [assessment, currentQuestion, getQuestionStatus]);

  const handleSubmitCode = useCallback(async () => {
    const currentStatus = getQuestionStatus(currentQuestion);
    if (!currentStatus.code.trim()) {
      setTestError("Please write some code before submitting.");
      return;
    }

    setLastTestAction("submit");
    setIsSubmitting(true);
    setTestError(null);
    setTestResults(null);

    try {
      const problem = assessment.problems[currentQuestion];
      const result = await apiService.submitSolution({
        assessment_id: assessment.id,
        problem_id: problem.id,
        language_id: currentStatus.languageId,
        source_code: currentStatus.code,
      });

      setSubmissionResult({
        total_test_cases: result.message.total_test_cases,
        passed_test_cases: result.message.passed_test_cases,
        overall_status: result.message.overall_status,
        message: result.message.message,
      });

      console.log("Submission result set:", {
        total_test_cases: result.message.total_test_cases,
        passed_test_cases: result.message.passed_test_cases,
        overall_status: result.message.overall_status,
        message: result.message.message,
      });

      updateQuestionStatus(currentQuestion, {
        status:
          result.message.overall_status === "Accepted"
            ? "completed"
            : "attempted",
      });
    } catch (err) {
      setTestError(
        err instanceof Error ? err.message : "Failed to submit solution"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [assessment, currentQuestion, getQuestionStatus, updateQuestionStatus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunCode]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg border border-red-500 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Assessment Error
          </h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = getQuestionStatus(currentQuestion);
  const testType = lastTestAction || "run";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <CandidateScreenHeader
          assessment={assessment}
          setAssessment={setAssessment}
          page="assessment"
        />
      </div>

      <div className="flex h-[calc(125vh)] relative">
        <Sidebar
          problems={assessment.problems}
          currentQuestion={currentQuestion}
          onQuestionSelect={handleQuestionSelect}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          getQuestionStatus={getQuestionStatus}
        />

        <div
          className={`flex-1 flex transition-all duration-300 pl-4 py-2 ${
            sidebarCollapsed ? "" : "ml-80"
          }`}
        >
          <div className="w-[40%]">
            <ProblemPanel
              problem={assessment.problems[currentQuestion]}
              onOpenSidebar={() => setSidebarCollapsed(false)}
              currentQuestion={currentQuestion}
              totalProblems={assessment.problems.length}
              onSkip={handleSkip}
              sidebarCollapsed={sidebarCollapsed}
            />
          </div>

          <div className="w-[60%] flex flex-col">
            <div className="flex-1 px-4">
              <CodeEditor
                code={currentStatus.code}
                language="python"
                languages={languages}
                selectedLanguageId={currentStatus.languageId}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                onRunCode={handleRunCode}
                onSubmitCode={handleSubmitCode}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                hasCode={!!currentStatus.code.trim()}
                sidebarCollapsed={sidebarCollapsed}
              />
            </div>

            <div className="h-80 px-4">
              <TestResults
                results={testResults}
                isLoading={isRunning || isSubmitting}
                error={testError}
                type={testType}
                submissionResult={submissionResult}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
