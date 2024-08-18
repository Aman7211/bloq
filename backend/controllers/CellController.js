const Cell = require("../models/CellSchema");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Endpoint to run Python code
exports.PythonRun = (req, res) => {
    const { code, inputs } = req.body; // Get inputs from the request
    let modifiedCode = code;

    // Replace input() calls with predefined values
    if (inputs && Array.isArray(inputs)) {
        inputs.forEach((input, index) => {
            const inputRegex = new RegExp(`input\\(.*?\\)`, 'm');
            modifiedCode = modifiedCode.replace(inputRegex, `"${input}"`);
        });
    }

    const tempScriptPath = path.join(__dirname, 'temp_script.py'); // Path to temp_script.py

    fs.writeFile(tempScriptPath, modifiedCode, (err) => {
        if (err) {
            console.error('Error writing to temp file:', err);
            return res.status(500).json({ success: false, error: 'Failed to write temp file' });
        }

        // Use double quotes around the file path to handle spaces
        exec(`python3 "${tempScriptPath}"`, (error, stdout, stderr) => {
            fs.unlink(tempScriptPath, (unlinkError) => {
                if (unlinkError) console.error('Error deleting temp file:', unlinkError);
            }); // Clean up temp file

            if (error) {
                console.error('Error executing Python code:', stderr);
                return res.status(500).json({ success: false, error: stderr });
            }
            res.json({ success: true, output: stdout });
        });
    });
};




// save a cell
exports.cellSave = async (req, res) => {
    try {
        const { code, output } = req.body;

        const cell = new Cell({ code, output });
        await cell.save();

        return res.status(200).json({ 
            success:true,
            message: 'Cell saved successfully'
         });

    } catch (error) {
          return res.status(500).json({ 
            success:false,
            message:"Error in Saving Cell",
             });
    }
};

// get all cells
exports.getCell = async (req, res) => {
    try {
        const cells = await Cell.find();
        return res.status(200).json(
            {
                success:true,
                message:"Cells Successfully Fetched from the database",
                cells
    });
    } catch (error) {

        return res.status(500).json({ 
            success:false,
            message:"Error in Fetching the cells from the db",
             });
    }
};





