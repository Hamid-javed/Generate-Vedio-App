const express = require("express")
const router = express.Router()
const videoService = require("../services/videoService")

// Get video generation status
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params
    const status = await videoService.getGenerationStatus(orderId)

    res.json({
      success: true,
      status,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Download generated video
router.get("/download/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params
    const videoPath = await videoService.getVideoPath(orderId)

    if (!videoPath) {
      return res.status(404).json({ error: "Video not found or not ready" })
    }

    res.download(videoPath, `santa-video-${orderId}.mp4`)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Regenerate video (admin only)
router.post("/regenerate/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params
    await videoService.regenerateVideo(orderId)

    res.json({
      success: true,
      message: "Video regeneration started",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
