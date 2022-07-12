var express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { randomBytes, randomInt } = require("crypto");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(cors());

app.use("/", express.static("public"));

app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.broadcast.emit("newGuest", { position: randomInt(60) });


  socket.on('move', (msg) => {
    io.emit('move', msg);
  });

});

server.listen(3000);
