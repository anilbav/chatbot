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
server.listen(process.env.port || process.env.PORT || 5605,function () {});


// Listen for messages from users 
server.post('/api/messages', connector.listen());
var model =  'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/caa6216b-c5d4-4013-8c91-11a3bf06922f?subscription-key=95bb5ae5a7814367b09660bfc501a2a1&timezoneOffset=0&verbose=true&q=';

var recognizer = new builder.LuisRecognizer(model).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);



bot.dialog('/Greeting', [
    function (session) {
      session.send("Hi ").endDialog()   
    }
]).triggerAction({matches:'Greeting'})


//          ----- unlock account------



bot.dialog('/unlockAccount', [
    function (session) {
      session.send("Answer Security questions and recover your account")                       
      session.beginDialog('securityQuestionsUnlock');    
    }
]).triggerAction({matches:'unlockAccount'})


bot.dialog('securityQuestionsUnlock',[  function(session){
  builder.Prompts.text(session,"What is your last four phone number digit");
  
  },function(session,results){
 // session.send("What is your favourite book");
   console.log(results.response);
   if (results.response=='9876'){
                  session.beginDialog('securityQuestions2');
                     
  }
  else (session.send("Answer doesnt match please try again later"))
  }
]);

bot.dialog('securityQuestions2',[function(session){
  builder.Prompts.text(session,"What is your email id")
  }, function(session,results){
    console.log(results.response);
   if (results.response==='abc@cognizant.com'){
                    
                  session.beginDialog('securityQuestions3');
 
  }
  else {(session.send("Answer doesnt match please try again later")).endDialog()  }
  }
]);

bot.dialog('securityQuestions3',[function(session){
  builder.Prompts.text(session,"What is SSN number")
  }, function(session,results){
    console.log(results.response);
   if (results.response==='123456789'){
    
               //   session.beginDialog('securityQuestions3');
                     session.send("Your request is in process");
                     session.send("Your Account has been unlocked");
                     session.endDialog();
  }
  else {(session.send("Answer doesnt match please try again later")).endDialog()  }
  }
]);


//    ---------- forgot password ----------       



//
bot.dialog('/forgotpassword',[
  function(session){
  session.send("Please Answer the following question to reset password")
  session.beginDialog('securityQuestionsforgotpass');
  }
]).triggerAction({matches:'forgotpassword'})


bot.dialog('securityQuestionsforgotpass',[  function(session){
  builder.Prompts.text(session,"enter your year of birth");
  
  },function(session,results){
 // session.send("What is your favourite book");
   console.log(results.response);
   if (results.response=='1994'){
                  session.beginDialog('securityQuestions21');
                     
  }
  else (session.send("Answer doesnt match please try again later"))
  }
]);

bot.dialog('securityQuestions21',[function(session){
  builder.Prompts.text(session,"What is SSN number")
  }, function(session,results){
    console.log(results.response);
   if (results.response==='123456789'){
    
               //   session.beginDialog('securityQuestions3');
                     session.send("Your request is in process");
                     session.send("Success! Login with new password");
                     session.endDialog();
  }
  else {(session.send("Answer doesnt match please try again later")).endDialog()  }
  }
]);

/// ------ change passss------


bot.dialog('/changepassword',[
  function(session){
  builder.Prompts.text(session,"Please enter your old password")
  },function(session,results){  
          if (results.response=='123456789'){
                           session.beginDialog('passwordchange')
                             }
                           else {
                           session.send("Password didnt match try again later");
                                  
          
          }}
]).triggerAction({matches:'changePassword'})

var newpassword;

bot.dialog('passwordchange',[  function(session){
  builder.Prompts.text(session,"enter new password");
  
  },function(session,results){
 // session.send("What is your favourite book");
     newpassword=results.response;
     session.beginDialog('passchange1');
}
]);

bot.dialog('passchange1',[  function(session){
  builder.Prompts.text(session,"Re enter new password");
  console.log(newpassword);
  
  },function(session,results){
     console.log("***********",newpassword);
 // session.send("What is your favourite book");
      if (results.response==newpassword)
     {  session.send('password has been changed  login with new password ') };
     session.endDialog();
}
]);








// welcome message
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.send(new builder.Message()
                    .address(message.address)
                    .text("Thank you for calling IT Helpdesk. How may i help you? "));
            }
        });
    }
});