require("dotenv").config();const express = require("express");
const bodyParser = require("body-parser");
const tokenRoutes = require("./routes/tokenRoutes");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use("/api", tokenRoutes);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
