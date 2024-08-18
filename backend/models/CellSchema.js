const mongoose = require('mongoose');

const CellSchema = new mongoose.Schema({
    code:
    {
    type:String,
    required: true
    }, 
    output:
    {
        type:String,
    }
  });
  
  module.exports = mongoose.model('Cell', CellSchema);