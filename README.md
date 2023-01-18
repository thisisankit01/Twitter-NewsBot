# Code Sample: Automated Tweet Generator
This code sample is an automated tweet generator which collects data from the RSS feed of Blockchain news and generates tweets based off the data. The code is written in javascript, with packages installed on the environment including node. Therefore, Node.js is necessary in order to run it. The code also uses OpenAI and Twit APIs in order to scrape data, generate tweets, and post them to a twitter account. 

## Installation
In order to install the necessary packages, you must run the following command in your Terminal: 
$ npm install express xml-js openai dotenv node-fetch twit
This will install all necessary packages for the code to run. 

## Usage 
To use this code, you must first provide the necessary credentials for Twitter and OpenAI in the credentials file. Once completed, run the code by typing the following command into your Terminal: 
$ node index.js 

This will scrape data from the Blockchain news RSS feed, generate a tweet based off the data, and post it to the Twit account. 

Good luck!