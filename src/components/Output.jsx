import React from 'react';

function Output({ output, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Output</h2>
        <pre className="whitespace-pre-wrap overflow-auto max-h-60">
          {output || 'Run your code to see the output here...'}
        </pre>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Output;
