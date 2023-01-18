"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const xml_js_1 = __importDefault(require("xml-js"));
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_fetch_1 = __importDefault(require("node-fetch"));
const twit_1 = __importDefault(require("twit"));
///////////////////////////////////////server:setup/////////////////////////////////////
const app = (0, express_1.default)();
const PORT = 3000;
//////////////////////////////////////////twitter creds//////////////////////////////////
const credentials = new twit_1.default({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});
//////////////////////////////////////////////openai creds///////////////////////////////
const configuration = new openai_1.Configuration({
    organization: "org-3B6NPrSjfe0XYtTvC66r2Y9U",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const response = openai.listEngines();
////////////////////////////////////fetchind data : successful//////////////////////////////////////////
function Blog() {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield (0, node_fetch_1.default)("https://blockchain.news/RSS?key=0HM0B8QFN3GEO");
        const convertToText = yield rawData.text();
        /////////////////////////////////converting to json/////////////////////////////
        const json = xml_js_1.default.xml2json(convertToText, { compact: true, spaces: 4 });
        ////////////////////////////// json data for tweet//////////////////////////////////
        let data = yield JSON.parse(json);
        let description = yield data.rss.channel.description._text;
        // console.log(description);
        return description;
    });
}
/////////////////////function called//////////////////////
const blog = Blog();
///////////////////////////////openai function//////////////////////////////
function completionCall(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("OpenAI---->Completion Call......");
        const response = yield (0, node_fetch_1.default)("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: `${prompt}`,
                max_tokens: 2048,
                temperature: 1,
            }),
        });
        const { choices } = yield response.json();
        const mainData = choices[0].text.trim();
        console.log(mainData);
        return mainData;
    });
}
//////////////////////////////Tweet Function//////////////////////////////////
function tweet() {
    return __awaiter(this, void 0, void 0, function* () {
        // call completionCall to get the tweet text
        const tweetText = yield completionCall(`write a tweet for this news predicting its future scope in 270 character limit : ${blog}`);
        // post the tweet
        credentials.post('statuses/update', { status: tweetText }, function (err, data, response) {
            if (err) {
                console.log('Error: ' + err);
            }
            else {
                console.log('Success: Tweet posted');
            }
        });
    });
}
// Call the tweet function
tweet();
/////////////////////////////////listening to....../////////////////////////////////////
app.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
});
//# sourceMappingURL=index.js.map