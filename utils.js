function utils(req,res){
  var request = require('request');
const base = "https://od-api.oxforddictionaries.com/api/v1";
var config = require(`./config.js`);
const appID = config.appID;
const key = config.key; //put your keys in the config.js file
language = 'en';
const wordID=req.params.word;
const url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/' + language + '/' + wordID.toLowerCase();

const options = {url: url, headers: {
    'app_id': appID, 'app_key': key}};


function defCheck(o){
  for(let i=0; i<o.length; i++){
    if(o[i].entries[0].senses[0].hasOwnProperty(`definitions`)){
      return o[i].entries[0].senses[0].definitions[0];
    }
    else{
      if(o[i].entries[0].hasOwnProperty(`subsenses`)){
      if(o[i].entries[0].subsenses[0].hasOwnProperty(`definitions`)){
        return o[i].entries[0].subsenses[0].definitions[0];
      }}
    }
  }
  return "";
  
}

function exCheck(o){
  for(let i=0; i<o.length; i++){
    //console.log("i: ", i);
    if(o[i].hasOwnProperty(`entries`)){
      for(let j=0; j<o[i].entries.length; j++){
        //console.log("j: ", j)
        if(o[i].entries[j].hasOwnProperty(`senses`)){
          for(let k=0; k<o[i].entries[j].senses.length; k++){
            //console.log("k: ", k)
            if(o[i].entries[j].senses[k].hasOwnProperty(`examples`)){
              return o[i].entries[j].senses[k].examples[0].text;
            }
            else if(o[i].entries[j].senses[k].hasOwnProperty(`subsenses`)){
              for(let l=0; l<o[i].entries[j].senses[k].subsenses.length; l++){
                //console.log("l: ", l);
                if(o[i].entries[j].senses[k].subsenses[l].hasOwnProperty(`examples`)){
                  return o[i].entries[j].senses[k].subsenses[l].examples[0].text
                }
              }
            }
          }
        }
      }
    }
  }
  return "no example found. this word is probably too obscure or profane to have an example";
}
function audioGrab(o){
  for(let i=0; i<o.length; i++){
    if(o[0].hasOwnProperty(`pronunciations`)){
      return o[0].pronunciations[0].audioFile;
    }
   else if(o[i].hasOwnProperty(`entries`)){
      for(let j=0; j<o[i].entries.length; j++){
        if(o[i].entries[j].hasOwnProperty(`pronunciations`)){
          return o[i].entries[j].pronunciations[0].audioFile;
        }
      }
    }
  }
}


function callback(error, response, data) {
  var info;
  if(error){
    res.send(`"word: error", "definition: whatever you entered is not a real word", "example: sorry"`);
  }
  if (!error && response.statusCode == 200) {
      //console.log(data);
    info = JSON.parse(data);
    console.log(info.results);
   res.send(`{"word": "${info.results[0].id}", "definition": ` + `"` +defCheck(info.results[0].lexicalEntries) + `", ` + `"example": ` + `"${exCheck(info.results[0].lexicalEntries)}"` 
  + `, "audio": ` + `"${audioGrab(info.results[0].lexicalEntries)}"` + "}");
  //res.send(info);
  }
    else{
        console.log("ERROR!!!!!");
        console.log(JSON.stringify(error));
        console.log(JSON.stringify(options));
        info = "";
        res.send(`{
  "word": "error",
  "definition": "invalid entry",
  "example": "try again",
  "audio": "fail.mp3" }`);
    }
}
request(options,callback);
}


module.exports = utils