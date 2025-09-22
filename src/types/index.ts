export interface Candidate {
  id: string;
  full_name: string;
  email: string;
}

export interface Contest {
  name: string;
  duration: number;
}

export interface SampleTestCase {
  input_data: string;
  expected_output: string;
}

export interface Problem {
  id: number;
  name: string;
  description: string;
  nxthyre_diff: "easy" | "medium" | "hard";
  time_limit_seconds: number;
  memory_limit_bytes: number;
  sample_test_case: SampleTestCase;
}

export interface Assessment {
  id: number;
  unique_link_id: string;
  status: string;
  expires_at: string;
  candidate: Candidate;
  contest: Contest;
  problems: Problem[];
}

export interface Language {
  id: number;
  name: string;
}

export interface RunCodeRequest {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
}

export interface RunCodeResponse {
  status_id: number;
  language_id?: number;
  stdout?: string;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string;
  memory?: number;
}

export interface SubmissionRequest {
  assessment_id: number;
  problem_id: number;
  language_id: number;
  source_code: string;
}

export interface SubmissionResponse {
  message: {
    message: string;
    total_test_cases: number;
    passed_test_cases: number;
    overall_status: string;
  };
}

export interface QuestionStatus {
  status: "not-attempted" | "attempted" | "completed";
  code: string;
  languageId: number;
}

export interface TimerState {
  timeLeft: number;
  isActive: boolean;
  startTime: number;
}
