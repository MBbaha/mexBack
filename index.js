const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/mex.route");
const usersKvitansiyaRoute = require("./routes/room.route");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// ✅ CORS OPTIONS
const allowedOrigins = [
  "https://frontmex.onrender.com",
  "http://localhost:5000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Ruxsat berilgan
    } else {
      callback(new Error("CORS xatolik: Ruxsat etilmagan domen"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// ✅ CORS middleware-ni qo'llash (bu yerda)
app.use(cors(corsOptions));

// JSON formatida body qabul qilish uchun middleware
app.use(express.json());

// ✅ MongoDB ulanish
async function connectToDB() {
  try {
    await connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectToDB();

// ✅ Swagger sozlamalari
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Risola API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [{ url: "https://mexback.onrender.com" }],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Risola backend ishlayapti!");
});

// ✅ API routes
app.use("/api/users", userRoute);
app.use("/api/userKvitansiya", usersKvitansiyaRoute);

// ✅ Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

});
