const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const userRouter = require("./routes/userRoutes");
const socketIo = require("./socket");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
const personRouter = require("./routes/personRoutes");
const personalMessageRouter = require("./routes/PersonalMessageRoutes");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://gossipp.vercel.app"],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
    transports: ["websocket"],
    allowedHeaders: ["socketid"]
  },
});
app.use(cors({
  origin: ["https://gossipp.vercel.app"],
  methods: ["GET", "POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Mongodb connected failed", err));

socketIo(io);
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/messages", messageRouter);
app.use("/api/connections", personRouter);
app.use("/api/connections/chats", personalMessageRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log("Server is up and running on port", PORT));
