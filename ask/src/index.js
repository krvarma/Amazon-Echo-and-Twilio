var KEY_CURRENT_TYPE = "messagetype";
var KEY_CURRENT_NAME = "name";
var KEY_CURRENT_PHONE = "phone";
var KEY_CURRENT_MESSAGE = "message";

var APP_ID = "amzn1.echo-sdk-ams.app.cfa071d3-357c-4e21-a8b9-dea45072df4e"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var AlexaSkill = require('./AlexaSkill');
var https = require('https');
var helpText = "you can ask me to send voice; or text message.";
var helpNameText = "To who I should send the message?";
var helpMessageText = "What message I should send?";

var TM = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TM.prototype = Object.create(AlexaSkill.prototype);
TM.prototype.constructor = TM;

TM.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Session Started");
};

TM.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechOutput = "Welcome to the Amazon Alexa and Twilio Messenger!, " + helpText;
    var repromptText = helpText;
	
    response.ask(speechOutput, repromptText);
};

TM.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Session Closed");
};

TM.prototype.intentHandlers = {
	"MessageTypeIntent": function (intent, session, response) {
		var messageType = intent.slots.Type;
		
		session.attributes[KEY_CURRENT_TYPE] = messageType.value;
		
		console.log("Message Type: " + messageType.value);
		
		if(messageType.value === "slack"){
			response.ask(helpMessageText);
		}
		else{
			response.ask(helpNameText);
		}
    },
	"NameIntent": function (intent, session, response) {
		var name = intent.slots.Name;
		
		session.attributes[KEY_CURRENT_NAME] = name.value;
		
		console.log("Name: " + name.value);
		
        response.ask(helpMessageText);
    },
	"PhoneIntent": function (intent, session, response) {
		var phone = intent.slots.Phone;
		
		session.attributes[KEY_CURRENT_NAME] = phone.value;
		
		console.log("Name: " + phone.value);
		
        response.ask(helpMessageText);
    },
    "MessageIntent": function (intent, session, response) {
		var message = intent.slots.Message.value;
		var name = session.attributes[KEY_CURRENT_NAME];
		var messageType = session.attributes[KEY_CURRENT_TYPE];
		
		console.log("Message " + message);
		console.log("Name " + name);
		console.log("Type " + messageType);
		
		var url = "https://hook.io/krvarma/sendmessage?text=" + encodeURIComponent(message) + "&number=" + name + "&messagetype=" + messageType;
		
		console.log("URL " + url);
		
		https.get(url, function(res) {
			var body = '';

			res.on('data', function (chunk) {
				body += chunk;
			});

			res.on('end', function () {
				var stringResult = body;
				
				var output = {
					speech: stringResult,
					type: AlexaSkill.speechOutputType.SSML
				}
				
				response.tellWithCard(output, "Messanger", "Twilio Messenger");
			});
			
		}).on('error', function (e) {
			console.log("Got error: ", e);
			
			var stringResult = "<speak>Sorry, some unexpected error occured!</speak>";
				
			var output = {
				speech: stringResult,
				type: AlexaSkill.speechOutputType.SSML
			}
			
			response.tellWithCard(output, "Messanger", "Twilio Messenger");
		});
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask(helpText);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the TM skill.
    var tm = new TM();
    tm.execute(event, context);
};