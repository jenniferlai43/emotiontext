/*
  Goal:
    - evaluate the overall feeling of the word (do this later - machine learning)
    - find entities in the input string
    - compare entities to the hardcoded list of words related to each feeling
    - increment the feeling variables and normalize (when reaching a certain value, start just making the new entries worth more)
    - if the user didn't choose the string, decrement relevance score

  List of emotions:
    -anger
    -contempt
    -disgust
    -fear
    -happiness
    -neutral
    -sadness
    -surprise

  Reply database attributes:
    - string of the actual reply (called "phrase")
    - overall emotion (called "emotion")
    - list of main entities (called "keywords")
    - relevance score (double from 0 to 1) //this is used to rank the replies. +1 for each entity in common, +2 for when the user chooses the response (called "relevance_score")
    - number of actions already done (called "num_actions")


*/


// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Instantiates a language client (Google Cloud Language)
const language_client = new language.LanguageServiceClient();

// Instantiates a database client (MongoDB)
const MongoClient = require('mongodb').MongoClient;

var dbo = undefined;
var entities = [""];

const url = "mongodb://localhost:27017/";

function getEmotionFromText(text) {
  return "angry"; // TODO: STUB
}

// TODO: right now it's creating a new document every time the function is called. see if you wanna do something else with it
function analyzeSentimentOfText(text) {

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the document
  language_client
    .analyzeSentiment({document: document})
    .then(results => {
      const sentiment = results[0].documentSentiment;
      console.log(`Document sentiment:`);
      console.log(`  Score: ${sentiment.score}`);
      console.log(`  Magnitude: ${sentiment.magnitude}`);

      const sentences = results[0].sentences;
      sentences.forEach(sentence => {
        console.log(`Sentence: ${sentence.text.content}`);
        console.log(`  Score: ${sentence.sentiment.score}`);
        console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function analyzeEntitiesOfText(text) {

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  language_client
    .analyzeEntities({document: document})
    .then(results => {
      const entities = results[0].entities;

      console.log('Entities:');
      entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
          console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
        }
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function getEntitiesFromText(text) {

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  language_client
    .analyzeEntities({document: document})
    .then(results => {
      entities = results[0].entities;
      //return entity_list;
      console.log('Entities:');
      entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
          console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
        }
      });
      return entities;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function analyzeSyntaxOfText(text) {

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects syntax in the document
  language_client
    .analyzeSyntax({document: document})
    .then(results => {
      const syntax = results[0];

      console.log('Tokens:');
      syntax.tokens.forEach(part => {
        console.log(`${part.partOfSpeech.tag}: ${part.text.content}`);
        console.log(`Morphology:`, part.partOfSpeech);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

function create_test_database()
{
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    dbo = client.db("responses");
    create_collection("person1");
    insert_data("person1", "angry", ["fuck", "cheeto"], 0.3, 4);
  });
}

function create_collection(user)
{
  dbo.createCollection(user, {
    emotion: "",
    keywords: [""],
    relevance_score: 0.0,
    num_actions: 0
  });
}

function insert_data(user, emo, words, score, num)
{
  dbo.collection('user').insertOne({emotion: emo, keywords: words, relevance_score: score, num_actions: num});
}

function update_database(user, text)
{
  console.log("HI");
  var emo = getEmotionFromText(text);
  /*entities = */getEntitiesFromText(text, function(err, entities) {
  console.log("stupid");
  if (entities == null)
    console.log("sfdfdsfs");
  else {
    console.log("DDDDDD");
    entities.forEach(entity => {
      console.log(entity.name);
    });
  }

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if (err) throw err;
    dbo = client.db("responses");
    dbo.collection('user').aggregate([
      {$unwind: "$keywords"},
      {$match: { keywords: { $in: entities }, emotion: emo}},
      {$group: { _id : "$_id", count: { $sum: 1 }}}
    ]).toArray(function (err, data) {
      dbo.collection('user').updateMany(
      { emotion: emo, _id: "$_id"},  //dunno if the id is supposed to be here
      { $set: {"relevance_score": 2}, function(err, res) { //calculateNewScore(this.relevance_score, this.num_actions, 2, entities.length)}
        if (err) throw err;
        console.log(res.result.nModified + " document(s) updated");
        db.close();
      }
    });
    });
    
  });
  });
}

function calculateNewScore(prev_score, total, add_to_score, add_to_total)
{
  return ((prev_score*total + add_to_score)/(total+add_to_total));
}

/*
db.phrases.aggregate([
  {$unwind: "$phrases"},
  {$match: { phrases: { $in: ["chocolate", "cream"] }}}, 
  {$group: {_id : "$_id", count: { $sum: 1 }}},
  {$sort: {count: -1}}
  ])
*/

create_test_database();

update_database("person1", "cheeto water gum");

//analyzeSentimentOfText("A random sample of doctors from around the country were selected for the study.");
//analyzeEntitiesOfText("A random sample of doctors from around the country were selected for the study.");
