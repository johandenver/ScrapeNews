var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      required: true
    },

    saved: {
      type: Boolean,
      default: false
    },
    
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  });

var Article = mongoose.model("article", ArticleSchema);

module.exports = Article;