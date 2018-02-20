var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({

  appId: "98b4401b-7f2c-45c8-a9b0-0f08a75a3252",
    appPassword: "sGY9Ym74N8QSOAaDOyTwMG3"

});

// Receive messages from the user and respond
var bot = new builder.UniversalBot(connector);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 5605,function () {});


// Listen for messages from users 
server.post('/api/messages', connector.listen());
var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a1ed4bfb-3752-4cf2-b52d-3ad3d4318d41?subscription-key=95bb5ae5a7814367b09660bfc501a2a1&verbose=true&timezoneOffset=0&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

bot.dialog('/internetIssue', [
    function (session) {
    builder.Prompts.choice(session,"Select the problem you are facing","Cannot Connect/Surf|Slow Speeds|Intermittent Connectivity|Wifi Issues|Static IP issues|Gateway 

Configuration|Informational",{ listStyle: builder.ListStyle.button });
    },
    function(session,results){
    console.log(results.response.entity);
    switch (results.response.entity){
    case 'Cannot Connect/Surf' : 
                             session.beginDialog('/cantConnect');
                            break;
    case 'Slow Speeds' :
                            break;
    case 'Intermittent Connectivity' :
                            break;                        
    
    case 'Wifi Issues' :
                            break;
    
    case 'Static IP issues' :
                            break;
    
    case 'Gateway Configuration' :
                            break;
    case 'Informational' :
                            break;                        
                            
}}
  ]).triggerAction({matches:'internetIssue'});

bot.dialog('/greeting', [
    function (session) {
      session.send("Hi How may i help you")     
    }
]).triggerAction({matches:'greeting'});

bot.dialog('/cantConnect',[
    function (session) {   
      
      builder.Prompts.choice(session,"Cant Connect to ","All|Some",{ listStyle: builder.ListStyle.button });},
                            function (session,results){ 
                            
                                 switch (results.response.entity){ 
                                 case 'All':  console.log("in");
                                 session.beginDialog('/internetSettings');
                                            
                                             break;
                                 case 'Some': session.beginDialog('/internetSettings');
                                             break;  }} 
    
]).triggerAction({matches:'cantConnect'});


   bot.dialog('/internetSettings', [
    function (session) { 
    
                               var msg = new builder.Message(session);
                               msg.attachmentLayout(builder.AttachmentLayout.list)
                               msg.attachments([new builder.HeroCard(session)
                                 .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'Powercycle Moderm')
                                          ]),
                                          new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'Eliminate Customers Modem')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'Physical connections')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'Correct the bootfile')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'DNS server setting')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'Take a payment')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'outage related')
                                          ]),new builder.HeroCard(session)
                                          .buttons([
                                             builder.CardAction.openUrl(session,'https://en.wikipedia.org/wiki/Internet', 'customer education')
                                          ])
                                    ])
                                     session.send("Which step will resolve the issue") 
     session.send(msg);                        }
  ]).triggerAction({matches:'internetSettings'});
  