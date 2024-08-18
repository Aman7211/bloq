import React, { useState, useEffect } from 'react';
import Cell from './components/Cell';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  const [cells, setCells] = useState([]);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);

  useEffect(() => {
    const fetchCells = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/get-cells');
        setCells(response.data.cells); // Set the fetched cells
        if (response.data.cells.length > 0) {
          setSelectedCellIndex(0); // Automatically select the first cell if available
        }
      } catch (error) {
        console.error('Failed to fetch cells:', error);
      }
    };

    fetchCells();
  }, []);

  const addCell = () => {
    const newCell = { id: Date.now(), code: '', output: '' };
    setCells((prevCells) => {
      const updatedCells = [...prevCells, newCell];
      setSelectedCellIndex(updatedCells.length - 1); // Automatically select the newly added cell
      return updatedCells;
    });
  };

  const saveCell = async (code, output) => {
    if (selectedCellIndex !== null) {
      const updatedCells = [...cells];
      updatedCells[selectedCellIndex] = { ...updatedCells[selectedCellIndex], code, output };
      setCells(updatedCells); // Update the local state with new code and output

      try {
        await axios.post('http://localhost:4000/api/save-cell', updatedCells[selectedCellIndex]);
      } catch (error) {
        console.error('Failed to save cell:', error);
      }
    }
  };

  const selectCell = (index) => {
    setSelectedCellIndex(index); // Update the selected cell index
  };

  return (
    <>
    <Header/>
    <div className="flex md:h-auto h-screen">
      {/* Sidebar */}
      <div className="md:w-[15%] md:mr-10 p-8 bg-gray-200">
        <h2 className="text-xl font-bold mb-4">Cells</h2>
        <ul>
          {cells.map((cell, index) => (
            <li
              key={cell.id}
              className={`mb-2 cursor-pointer ${selectedCellIndex === index ? 'font-bold text-red-800' : ''}`}
              onClick={() => selectCell(index)}
            >
              <span>Code {index + 1}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-4 ">
        <h1 className="text-3xl font-bold my-6 underline underline-offset-8">Python Code Editor </h1>
        <button
          onClick={addCell}
          className="px-4 py-2 bg-red-800 text-white font-bold text-lg my-3 rounded-md mb-10"
        >
          Add Cell
        </button>

        {/* Display only the selected cell */}
        {selectedCellIndex !== null && (
          <Cell
            key={cells[selectedCellIndex].id}
            initialCode={cells[selectedCellIndex].code}
            initialOutput={cells[selectedCellIndex].output}
            onSave={saveCell}
          />
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default App;
