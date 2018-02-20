var restify = require('restify');
var builder = require('botbuilder');

var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

//mongo db         connection

var url = "mongodb://0.0.0.0:27017/anil_db";


//Form for employee details

var emp_details_card = {
            'contentType': 'application/vnd.microsoft.card.adaptive',
             'content': {
               '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
               'type': 'AdaptiveCard',
               'version': '1.0',
               'body': [
                 {
                 'type': 'Container',
                  'speak': '<s>Hello!</s><s>Please fill out the following form</s>',
                   'items': [
                        {
                         'type': 'ColumnSet',
                           'columns': [
                                    {
                                'type': 'Column',
                                 'size': 'auto',
                                    'items': [
                                        {
                                        'type': 'Image',
                                           'url': 'https://www.brandeps.com/logo-download/F/Florida-Power-&-Light-01.png',
                                            'size': 'medium',
                                              'style': 'person'
                                            }
                                           ]
                                           },
                                          {
                                   'type': 'Column',
                                    'size': 'stretch',
                                    'items': [
                                      {
                                    'type': 'TextBlock',
                                    // 'text': 'Hello!',
                                      'weight': 'bolder',
                                       'isSubtle': true
                                        },
                                         {
                                       'type': 'TextBlock',
                                         'text': 'Please enter employee details.',
                                         'wrap': true
}]
}]
}]
}],
'actions': [
// Firewall Request Form
{
'type': 'Action.ShowCard',
'title': 'Employee Request Form',
'speak': '<s>Firewall Request</s>',
'card': {
'type': 'AdaptiveCard',

                        'body': [
                                    {
                                  'type': 'TextBlock',
                                   'text': 'Please enter Employee Number.'
                                     },{
                                  'type': 'Input.Text',
                                  'id': 'employee_num',
                                 'speak': '<s>Please enter Employee Number</s>'
                                   },{
                                  'type': 'TextBlock',
                                   'text': 'Please enter employee Name.'
                                     },{
                                  'type': 'Input.Number',
                                  'id': 'employee_name',
                                 'speak': '<s>Please enter employee Name</s>'
                                   },{
                                  'type': 'TextBlock',
                                 'text': 'Please enter salary.'
                                   },{
                                 'type': 'Input.Text',
                                 'id': 'emp_salary',
                                'speak': '<s>Please enter salary</s>'
                                },
                           ],
                         'actions': [
                                 {
                                'type': 'Action.Submit',
                                 'title': 'Validate',
                                 'speak': '<s>Validate</s>',
                              //   'data': {
                                //  'type': 'firewallRequest'
//}
}
]

}}]

}
};





// Setup Restify Server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 5606, function() {
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
        builder.Prompts.text(session, "Hi! Welcome ! I am Anil , How can I assist you?");
        console.log("#Inside Greeting Intent Dialog");
        session.endDialog();
    }  
]).triggerAction({
    matches: 'Greet'
});

bot.dialog('insert', [
    function(session) {
        var msg = new builder.Message(session).addAttachment(emp_details_card);
        if (session.message && session.message.value){
          insert_employee_details(session,session.message.value);
          return;
        }
                session.send(msg);
                
                
    }  
]).triggerAction({
    matches: 'insert'
});

function insert_employee_details(session, empDetails){

  session.userData.empNum= empDetails.employee_num;
  session.userData.empName= empDetails.employee_name;
  session.userData.empsal= empDetails.emp_salary;

var myobj = {Employee_Number:session.userData.empNum, Employee_Name: session.userData.empName, Emp_salary:session.userData.empsal }; 

  db.collection("tb_Employee_Details").insertOne(myobj, function(err, res){
  if(err) throw err;
  session.send("1 record inserted");
  });

}


