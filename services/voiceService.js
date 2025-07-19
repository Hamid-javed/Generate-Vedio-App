const axios = require("axios")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

class VoiceService {
  constructor() {
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY
    this.baseUrl = "https://api.elevenlabs.io/v1"
    this.voiceId = process.env.SANTA_VOICE_ID || "default-santa-voice"
  }

  async generateNamePreview(name, voice = "santa_voice") {
    try {
      const text = `Ho ho ho! Hello there, ${name}!`

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": this.elevenLabsApiKey,
          },
          responseType: "arraybuffer",
        },
      )

      const fileName = `name-preview-${uuidv4()}.mp3`
      const filePath = path.join(__dirname, "../uploads/audio", fileName)

      // Ensure directory exists
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })

      await fs.promises.writeFile(filePath, response.data)

      return `/uploads/audio/${fileName}`
    } catch (error) {
      console.error("ElevenLabs API Error:", error.response?.data || error.message)
      throw new Error("Failed to generate voice preview")
    }
  }

  async generateFullVoiceover(name, script, voice = "santa_voice") {
    try {
      // Replace placeholder with actual name
      const personalizedScript = script.replace(/\{name\}/g, name)

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          text: personalizedScript,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": this.elevenLabsApiKey,
          },
          responseType: "arraybuffer",
        },
      )

      const fileName = `voiceover-${uuidv4()}.mp3`
      const filePath = path.join(__dirname, "../uploads/audio", fileName)

      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
      await fs.promises.writeFile(filePath, response.data)

      return `/uploads/audio/${fileName}`
    } catch (error) {
      console.error("ElevenLabs API Error:", error.response?.data || error.message)
      throw new Error("Failed to generate full voiceover")
    }
  }

  async getAudioDuration(audioPath) {
    // This would typically use ffprobe to get audio duration
    // For now, return estimated duration based on text length
    return 30 // seconds
  }
}

module.exports = new VoiceService()
