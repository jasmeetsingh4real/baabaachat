const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_CONNECT_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("mongoose connection opennnnn");
  })
  .catch((err) => {
    console.log("error occeured");
    console.log(err);
  });
const userSchema = new mongoose.Schema({
  name: String,
});

const User = new mongoose.model("User", userSchema);

const chatBoxSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: User,
    },
  ],
  chat: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
      message: String,
      createdAt: String,
    },
  ],
});

const ChatBox = new mongoose.model("ChatBox", chatBoxSchema);

app.use(cors());

app.post("/addUser", async (req, res) => {
  if (!req.body.name) {
    res.status(500).send("invalid input");
    return;
  }
  const existingUser = await User.findOne({
    name: req.body.name,
  });
  if (existingUser) {
    res.status(500).send("Username already exists");
    return;
  }
  const user = new User(req.body);
  const savedUser = await user.save();
  if (!savedUser) {
    res.status(500).send("Could not add users");
    return;
  } else {
    res.status(200).send({ message: "User Added", savedUser });
  }
});

app.get("/getUsers", async (req, res) => {
  const users = await User.find({});
  if (users) {
    // console.log(users);
    res.send(users);
  } else {
    res.send([]);
  }
});
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    name: req.body.username,
  });
  if (user) {
    res.status(200).send({ messaage: "user exists", user });
  } else {
    res.status(404).send("Not found");
  }
});

app.post("/sendMessage", async (req, res) => {
  const filter = {
    $and: [
      {
        users: req.body.users[0],
      },
      {
        users: req.body.users[1],
      },
    ],
  };
  const existingChatBox = await ChatBox.findOne(filter);
  let chatArray = [req.body.chat];
  // console.log(req.body.chat);

  if (existingChatBox) {
    chatArray = [...chatArray, ...existingChatBox.chat];
    const response = await ChatBox.findOneAndUpdate(
      filter,
      {
        chat: chatArray,
      },
      {
        upsert: false,
      }
    );

    res.status(200).send("message sent");
    return;
  }
  const newChatBox = new ChatBox({ users: req.body.users, chat: chatArray });
  await newChatBox.save();
  // console.log(newChatBox);
});

app.get("/getMessages", async (req, res) => {
  const messages = await ChatBox.findOne({
    $and: [
      {
        users: req.query.users[0],
      },
      {
        users: req.query.users[1],
      },
    ],
  }).populate("users");
  if (messages) {
    res.status(200).send(messages);
  } else {
    // res.status(404).send("messages not found");
  }
  // console.log(req.query.users[1]);
});

app.get("/getFriends", async (req, res) => {
  let id = req.query.id;
  if (!req.query.id) {
    return res.status(400).send("bad request");
  }
  const friends = await ChatBox.find({
    users: req.query.id,
  });
  if (!friends.length) {
    return res.status(404).send("not found");
  }
  const friendsIds = friends.map((f) => {
    if (f.users[0].toString() === id) {
      return f.users[1].toString();
    } else if (f.users[1].toString() === id) {
      return f.users[0].toString();
    }
  });
  const resultFriendsArray = await User.find({
    _id: {
      $in: friendsIds,
    },
  });
  return res.send(resultFriendsArray);
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("express listning on " + port);
});
