const express = require('express');
const router = express.Router();
const {PythonRun, cellSave, getCell } = require('../controllers/CellController')

router.post('/run-python',PythonRun);
router.post('/save-cell',cellSave);
router.get('/get-cells',getCell);

module.exports = router;
