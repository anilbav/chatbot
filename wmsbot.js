
var restify = require('restify');
var builder = require('botbuilder');

//var connector = new builder.ChatConnector({
//
//    appId:'e3303bca-8408-43b9-b442-6e1101f1db6d',
//    appPassword:'TfGmW0rqzcZhGONjDcVtuUf'
//
//});

var connector = new builder.ChatConnector({
    appId: "b1d970bf-40d7-48ba-9d90-fc158ce7cf88",
    appPassword: "yJe4RbmJggsHsHyymaXJRgk"

});

// Receive messages from the user and respond
var bot = new builder.UniversalBot(connector);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 5604,function () {});



// Listen for messages from users 
server.post('/api/messages', connector.listen());
var model =  'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/cab653e1-cf56-42eb-9b25-7bec6a1c892f?subscription-key=2e16c4635d1d4926a4a5472c32bdcb1c&verbose=true&timezoneOffset=0&q=';

var recognizer = new builder.LuisRecognizer(model).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);



bot.dialog('/Greeting', [
    function (session) {
      session.send("Hi Welcome to WMS, Good After noon ! Let me know How I can help you? ").endDialog()   
    }
]).triggerAction({matches:'Greeting'})



bot.dialog('/WFH', [
    function (session) {
      session.send("Yes. You can work from home by connecting to FPL VPN. We have 2 factor authentication and you will be provided with 2 RSA tokens to log onto FPL network and to log onto the VDI which would be your work station with the necessary softwares. You also need to inform your Project Manager on WFH on a given day. ").endDialog()   
    }
]).triggerAction({matches:'WFH'})



bot.dialog('/Others', [
    function (session) {
      session.send("I am here! let me know what can I do for you.").endDialog()   
    }
]).triggerAction({matches:'Others'})


bot.dialog('/RSA', [
    function (session) {
      session.send("RSA is public-key cryptosystems and is widely used for secure data transmission. Please visit http://cafe.nexteraenergy.com/sites/imclient/telecom/imtprojects/nexteraremoteaccess/default.aspx to request and set up RSA token.").endDialog()   
    }
]).triggerAction({matches:'RSA'})


bot.dialog('/Training', [
    function (session) {
      session.send("You are required to go over the information security training within 5 days to understand the security policies and processes followed here at FPL You can undergo the training at the following intranet site. http://eweb.fpl.com/bunit/im/infosec/ ")
.endDialog()   
    }
]).triggerAction({matches:'Training'})


bot.dialog('/Webmail', [
    function (session) {
      session.send("You can connect from any system to FPL mailbox through their Webmail https://mail.nexteraenergy.com/owa/ You will have to log on with your SLID and password.")
.endDialog()   
    }
]).triggerAction({matches:'Webmail'})




bot.dialog('/SLID', [
    function (session) {
      session.send("SLID is your alpha Numeric FPL User ID. Your SLID is XXX0YYY. ")
.endDialog()   
    }
]).triggerAction({matches:'SLID'})


bot.dialog('/unknown', [
    function (session) {
      session.send("Sorry. I could not understand the request. Please provide additional inputs to help process the request")
.endDialog()   
    }
]).triggerAction({matches:'unknown'})




bot.dialog('/Bye', [
    function (session) {
      session.send("Thanks for calling WMS help desk")
.endDialog()   
    }
]).triggerAction({matches:'Bye'})







//// welcome message
//bot.on('conversationUpdate', function (message) {
//    if (message.membersAdded) {
//        message.membersAdded.forEach(function (identity) {
//            if (identity.id === message.address.bot.id) {
//                bot.send(new builder.Message()
//                    .address(message.address)
//                    .text("Welcome to WMS BOT "));
//            }
//        });
//    }
//});

