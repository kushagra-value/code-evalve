import React, { useEffect, useRef, useState } from "react";
import { createHighlighter } from "shiki";
import { Language } from "../types";
import { ActionButtons } from "./ActionButtons";

interface CodeEditorProps {
  code: string;
  language: string;
  languages: Language[];
  selectedLanguageId: number;
  onCodeChange: (code: string) => void;
  onLanguageChange: (languageId: number) => void;
  onRunCode: () => Promise<void>;
  onSubmitCode: () => Promise<void>;
  isRunning: boolean;
  isSubmitting: boolean;
  hasCode: boolean;
  sidebarCollapsed?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  languages,
  selectedLanguageId,
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  isRunning,
  isSubmitting,
  hasCode,
  sidebarCollapsed,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [highlighter, setHighlighter] = useState<any>(null);
  const [lineCount, setLineCount] = useState(1);

  const getLanguageMapping = (languageId: number) => {
    const langName = languages.find((l) => l.id === languageId)?.name || "";
    if (langName.includes("Python")) return "python";
    if (langName.includes("JavaScript") || langName.includes("Node.js"))
      return "javascript";
    if (langName.includes("C++")) return "cpp";
    if (langName.includes("Java")) return "java";
    if (langName.includes("C#")) return "csharp";
    if (langName.includes("C ")) return "c";
    return "python";
  };

  useEffect(() => {
    createHighlighter({
      themes: ["github-light"],
      langs: ["python", "javascript", "cpp", "java", "csharp", "c"],
    }).then(setHighlighter);
  }, []);

  useEffect(() => {
    if (highlighter) {
      try {
        if (!code) {
          // Handle empty code case
          setHighlightedCode("");
        } else {
          const highlighted = highlighter.codeToHtml(code, {
            lang: getLanguageMapping(selectedLanguageId),
            theme: "github-light",
          });
          setHighlightedCode(highlighted);
        }
      } catch (error) {
        setHighlightedCode("");
      }
    }
  }, [highlighter, code, selectedLanguageId, languages]);

  useEffect(() => {
    // Calculate line numbers based on code content
    const lines = code.split("\n").length || 1;
    setLineCount(Math.min(lines, 10000)); // Cap at 10,000 lines
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      onCodeChange(newCode);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate line numbers
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="bg-gray-100 rounded-lg rounded-b-none overflow-hidden [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-button]:hidden">
      <div className="bg-white pl-4 py-1 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 font-[400]">Language</span>
          <select
            value={selectedLanguageId}
            onChange={(e) => onLanguageChange(Number(e.target.value))}
            className="bg-white text-gray-500 font-[400] px-2 py-1 rounded border border-gray-400 focus:border-blue-500 focus:outline-none"
            style={{}}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <ActionButtons
          onRunCode={onRunCode}
          onSubmitCode={onSubmitCode}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          hasCode={hasCode}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>

      <div className="pl-12 py-2 text-gray-400 font-medium">Input</div>

      <div className="flex relative" style={{ height: "400px" }}>
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="bg-gray-50 text-gray-500 text-right pr-2 py-4 w-12 border-r border-gray-200 overflow-hidden select-none"
          style={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className="leading-relaxed text-center pl-2 text-gray-400 font-medium"
            >
              {num}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <div className="flex-1 relative overflow-hidden">
          <pre
            ref={preRef}
            className="absolute inset-0 overflow-auto pointer-events-none bg-white"
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: "14px",
              lineHeight: "1.5",
              padding: "16px",
              paddingLeft: "8px",
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder="Write your code here..."
            className="w-full h-full p-4 pl-2 bg-transparent text-transparent caret-black resize-none outline-none font-mono text-sm leading-relaxed relative z-10"
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: "14px",
              lineHeight: "1.5",
            }}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="pl-12 py-3 text-gray-400 font-medium">Output</div>
    </div>
  );
};
