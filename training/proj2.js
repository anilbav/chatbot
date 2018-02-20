
var restify = require('restify');
var builder = require('botbuilder');


// Setup Restify Server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 5605, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service

var connector = new builder.ChatConnector({
    appId: "98b4401b-7f2c-45c8-a9b0-0f08a75a3252",
    appPassword: "sGY9Ym74N8QSOAaDOyTwMG3"
    

});


//Bot Endpoint

var bot = new builder.UniversalBot(connector);
//server.post('/api/messages', connector.listen());
server.post('/api/messages', connector.listen());

//LUIS Details

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8db5bb79-9338-480e-b82f-84258ad75c4a?subscription-key=95bb5ae5a7814367b09660bfc501a2a1&timezoneOffset=0&verbose=true&q=';
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(model).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);

// LUIS: Greeting intent

bot.dialog('Greeting', [
    function(session) {
        builder.Prompts.text(session, "Hi! Welcome ! I am your Bot , How can I assist you?");
        console.log("#Inside Greeting Intent Dialog");
        session.endDialog();
    }  
]).triggerAction({
    matches: 'Greet'
});

bot.dialog('Travelling', [
    function(session) {
        builder.Prompts.text(session, "Where you want to travel?");
        console.log("#Inside Greeting Intent Dialog");
        session.endDialog();
    }  
]).triggerAction({
    matches: 'travel'
});

