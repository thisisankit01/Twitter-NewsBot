import express from 'express'
import convert from 'xml-js'
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import twit from 'twit'


///////////////////////////////////////server:setup/////////////////////////////////////
const app = express();
const PORT = 3000;

//////////////////////////////////////////twitter creds//////////////////////////////////
const credentials = new twit({
  consumer_key: process.env.API_KEY,
  consumer_secret:process.env.API_SECRET ,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});


//////////////////////////////////////////////openai creds///////////////////////////////
const configuration = new Configuration({
  organization: "org-3B6NPrSjfe0XYtTvC66r2Y9U" as string,
  apiKey: process.env.OPENAI_API_KEY as string,
});
const openai = new OpenAIApi(configuration);
const response =openai.listEngines();

interface OpenAIChoice {
  text: string;
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

////////////////////////////////////fetchind data : successful//////////////////////////////////////////

async function Blog(){
  const rawData = await fetch("https://blockchain.news/RSS?key=0HM0B8QFN3GEO")
  const convertToText =  await rawData.text();

/////////////////////////////////converting to json/////////////////////////////

const json = convert.xml2json(convertToText,{ compact: true, spaces: 4 })

////////////////////////////// json data for tweet//////////////////////////////////


  let data = await JSON.parse(json);
  let description = await data.rss.channel.description._text;
 // console.log(description);

  return description;
}

/////////////////////function called//////////////////////

const blog = Blog();

///////////////////////////////openai function//////////////////////////////

async function completionCall(prompt : any): Promise<string> {
  console.log("OpenAI---->Completion Call......");
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003" as string,
      prompt: `${prompt}` as string,
      max_tokens: 2048 as number,
      temperature: 1 as number,
    }),
  });
  const { choices } = await response.json() as OpenAIResponse;
  const mainData = choices[0].text.trim();
  console.log(mainData);
  return mainData;
} 

//////////////////////////////Tweet Function//////////////////////////////////
async function tweet() {
  // call completionCall to get the tweet text
  const tweetText = await completionCall(`write a tweet for this news predicting its future scope in 270 character limit : ${blog}`);

  // post the tweet
  credentials.post('statuses/update', { status: tweetText }, function(err, data, response) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log('Success: Tweet posted');
    }
  });
}

// Call the tweet function
tweet();


/////////////////////////////////listening to....../////////////////////////////////////
app.listen(PORT,()=>{
  console.log(`listening to ${PORT}`);
})