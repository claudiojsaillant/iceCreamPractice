var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  name: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order"
  }
});

// This creates our model from the above schema, using mongoose's model method
var List = mongoose.model("List", ArticleSchema);

// Export the Article model
module.exports = List;
