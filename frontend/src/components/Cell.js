import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cell = ({ initialCode = '', initialOutput = '', onSave }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialOutput);
  const [inputs, setInputs] = useState([]); // State for inputs

  useEffect(() => {
    setCode(initialCode);
    setOutput(initialOutput);
  }, [initialCode, initialOutput]);

  const runCode = async () => {
    if (!code.trim()) {
      setOutput('Please enter code to run.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/run-python', { code, inputs });
      const result = response.data.output || response.data.error;
      setOutput(result);

      if (onSave) {
        onSave(code, result);
      }
    } catch (error) {
      setOutput('Error running code');
      console.error('Error running Python code:', error);
    }
  };

  return (
    <div className="p-4 border rounded-md mb-4 bg-gray-100">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full mb-2 border rounded-md bg-black text-green-400 text-xl p-4"
        placeholder="Write your Python code here"
        rows="10"
      />
      <div className="mb-4">
        {/* Dynamic input fields based on required inputs */}
        {inputs.map((input, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 mb-2 border rounded-md"
            placeholder={`Input value ${index + 1}`}
            onChange={(e) => {
              const newInputs = [...inputs];
              newInputs[index] = e.target.value;
              setInputs(newInputs);
            }}
          />
        ))}
        <button
          onClick={() => setInputs([...inputs, ''])}
          className="px-4 py-2 bg-green-700 text-white rounded-md"
        >
          Add Input
        </button>
      </div>
      <button
        onClick={runCode}
        className="px-4 py-2 bg-red-800 text-white rounded-md"
      >
        Run
      </button>
      <div className="mt-4 p-2 bg-white border rounded-md overflow-hidden">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Cell;
