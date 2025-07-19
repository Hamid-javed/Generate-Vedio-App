const express = require("express")
const router = express.Router()
const multer = require("multer")
const uploadService = require("../services/uploadService")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === "letter" ? "uploads/letters" : "uploads/photos"
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "photos") {
      // Accept only images
      if (file.mimetype.startsWith("image/")) {
        cb(null, true)
      } else {
        cb(new Error("Only image files are allowed for photos"))
      }
    } else if (file.fieldname === "letter") {
      // Accept PDF and images for letters
      if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true)
      } else {
        cb(new Error("Only PDF and image files are allowed for letters"))
      }
    } else {
      cb(new Error("Invalid field name"))
    }
  },
})

// Upload child photos
router.post("/photos", upload.array("photos", 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No photos uploaded" })
    }

    const processedPhotos = await uploadService.processPhotos(req.files)

    res.json({
      success: true,
      photos: processedPhotos,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload Santa letter
router.post("/letter", upload.single("letter"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No letter file uploaded" })
    }

    const processedLetter = await uploadService.processLetter(req.file)

    res.json({
      success: true,
      letter: processedLetter,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Edit photo (crop, zoom)
router.post("/photos/:photoId/edit", async (req, res) => {
  try {
    const { photoId } = req.params
    const { crop, zoom, rotation } = req.body

    const editedPhoto = await uploadService.editPhoto(photoId, {
      crop,
      zoom,
      rotation,
    })

    res.json({
      success: true,
      photo: editedPhoto,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
