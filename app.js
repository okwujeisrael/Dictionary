//jshint esversion:6

const express = require ("express");
const bodyParser = require("body-parser");
const request = require("request");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let word = "";
let transcription = "";
let partOfSpeech = "";
let definition = "";
let notAWord = "";


app.get("/", function(req, res) {
  res.render("dictionary", {
    word: word,
    transcription: transcription,
    partOfSpeech: partOfSpeech,
    definition: definition,
    notAWord: notAWord
  });

});

app.post("/", function(req, res) {
  let vocab;
  if( req.body.word !== ""){
    vocab = req.body.word;
  }

  let url = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + vocab + "?key=a881a1a1-1ab4-4288-88fe-d98f16410004";





  request(url, function(error, response, body) {


    let data = JSON.parse(body);


    let undefinedEntry = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/undefined?key=a881a1a1-1ab4-4288-88fe-d98f16410004";

    if (url === undefinedEntry || data.length === 0 || vocab !== data[0].meta.id || data[0].meta.id === undefined){
      word = "";
      transcription = "";
      partOfSpeech = "";
      definition = "";
      notAWord = "Word not found. Please enter another word";
      res.redirect("/");

    } else {
              if (typeof data[0] === "object"){
              word = vocab + " : ";
              transcription = data[0].hwi.prs[0].mw;
              partOfSpeech = data[0].fl;
              definition = "\""+data[0].shortdef[0]+"\"";
              notAWord = "";
            } else if (typeof data[0] === "string" || data.length === 0){
              word = "";
              transcription = "";
              partOfSpeech = "";
              definition = "";
              var message = "Word not found. Please enter another word";
              notAWord = message;

            }

    res.redirect("/");
  }

    

    });



});






app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
