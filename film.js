const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }}, { timestamps: true });

// first argument is the name of the model, when it connects it will look for the plural.
//  second argument is the schema of the model
const Film = mongoose.model('Film', filmSchema);

//  export the module so we can use it elsewhere in the project
module.exports = Film;
