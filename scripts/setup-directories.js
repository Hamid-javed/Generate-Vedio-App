const fs = require("fs")
const path = require("path")

// Create necessary directories
const directories = [
  "uploads/photos",
  "uploads/letters",
  "uploads/audio",
  "uploads/videos",
  "assets/video-clips",
  "assets/templates",
  "data",
]

directories.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

console.log("Directory setup complete!")
