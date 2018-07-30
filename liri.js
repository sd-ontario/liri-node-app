require("dotenv").config();

var http = require("http");

var queryString = require("query-string");

var inquirer = require("inquirer");

var fs = require("fs");

var keys = require("./keys");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdbKey = keys.omdb.api_key;

function getInput() {
  console.log('\n');
  inquirer.prompt([
      {
          type: 'list',
          name: 'initMsg',
          message: 'Hi, I am LIRI.  Choose one of the commands below.',
          choices: [
              'my-tweets',
              'spotify-this-song',
              'movie-this',
              'do-what-it-says',
              'exit'
          ]
      }
  ])
  .then(function(inquirerResponse) {
      console.log(inquirerResponse.initMsg);
      executeUserCmd(inquirerResponse.initMsg);
  })
  
}

getInput();

function executeUserCmd(command){
  

  switch (command){
    case "my-tweets":

    inquirer.prompt([

      {
        type: 'input',
        name: 'account',
        message: 'Type the name of the account you want to search. ',
        validate: function (input) {return (input != "")},
        default: 'D94Stephen'
      }
    ]).then(function(inquirerResponse){

      console.log(inquirerResponse.account);
      var account = inquirerResponse.account;

      client.get(
        'statuses/user_timeline',
        { screen_name: account, count: 5 },
        function(error, tweets, response) {
            if (!error) {
              console.log("\nTweets:\n-----------------------------------")
              tweets.forEach(element => {console.log(element.text)});
                
              
            } else {
                res.status(500).json({ error: error });
            }
            getInput();
        }

    )
    
  });
  break;

  case "spotify-this-song":

  inquirer.prompt([
    {
        type: 'input',
        name: 'song',
        message: 'Type the name of the song to Spotify. ',
        validate: function (input) { return (input != "") },
        default: 'Ace of Base'
    }
]).then(function(inquirerResponse) {

    var song = inquirerResponse.song

    spotify.search({ type: 'track', query: song, limit:1 }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
    
    console.log("\nResults:\n-----------------------------------------")
    console.log("Artist:", data.tracks.items[0].artists[0].name);
    console.log("Song Name:", data.tracks.items[0].name);
    console.log("Preview Link:", data.tracks.items[0].preview_url);
    console.log("Album:", data.tracks.items[0].album.name);

    getInput();
    
    });
    
});

break;
case "movie-this":

inquirer.prompt([
  {
    type:'input',
    name: 'title',
    message: "Type your movie title. ",
    validate: function(input) { return(input != "")},
    default: 'Mr. Nobody'
  }
]).then(function(inquirerResponse){

  var title = inquirerResponse.title;
  var params = queryString.stringify({t: title});

  http.get(`http://www.omdbapi.com/?apikey=${omdbKey}&${params}`, (resp) => {
    let data = '';

    
    resp.on('data', (chunk) => {
    data += chunk;

    data = JSON.parse(data);

    console.log("\nResults\n-------------------------------------------------")
    console.log("Title of the movie:", data.Title);
    console.log("Year released:", data.Year);
    console.log("IMDB rating:", data.Ratings[0].Value);
    console.log("Rotten Tomatoes rating:", data.Ratings[1].Value);
    console.log("Language:", data.Language);
    console.log("Plot:", data.Plot);
    console.log("Actors:", data.Actors);

    getInput();
    });
})



})
break;
case "do-what-it-says":
  
  }
}



