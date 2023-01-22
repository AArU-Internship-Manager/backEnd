const socketIdToUserId = {};
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 3200;

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
