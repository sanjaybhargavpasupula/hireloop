require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sanjaybhargavpasupula.github.io"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const problemRoutes = require("./routes/problems");
app.use("/api/problems", problemRoutes);

const applicationRoutes = require("./routes/application");
app.use("/api/applications", applicationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});