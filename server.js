const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const templateRoutes = require("./routes/templates")
const voiceRoutes = require("./routes/voice")
const uploadRoutes = require("./routes/upload")
const scriptRoutes = require("./routes/scripts")
const paymentRoutes = require("./routes/payment")
const videoRoutes = require("./routes/video")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/assets", express.static(path.join(__dirname, "assets")))

// Routes
app.use("/api/templates", templateRoutes)
app.use("/api/voice", voiceRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/scripts", scriptRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/video", videoRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  })
})

app.listen(PORT, () => {
  console.log(`Santa Video Backend running on port ${PORT}`)
})
