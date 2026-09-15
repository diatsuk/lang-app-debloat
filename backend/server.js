require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const connectDB = require("./config/db");
const passport = require("./config/passport");
const { ensureAuthenticatedRedirect } = require("./middleware/ensureAuthenticated");

const app = express();

// --- middleware ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// --- database ---
connectDB();

// --- routes ---
app.use("/auth", require("./routes/auth"));
app.use("/api/savedwords", require("./routes/savedWords"));
app.use("/api/flashcards", require("./routes/flashcards"));
app.use("/api/context", require("./routes/context"));
app.use("/api/translate", require("./routes/translate"));
app.use("/api/chat", require("./routes/chat"));

app.get("/api/current_user", (req, res) => {
  if (!req.user) return res.json(null);

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

app.get("/dashboard", ensureAuthenticatedRedirect, (req, res) => {
  res.send(`Hello ${req.user.name}`);
});

// --- server start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
