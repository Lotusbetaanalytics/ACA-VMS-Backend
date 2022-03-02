const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
require("colors");
require("dotenv").config();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

// import routes
const frontDeskAuthRoutes = require("./routes/frontdesk/frontdesk.auth.routes");
const staffRoutes = require("./routes/staff/staff.auth.routes");
const notifyUser = require("./utils/notify");

// configure express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//setup socket.io
notifyUser(io);

//connection to the db
require("./config/db")();

// set up app

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.use(require("express-pino-logger")());

app.set("emailViews", path.resolve(__dirname, "views/emails"));

//Sanitize data
app.use(mongoSanitize());

//set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);
app.use(cors());

// configure routes
app.use("/api/v1/frontdesk", frontDeskAuthRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/guest", require("./routes/guest.routes"));
app.use("/api/v1/office", require("./routes/office.routes"));
app.use("/api/v1/prebook", require("./routes/prebook.routes"));
app.use("/api/v1/logs", require("./routes/logs.routes"));
app.use(
  "/api/v1/dashboard",
  require("./routes/frontdesk/frontdesk.dashboard.routes")
);
app.use("/api/v1/returning", require("./routes/returningGuest.routes"));

try {
  app.get("/", async (req, res) => {
    return res
      .status(200)
      .json({ msg: "This is the api for aca vms solution" });
  });
} catch (err) {
  res.status(500).json({ msg: err.message });
}

const PORT = process.env.PORT || 4000;

server.listen(PORT, console.log(`Server running on port ${PORT}`.yellow));

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  server.close(() => process.exit(1));
});
