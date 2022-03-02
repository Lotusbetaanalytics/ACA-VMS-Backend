const notifyUser = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected");
    socket.emit("connected", "from server");
    socket.on("newGuest", () => {
      console.log("new guest");
      io.emit("newGuest", "from server");
    });
  });
};

module.exports = notifyUser;
