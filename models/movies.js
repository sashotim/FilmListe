var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   year: String,
   iMDBlink: String,
   seen: Boolean
});

module.exports = mongoose.model("Movie", movieSchema);
