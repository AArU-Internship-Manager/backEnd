const socketIdToUserId = {};
const { Server } = require("socket.io");
const { storeNotification } = require("../notifications");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 5000;

io.listen(PORT);

const findUser = (socketId) => {
  return socketIdToUserId[socketId];
};

const findSocketId = (userId) => {
  return Object.keys(socketIdToUserId).find((key, index) => {
    return socketIdToUserId[key] === userId;
  });
};

const deleteSocketId = (socketId) => {
  delete socketIdToUserId[socketId];
};

const deleteSocket = (userId) => {
  const socketId = findSocketId(userId);
  deleteSocketId(socketId);
};

const addSocket = (socketId, userId) => {
  socketIdToUserId[socketId] = userId;
};

io.on("connection", (socket) => {
  socket.on("addSocket", (userId) => {
    addSocket(socket.id, userId);
    console.log({ socketId: socket.id, socketIdToUserId });
  });

  socket.on("new-notification", (data) => {
    const { user } = data;
    const socketId = findSocketId(user);
    io.to(socketId).emit("send-notification", data);
    storeNotification(data);
  });

  socket.on("new-notification-update", (data) => {
    storeNotification(data);
    const { user } = data;
    const socketId = findSocketId(user);
    io.to(socketId).emit("send-notification", data);
    io.to(socketId).emit("update-data", data);
  });

  socket.on("disconnect", () => {
    deleteSocketId(socket.id);
  });
});

module.exports = {
  io,
  socketIdToUserId,
  findUser,
  findSocketId,
  deleteSocketId,
  deleteSocket,
  addSocket,
};
