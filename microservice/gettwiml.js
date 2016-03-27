module['exports'] = function echoHttp (hook) {
	console.log(hook.params);
	console.log(hook.req.path);
	console.log(hook.req.method);
	console.log(hook.env);
  	
  	var text = "Hey, this is Krishnaraj, " + hook.params["text"] + ".";
  	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + 
			  "<Response>" + 
    				"<Say voice=\"alice\" language=\"en-US\">" +
        				text + 
       				"</Say>" +
			  "</Response>"
  
	hook.res.writeHead(200, {
      		'Content-Type': 'text/xml',
      		'Content-Length': xml.length
    	});
    hook.res.end(xml);
};