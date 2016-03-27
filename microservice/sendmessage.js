module['exports'] = function echoHttp (hook) {
    console.log(hook.params);
    console.log(hook.req.path);
    console.log(hook.req.method);
    console.log(hook.env);
  
  	var contactlist = [
    	{name: '<replace with contact name>', number: '<replace with contact number'},
      	{name: '<replace with contact name>', number: '<replace with contact number'},
		// ...
	];
  
  	var message = hook.params["text"];
  	var name = hook.params["number"];
  	var messagetype = hook.params["messagetype"];
  	var number;
  	
  	var twilioNumber = '<replace with your twilio number>';
	var retVal;
	var telnumber;
  
	var phoneno = /^(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  	
  	if(name.match(phoneno)) 
      	number = name;
  
	if(number != undefined){
		telnumber = "+" + number;
      
      	retVal = "<speak>Sending " + messagetype + " message, " + message + ", to, " + 
          		 "<say-as interpret-as=\"telephone\">" + name + "</say-as>" +
          		 "</speak>"
	}
  	else{
      	for(var index=0; index<contactlist.length; ++index){
          	if(contactlist[index].name.toUpperCase() === name.toUpperCase()){
              	telnumber = contactlist[index].number;
              
              	break;
            }
        }
      
      	retVal = "<speak>Sending " + messagetype + " message, " + message + ", to, " + 
					name  +
          		 "</speak>"
    }
	
	if(telnumber != undefined){
      	var client = require('twilio')('<your account SID>', '<your authentication token>');
      
      	if(messagetype === "voice"){
          	client.makeCall(
              		{
						to:telnumber,
                    	from: twilioNumber,
                    	url: 'https://hook.io/krvarma/gettwml?text=' + encodeURIComponent(message)
                    }, function(err, responseData) {
                        console.log(err);
                        console.log(responseData); // outputs "+14506667788"

                        hook.res.end(retVal);
                   });
        }
      	else if(messagetype === "text"){
          	client.messages.create({
                	    to:telnumber,
                    	from: twilioNumber,
                    	body: message
                	}, function(err, responseData) {
	
    	                //executed when the call has been initiated.
                    	console.log(err);
                    	console.log(responseData); // outputs "+14506667788"
	
                    	hook.res.end(retVal);
                	}
            	);
        }
	}
  	else{
      	retVal = "<speak>Sorry I can't find, " + name + ", in your contact list</speak>";
      
      	hook.res.end(retVal);
  	}
};