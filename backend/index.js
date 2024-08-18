const express = require('express');
const cors = require('cors');
const coderoutes = require('./routes/coderoute');
require('dotenv').config();
const connectDB = require('./config/database');
const app = express();
const PORT = process.env.PORT || 7000;
app.use(
    cors()
);
app.use(express.json());

connectDB();
// Routes
app.use('/api', coderoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
