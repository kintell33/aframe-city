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

let clients = [];

app.use(cors());

app.use("/", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/map.html");
});

app.get("/clients", (req, res) => {
  res.send({ clients: getClientsClean() });
});

function getClientsClean() {
  let clientsClean = [];

  clients.forEach((item) => {
    clientsClean.push({
      id: item.socket.id,
      user: item.user,
      position: item.position,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
  });

  return clientsClean;
}

io.on("connection", (socket) => {
  clients.push({
    socket,
    user: socket.handshake.query.user,
    position: socket.handshake.query.position,
  });

  io.emit("guests", getClientsClean());

  socket.on("move", (msg) => {
    io.emit("move", msg);
  });

  socket.on("disconnect", () => {
    newClients = [];

    clients.forEach((client) => {
      if (client.socket.id !== socket.id) {
        newClients.push(client);
      }
    });
    clients = newClients;

    io.emit("destroyUser", socket.handshake.query.user);

    io.emit("guests", getClientsClean());
  });

  socket.on("voice", function (data) {
    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    getClientsClean().forEach((x) => {
      socket.broadcast.emit("send", newData);
    });

  });
});

// Establishing the port
const PORT = process.env.PORT || 3000;

// Executing the server on given port number
server.listen(PORT, console.log(`Server started on port ${PORT}`));
