const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// 1. Import your Sequelize instance 
// (Make sure this path points to where you saved your new MySQL models!)
const { sequelize } = require('./models/models'); 

const app = express();
const port = process.env.PORT || 3177;

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.options("*", cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://bloodflow-management.vercel.app" 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

// 2. Connect to MySQL via Sequelize instead of Mongoose
sequelize.authenticate()
	.then(() => {
		console.log("Connected successfully to MySQL database.");
        
        // Optional: If you want Sequelize to automatically create/update your tables, 
        // uncomment the line below. Use { alter: true } carefully in production!
        return sequelize.sync({ alter: true }); 
	})
	.catch((error) => {
		console.error("Unable to connect to the database:", error);
	});

// Your routers stay exactly the same here
app.use("/auth", require("./routers/authRouter"));
app.use("/user", require("./routers/userRouter"));
app.use("/bank", require("./routers/bankRouter"));
app.use("/camps", require("./routers/campRouter"));

app.listen(port, "0.0.0.0", () =>
    console.log(`Server running on port ${port}`)
);
	