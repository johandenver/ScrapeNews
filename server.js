var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/ insert file name", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {

    axios.get("https://www.nhl.com/").then(function(response) {

        var $ = cheerio.load(response.data);

        $("h4.headline-link").each(function(i, element) {

            var results = {};

            response.title = $(this).text();
            response.link = $(this).parent().attr("href");
        
            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
           
        });
        res.send("Scrape Completed");
        console.log(results);
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })

        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articled/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, { new: true});
        })
})

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  