import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import Output from './Output';
import CircularProgress from '@mui/material/CircularProgress';

const themes = [
  { name: 'vs-dark', bg: 'bg-gray-800', text: 'text-white' },
  { name: 'light', bg: 'bg-gray-200', text: 'text-gray-900' },
];

const languages = [
  { name: 'javascript', defaultCode: '// Write your JavaScript code here\nconsole.log("Hello, JavaScript!");', judge0Lang: 63 },
  { name: 'typescript', defaultCode: '// Write your TypeScript code here\nconst greeting: string = "Hello, TypeScript!";\nconsole.log(greeting);', judge0Lang: 74 },
  { name: 'python', defaultCode: '# Write your Python code here\nprint("Hello, Python!")', judge0Lang: 71 },
  { name: 'java', defaultCode: '// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}', judge0Lang: 62 },
  { name: 'cpp', defaultCode: '// Write your C++ code here\n#include <iostream>\nint main() {\n  std::cout << "Hello, C++!" << std::endl;\n  return 0;\n}', judge0Lang: 54 },
];

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0"
};

function CodeWindow() {
  const [language, setLanguage] = useState(languages[0].name);
  const [theme, setTheme] = useState(themes[1].name);
  const [code, setCode] = useState(languages[0].defaultCode);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (newLanguage) => {
    const selectedLanguage = languages.find((lang) => lang.name === newLanguage);
    setLanguage(newLanguage);
    setCode(selectedLanguage.defaultCode);
  };

  const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  const executeCode = async (language, sourceCode) => {
    setLoading(true);
    try {
      const response = await API.post("/execute", {
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: sourceCode }],
      });
      setLoading(false);
      return response.data.run.stdout || "Execution was successful, but no output.";
    } catch (error) {
      setLoading(false);
      return `Error: ${error.message || "Failed to execute code"}`;
    }
  };

  const handleRunCode = async () => {
    const result = await executeCode(language, code);
    setOutput(result);
    setShowOutput(true);
  };

  const currentTheme = themes.find((t) => t.name === theme);

  return (
    <div className="flex flex-col h-screen p-4">
      <div
        className={`flex items-center justify-between ${currentTheme.bg} ${currentTheme.text} p-4 shadow-lg`}
      >
        <div className="flex space-x-4">
          <button
            onClick={handleRunCode}
            className='text-white bg-green-600 px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105'
          >
            Run Code
          </button>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 transition ${currentTheme.bg} ${currentTheme.text}`}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 transition ${currentTheme.bg} ${currentTheme.text}`}
          >
            {themes.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name.charAt(0).toUpperCase() + t.name.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height="80vh"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme={theme}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorBlinking: 'expand',
        }}
      />

      {/* Centered Loader and Output Modal */}
      {loading ? (
        <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      ) : (
        showOutput && <Output output={output} onClose={() => setShowOutput(false)} />
      )}
    </div>
  );
}

export default CodeWindow;
