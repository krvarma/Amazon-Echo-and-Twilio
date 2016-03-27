Sending Twilio Messages using Amazon Echo
-----------------------------------------

**Introduction**

![enter image description here](https://raw.githubusercontent.com/krvarma/Amazon-Echo-and-Twilio/master/images/at.png)

Amazon Echo and Twilio are great products. Amazon Echo is a voice command device from Amzon. It is one of the most popular voice command device. It can captures user voice and convert this into text. After recognizing the voice, it then perform NLP on the detected text. Then it uses Alexa to determine what user want to do. Alexa is a voice service that Amazon Echo uses to interact with users using voice. A third party device also can make use of this service to interact with the users.

Users can define their of own voice interaction using Alexa Skills. Amazon provides Alexa Skill Kit which is a set of APIs, documentations and sample code to start with creating voice interactions. This make the Amazon Echo extensible, i.e. you can create your own skill to extend the capabilities of Echo.

Twilio is another great service that enables you to write great telephony applications such as IVR, answering machines, sending text/voice messages. Twilio provides APIs to make great telephony applications. Twilio provides different language SDKs to start developing in different languages and platforms.

I thought of writing a Skill Set that can be used to Twilio send voice or text messages using Amazon Echo. Alexa Skill has following two components to define voice interface.

1. Intent Schema - JSON Schema that defines a set of intents your service can accept and process.
2. Speech Input Data - contains sample utterances user can use to interact with Echo.

To create a custom skill set, you need to specify the intent schema and sample utterances. You have to choose an invocation name also for Alexa to understand which skill set to use to interact with voice input.

Intents are actions that should be preformed based on the user voice input. Intents can have arguments called Slots. For example if the user says *Alexa, send voice message* the word voice can be considered as a slot. Similarly if the user says, *Alexa, send text message* then the word text is a slot. In this case you can define a slot called "*MessageType*". When the user says *Alexa, send voice message* then the slot *MessageType* will have the value "voice" and if the user says *Alexa, send text message* *MessageType* will have the value "text". Based on slot values you can perform different actions. 

When you define the slot type, you should define the type also. Followinog are are different slot type available as of now.

1. AMAZON.DATE - defines a date
2. AMAZON.DURATION - defines a duration such as ten minutes, etc...
3. AMAZON.FOUR_DIGIT_NUMBER - a four digit number
4. AMAZON.NUMBER - Numeric words, this will be converted to digits. Such as five convert to 5, six will convert to 6, etc...
5. AMAZON.TIME - defines time
6. AMAZON.US_CITY - defines US city names
7. AMAZON.US_FIRST_NAME - defines poplar US first names
8. AMAZON.US_STATE - defines US state
9. AMAZON.LITERAL - defines any free form text

You can define your own custom slot types if any of the above does not fit to your needs. For a detailed documentation please refer to [this link](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface).

In addition to the Intent Schema and Sample Utterances you have to provide code that will be invoked when interacting with the user. You can either use AWS Lambda or you can host it somewhere. The easiest way is to host it on AWS Lambda.

**Sample Application**

This sample is a messaging application. User can interact with Amazon Echo to send Twilio voice or text messages. The user conversation in our sample application looks like this:

 - User: *Alexa, open twilio* 
 - Alexa: *Welcome to Amazon Alexa and Twilio messenger, you can ask me to send voice or text message* 
 - User: *Send  voice message* 
 - Alexa: *To who I should send the message?* 
 - User: *Send to Thomas* 
 - Alexa: *What message I should sent* 
 - User: *Welcome to the Alexa and Twilio Messenger* 
 - Alexa: *OK, Sending message Welcome to the Alexa and Twilio Messenger to Thomas*

For this sample I am using following Intent Schema.

*Intent Schema*

    {
      "intents": [
        {
          "intent": "MessageTypeIntent",
          "slots": [
          	{
            	"name" : "Type",
            	"type": "LIST_OF_MESSAGE_TYPE"
          	}
         ]
        },
    	{
          "intent": "NameIntent",
          "slots": [
          	{
            	"name" : "Name",
            	"type": "AMAZON.US_FIRST_NAME"
          	}
         ]
        },
        {
          "intent": "PhoneIntent",
          "slots": [
          	{
            	"name" : "Phone",
            	"type": "AMAZON.NUMBER"
          	}
         ]
        },
    	{
          "intent": "MessageIntent",
          "slots": [
          	{
            	"name" : "Message",
            	"type": "AMAZON.LITERAL"
          	}
         ]
        },
    	{
          "intent": "AMAZON.HelpIntent"
        },
        {
          "intent": "AMAZON.StopIntent"
        },
        {
          "intent": "AMAZON.CancelIntent"
        }
      ]
    }	

You can see from the Schema, I am using following 4 custom intents: 

1. MessageTypeIntent - Contains whether it is voice message or text message
2. NameIntent - Contains the name of the contact to which the message should go. For the purpose of the demo the contact list is maintained in the code itself and it only contains one name *John*
3. PhoneIntent - Contains the phone number if the user chooses the phone number instead of name of the contact
4. MessageIntent - Contains the message

For sending message, I am hosting a microservice on Hook.io. But you don't exactly need to host this web service in Hook.io. You can use the Amazon Lambda function itself to send the message. But for no reason I am hosting it on Hook.io. 

When the Amazon Lambda function for this skill set receives the intent request call this microservice with message, messagetype and number as query parameter. The microserviec use Twilio Node.js SDK to make a call or send text message.

**How to use the application**

To use this application, you need Amazon Echo, Twilio Account with Phone Number and account on Hook.io. You have to complete following 4 Steps:

1. Host Node.js code in AWS Lambda
2. Register Alexa Skill Set
3. Setup Twilio account and Purchase Telephone Number
4. Host the microservice on Hook.io

Host Lambda Function in AWS

1. Log in to the AWS Management Console and go toAWS Lambda.
2. Create a new Lambda function in the US East (N. Virginia) region
3. Enter name and description of the Lambda function
4. Select Node.js as the Runtime.
5. Create a ZIP file of Lambda Function source code and upload it
6. Create a new Execution Role for the function by selecting Create New Role->Basic Execution Role. In IAM console, create new IAM Role, enter name and clock Allow button.
7. Select 'Event Sources' tab and add Alexa Skill Kit event source
8. Note down the Lambda Function endpoint displayed on the upper right corner

For a detailed documentation refer to [this link](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/deploying-a-sample-skill-to-aws-lambda).

**Setup Alexa Skill Set**

1. Log on to the Alexa Developer Portal
2. Click on the 'Get Started' button in the Alexa Skill Set and press 'Add a New Skill' button
3. Enter the Name, Invocation Name, and Endpoint (noted from the AWS Lambda Function)
4. On the Interactive Model page, copy and paste the Intent Schema on the Intent Schema edit box
5. Create a Custom Slot Type by clocking 'Add Slot Type' button
6. Enter the words 'voice' and 'text' separated by new line
7. Copy the Sample Utterances in the Sample Utterance edit box.
8. Click Next to save the skill set and test it

**Setup Twilio account and Purchase Telephone Number**

1. Create an account in Twilio if you don't have one otherwise log on
2. Purchase a Telephone number if you don't have one aready

**Host the microservice on Hook.io**

1. Log on to Hook.io or create a new account
2. Create a new JavaScript Hook and name it as *sendmessage*
3. Copy and paste the microservice code and save it

Now you all set to test the sample. You can start the skill by saying "***Alexa, open twilio***". This will start the conversation (see a typical conversation above). If everything goes well you can see voice or text message on the target phone.

**Demo Video**

*Voice Messaging*

[![](http://img.youtube.com/vi/rSSIXsAanvs/0.jpg)](https://www.youtube.com/watch?v=rSSIXsAanvs)


*Text Messaging*

[![](http://img.youtube.com/vi/SxBr7OUr0BQ/0.jpg)](https://www.youtube.com/watch?v=SxBr7OUr0BQ)