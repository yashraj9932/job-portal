const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
const fileupload = require("express-fileupload");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

//Saare middlewares ko server file mai laake run karna kripya na bhoolein

const app = express();

//Load environment Variables and also specify that path to the config file
dotenv.config({ path: "./config/config.env" });

connectDB();

const candidate = require("./routes/candidate");
const recruiter = require("./routes/recruiter");
const job = require("./routes/job");

app.use(express.json());

app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

app.use("/candidate", candidate);
app.use("/recruiter", recruiter);
app.use("/job", job);

//This middleware to be always used at the last.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close the server and exit the process
  server.close(() => process.exit(1));
});
