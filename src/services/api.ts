import axios from "axios";
import {
  Assessment,
  Language,
  RunCodeRequest,
  RunCodeResponse,
  SubmissionRequest,
  SubmissionResponse,
} from "../types";

const API_BASE_URL =
  "https://nxthyre-server-staging-863630644667.asia-south1.run.app/";
const JUDGE_BASE_URL = "https://34.55.79.124:2358/";

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  private judgeApi = axios.create({
    baseURL: JUDGE_BASE_URL,
    timeout: 30000,
  });

  async getAssessment(candidateUuid: string): Promise<Assessment> {
    try {
      const response = await this.api.get(`/api/assessment/${candidateUuid}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.status === 404
            ? "Assessment not found. Please check your link."
            : "Failed to load assessment. Please try again."
        );
      }
      throw new Error("Network error. Please check your connection.");
    }
  }

  async updateAssessmentStatus(
    assessmentId: number,
    status: string
  ): Promise<void> {
    try {
      await this.api.patch(`/api/assessment/status/${assessmentId}`, {
        status,
      });
    } catch (error) {
      console.error("Failed to update assessment status:", error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  async getLanguages(): Promise<Language[]> {
    try {
      const response = await this.judgeApi.get("/languages/");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch languages:", error);
      // Return default languages as fallback
      return [
        { id: 71, name: "Python (3.8.1)" },
        { id: 63, name: "JavaScript (Node.js 12.14.0)" },
        { id: 54, name: "C++ (GCC 9.2.0)" },
        { id: 62, name: "Java (OpenJDK 13.0.1)" },
      ];
    }
  }

  async runCode(request: RunCodeRequest): Promise<RunCodeResponse> {
    try {
      // First API call to submit code
      const submissionResponse = await this.judgeApi.post("/submissions", {
        ...request,
        base64_encoded: true, // if base64 encoding is needed
      });

      const { token } = submissionResponse.data;

      if (!token) {
        throw new Error("No submission token received");
      }

      // Poll the second API to get results
      let submissionResult: RunCodeResponse;
      const maxAttempts = 10;
      let attempts = 0;

      // Polling mechanism to check submission status
      while (attempts < maxAttempts) {
        const resultResponse = await this.judgeApi.get(
          `/submissions/${token}?fields=stdout,stderr,compile_output,status_id,language_id,time,memory`
        );

        submissionResult = resultResponse.data;

        // Check if the submission is processed (status_id 3 typically means "Accepted")
        if (submissionResult.status_id && submissionResult.status_id >= 3) {
          return {
            stdout: submissionResult.stdout,
            stderr: submissionResult.stderr,
            compile_output: submissionResult.compile_output,
            status_id: submissionResult.status_id,
            language_id: submissionResult.language_id,
            time: submissionResult.time,
            memory: submissionResult.memory,
          };
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      }

      throw new Error("Submission processing timeout");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to execute code: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      throw new Error("Code execution service is unavailable.");
    }
  }

  async submitSolution(
    request: SubmissionRequest
  ): Promise<SubmissionResponse> {
    try {
      const response = await this.api.post(
        "/api/assessment/submissions/",
        request,
        {
          timeout: 90000, // Set a 30-second timeout
        }
      );
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        throw new Error(
          error.response?.data?.message ||
            "Failed to submit solution. Please try again."
        );
      }
      console.error("Unexpected error:", error);
      throw new Error("Submission service is unavailable.");
    }
  }
}

export const apiService = new ApiService();
