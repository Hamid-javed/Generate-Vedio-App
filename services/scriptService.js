const fs = require("fs").promises
const path = require("path")

class ScriptService {
  constructor() {
    this.scriptsPath = path.join(__dirname, "../data/scripts.json")
  }

  async getAllSegments() {
    try {
      const data = await fs.readFile(this.scriptsPath, "utf8")
      const scripts = JSON.parse(data)
      return scripts.segments
    } catch (error) {
      return this.getDefaultSegments()
    }
  }

  async getGoodbyeMessages() {
    try {
      const data = await fs.readFile(this.scriptsPath, "utf8")
      const scripts = JSON.parse(data)
      return scripts.goodbyeMessages
    } catch (error) {
      return this.getDefaultGoodbyeMessages()
    }
  }

  async createCustomScript({ segmentIds, goodbyeMessageId, childName }) {
    const segments = await this.getAllSegments()
    const goodbyeMessages = await this.getGoodbyeMessages()

    const selectedSegments = segments.filter((segment) => segmentIds.includes(segment.id))

    const selectedGoodbye = goodbyeMessages.find((msg) => msg.id === goodbyeMessageId)

    if (selectedSegments.length === 0) {
      throw new Error("No valid segments found")
    }

    // Combine segments into a full script
    let fullScript = `Ho ho ho! Hello there, ${childName}!\n\n`

    selectedSegments.forEach((segment) => {
      fullScript += segment.text.replace(/\{name\}/g, childName) + "\n\n"
    })

    if (selectedGoodbye) {
      fullScript += selectedGoodbye.text.replace(/\{name\}/g, childName)
    }

    return {
      id: `script-${Date.now()}`,
      childName,
      segments: selectedSegments,
      goodbyeMessage: selectedGoodbye,
      fullScript,
      estimatedDuration: this.calculateDuration(fullScript),
    }
  }

  getDefaultSegments() {
    return [
      {
        id: "good-behavior",
        title: "Good Behavior Praise",
        text: "I've been watching you all year, {name}, and I'm so proud of how good you've been! You've been kind to others, helped your family, and tried your best in everything you do.",
        duration: 15,
      },
      {
        id: "christmas-spirit",
        title: "Christmas Spirit",
        text: "The Christmas spirit shines so brightly in you, {name}! Your kindness and joy make the whole world a little more magical. That's exactly what Christmas is all about!",
        duration: 12,
      },
      {
        id: "special-gift",
        title: "Special Gift Mention",
        text: "I have something very special planned for you this Christmas, {name}. The elves and I have been working extra hard to make sure it's perfect just for you!",
        duration: 10,
      },
      {
        id: "keep-believing",
        title: "Keep Believing",
        text: "Remember, {name}, the magic of Christmas lives in your heart. Keep believing, keep being kind, and keep spreading joy wherever you go!",
        duration: 13,
      },
      {
        id: "family-love",
        title: "Family Love",
        text: "I can see how much love you have for your family, {name}, and how much they love you too. That love is the greatest gift of all!",
        duration: 11,
      },
    ]
  }

  getDefaultGoodbyeMessages() {
    return [
      {
        id: "classic-goodbye",
        title: "Classic Santa Goodbye",
        text: "Ho ho ho! Merry Christmas, {name}! Be good, and I'll see you next year!",
        duration: 8,
      },
      {
        id: "magical-goodbye",
        title: "Magical Goodbye",
        text: "The magic of Christmas will always be with you, {name}. Until we meet again, keep the Christmas spirit alive in your heart! Ho ho ho!",
        duration: 12,
      },
      {
        id: "adventure-goodbye",
        title: "Adventure Goodbye",
        text: "What an amazing adventure we've had together, {name}! Remember, every day can be as magical as Christmas if you believe! Ho ho ho!",
        duration: 10,
      },
    ]
  }

  calculateDuration(text) {
    // Rough estimation: 150 words per minute
    const wordCount = text.split(" ").length
    return Math.ceil((wordCount / 150) * 60)
  }
}

module.exports = new ScriptService()
