const notifyUser = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("message", (data) => {
      io.emit("alert", data);
    });
  });
};

module.exports = notifyUser;
