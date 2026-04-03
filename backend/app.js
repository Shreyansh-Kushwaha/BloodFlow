const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { sequelize } = require('./models/models'); 

const app = express();
dotenv.config();

// 1. CORS MUST BE FIRST - Before express.json and before Routers
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://bloodflow-management.vercel.app",
      "https://bloodflow-management.vercel.app/" // Added with trailing slash just in case
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  })
);

// 2. OTHER MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// 3. DATABASE CONNECTION
const port = process.env.PORT || 3177;
sequelize.authenticate()
	.then(() => {
		console.log("Connected successfully to MySQL database.");
        return sequelize.sync({ alter: true }); 
	})
	.catch((error) => {
		console.error("Unable to connect to the database:", error);
	});

// 4. ROUTERS
app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/userRouter"));
app.use("/bank", require("./routers/bankRouter"));
app.use("/camps", require("./routers/campRouter"));

app.listen(port, "0.0.0.0", () =>
    console.log(`Server running on port ${port}`)
);
