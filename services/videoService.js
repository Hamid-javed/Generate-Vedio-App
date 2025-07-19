const ffmpeg = require("fluent-ffmpeg")
const path = require("path")
const fs = require("fs").promises
const { v4: uuidv4 } = require("uuid")
const emailService = require("./emailService")

class VideoService {
  constructor() {
    this.outputDir = path.join(__dirname, "../uploads/videos")
    this.assetsDir = path.join(__dirname, "../assets/video-clips")
    this.generationStatus = new Map()
  }

  async generateVideo({ orderId, paymentIntentId }) {
    try {
      this.generationStatus.set(orderId, {
        status: "processing",
        progress: 0,
        startedAt: new Date(),
      })

      // Load order data (this would typically come from database)
      const orderData = await this.getOrderData(orderId)

      const outputPath = path.join(this.outputDir, `${orderId}.mp4`)

      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true })

      // Generate video using FFmpeg
      await this.compileVideo(orderData, outputPath)

      this.generationStatus.set(orderId, {
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        videoPath: outputPath,
      })

      // Send email with download link
      await emailService.sendVideoReadyEmail(orderData.email, orderId)

      return { success: true, orderId }
    } catch (error) {
      console.error("Video generation error:", error)
      this.generationStatus.set(orderId, {
        status: "failed",
        error: error.message,
        failedAt: new Date(),
      })
      throw error
    }
  }

  async compileVideo(orderData, outputPath) {
    return new Promise((resolve, reject) => {
      const { templateId, childName, photos, voiceoverPath, customScript } = orderData

      // Get template clips
      const template = this.getTemplate(templateId)

      let command = ffmpeg()

      // Add video clips in sequence
      template.clips.forEach((clip) => {
        const clipPath = path.join(this.assetsDir, clip.file)
        command = command.input(clipPath)
      })

      // Add voiceover audio
      if (voiceoverPath) {
        command = command.input(voiceoverPath)
      }

      // Complex filter for compositing
      const filterComplex = []
      const inputIndex = 0

      // Concatenate video clips
      const videoInputs = template.clips.map((_, index) => `[${index}:v]`).join("")
      const audioInputs = template.clips.map((_, index) => `[${index}:a]`).join("")

      filterComplex.push(`${videoInputs}concat=n=${template.clips.length}:v=1:a=1[video][audio]`)

      // Add photo overlay for green screen segment
      if (photos && photos.length > 0) {
        const photoPath = photos[0].processedPath.replace("/uploads/", "uploads/")
        command = command.input(photoPath)

        // Overlay photo on green screen segment
        filterComplex.push(
          `[video][${template.clips.length}:v]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,20,40)'[video_with_photo]`,
        )
      }

      // Add text overlay for child's name
      filterComplex.push(
        `[${photos ? "video_with_photo" : "video"}]drawtext=text='${childName}':fontfile=/System/Library/Fonts/Arial.ttf:fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-100:enable='between(t,10,15)'[final_video]`,
      )

      command
        .complexFilter(filterComplex)
        .outputOptions([
          "-map",
          "[final_video]",
          "-map",
          voiceoverPath ? `[${template.clips.length + (photos ? 1 : 0)}:a]` : "[audio]",
          "-c:v",
          "libx264",
          "-c:a",
          "aac",
          "-preset",
          "medium",
          "-crf",
          "23",
        ])
        .output(outputPath)
        .on("start", (commandLine) => {
          console.log("FFmpeg process started:", commandLine)
        })
        .on("progress", (progress) => {
          console.log("Processing: " + progress.percent + "% done")
          this.updateProgress(orderData.orderId, progress.percent)
        })
        .on("end", () => {
          console.log("Video generation completed")
          resolve()
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err)
          reject(err)
        })
        .run()
    })
  }

  updateProgress(orderId, percent) {
    const status = this.generationStatus.get(orderId)
    if (status) {
      status.progress = Math.round(percent)
      this.generationStatus.set(orderId, status)
    }
  }

  async getGenerationStatus(orderId) {
    return this.generationStatus.get(orderId) || { status: "not_found" }
  }

  async getVideoPath(orderId) {
    const status = this.generationStatus.get(orderId)
    if (status && status.status === "completed") {
      return status.videoPath
    }
    return null
  }

  async regenerateVideo(orderId) {
    // Reset status and regenerate
    this.generationStatus.delete(orderId)
    const orderData = await this.getOrderData(orderId)
    return this.generateVideo({ orderId, paymentIntentId: orderData.paymentIntentId })
  }

  getTemplate(templateId) {
    // This would typically load from database
    const templates = {
      "classic-santa": {
        clips: [
          { file: "classic-santa-intro.mp4", duration: 15 },
          { file: "classic-santa-name.mp4", duration: 10 },
          { file: "classic-santa-photos.mp4", duration: 20 },
          { file: "classic-santa-message.mp4", duration: 60 },
          { file: "classic-santa-goodbye.mp4", duration: 15 },
        ],
      },
    }

    return templates[templateId] || templates["classic-santa"]
  }

  async getOrderData(orderId) {
    // This would typically load from database
    // For demo purposes, return mock data
    return {
      orderId,
      templateId: "classic-santa",
      childName: "Emma",
      email: "parent@example.com",
      photos: [{ processedPath: "/uploads/photos/processed-photo1.jpg" }],
      voiceoverPath: "/uploads/audio/voiceover-123.mp3",
      customScript: "Ho ho ho! Hello Emma!",
      paymentIntentId: "pi_123456789",
    }
  }
}

module.exports = new VideoService()
