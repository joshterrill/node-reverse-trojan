# node-reverse-trojan
An example of a reverse RAT (remote administration tool / trojan horse) written in NodeJS. Highly experimental.

The idea behind this shows how a modern-day RAT or trojan tool might work. Many routers block incoming traffic on many ports, so this demonstrates the idea of a reverse-RAT... meaning there's a server running that serves up whatever command you want to execute on the client via JSON and the client does a `GET` at the server URL, then executes it.

In this implementation, I've decided to define whatever command I want executed on the client machine inside `server.js` by defining an `app.get()` in express on the `/api` path.
```
app.get('/api', function(req, res){
  res.json({command: command});
});
```

When the client does an `http.get` on `/api` it receives the command and then uses `exec()` to execute the command locally.

Then I take the response of the `exec()` and post it back to the server using the `request` module where it is received and stored in a RethinkDB database called `ratDB` under a table called `clientResponses`.

Because this is written in NodeJS it's unlikely that anyone will really be able to distribute this and use it for malicious purposes, but this basic idea can be used to create a client in something like C++ or .NET to accomplish the same thing.

### Improvements
* It'd probably be better to have a client that periodically checks to see if there is a new command to be issued

### Screenshots
Running the server:

![](http://i.imgur.com/SygVMTX.png)

Executing the client

![](http://imgur.com/ngQb9Fb.png)

Response from the client on the server

![](http://i.imgur.com/9m3uJzy.png)

Screenshot of the RethinkDB data explorer showing the client information
![](http://i.imgur.com/BDqmOfD.png)