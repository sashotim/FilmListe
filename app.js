var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    Movie = require("./models/movies"),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    request = require("request"),
    authRoutes = require("./routes/auth-routes"),
    passportSetup = require("./config/passport-setup");

//mongoose.connect("mongodb://localhost/film_list");
mongoose.connect("mongodb://sashotim:sashotim96@ds119736.mlab.com:19736/film-list");
//mongodb://sashotim:sashotim96@ds119736.mlab.com:19736/film-list
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//set up routes

app.use('/auth', authRoutes);

app.get("/", function(req, res) {
    Movie.find({}, function(err, movies) {
        if (err) {
            res.render("/");
            console.log(err);
        }
        else {
            res.render("landing", { movies: movies });
        }
    }).sort({ "_id": -1 });
});


app.post("/", function(req, res) {
    var filmName = req.body.film.name;
    var url = "http://www.omdbapi.com/?apikey=72ea8fe8&t=" + filmName;
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            if (data["Response"] != "False") {
                Movie.create({
                    name: data["Title"],
                    image: data["Poster"],
                    description: data["Plot"],
                    year: data["Year"],
                    iMDBlink: data["imdbID"],
                    seen: false
                }, function(err, movie) {
                    if (err) {
                        res.render("/");
                        console.log(err);
                    }
                    else {
                        res.redirect("/");
                    }
                });
            }
            else {
                res.redirect("/");
            }
        }
    });
});

app.delete("/:id", function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err);
        }
        else {
            movie.remove();
            res.redirect("/");
        }
    });
});


app.put("/:id", function(req, res) {
    Movie.findByIdAndUpdate(req.params.id, { seen: "true" }, function(err, movie) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
});

Movie.findOneAndUpdate({ "image": "N/A" }, { "image": "http://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg" }, function(err, movie) {
    console.log(movie);
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Movie List has started!!!");
});
