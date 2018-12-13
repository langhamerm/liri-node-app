require("dotenv").config();
var fs = require("fs");
var file = require('file-system');
file.readFile === fs.readFile;
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var bandsintown = require('bandsintown');
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];
// Fetch Spotify Keys
var spotify = new Spotify(keys.spotify);
// Writes to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: secondCommand
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};
//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "concert-this":
            getConcerts();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }
};
//BIT Concerts: concert- this
function getConcerts() {
    var artist = secondCommand;
    var bitUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(bitUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var JS = JSON.parse(body);
            for (i = 0; i < JS.length; i++) {
                var dateTime = JS[i].datetime;
                var month = dateTime.substring(5, 7);
                var year = dateTime.substring(0, 4);
                var day = dateTime.substring(8, 10);
                var dateForm = month + "/" + day + "/" + year

                console.log("\n---------------------------------------------------\n");
                console.log("Name: " + JS[i].venue.name);
                console.log("City: " + JS[i].venue.city);
                if (JS[i].venue.region !== "") {
                    console.log("Country: " + JS[i].venue.region);
                }
                console.log("Country: " + JS[i].venue.country);
                console.log("Date: " + dateForm);
                console.log("\n---------------------------------------------------\n");

            }
        }
    });
}
//OMDB Movie - command: movie-this
function getMovie() {
    // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
    var movieName = secondCommand;
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful = 200
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            //Simultaneously output to console and log.txt via NPM simple-node-logger
            console.log('================ Movie Info ================');
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            console.log('==================THE END=================');

        } else {
            //else - throw error
            console.log("Error occurred.")
        }
        //Response if user does not type in a movie title
        if (movieName === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    });
}

//Function for command do-what-it-says; reads and splits random.txt file
//command: do-what-it-says
function doWhat() {
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error);
        console.log(data.toString());
        //split text with comma delimiter
        data.toString().split(',');
    });
}
//Call mySwitch function
mySwitch(userCommand);