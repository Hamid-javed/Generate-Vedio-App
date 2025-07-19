const fs = require("fs").promises
const path = require("path")

class TemplateService {
  constructor() {
    this.templatesPath = path.join(__dirname, "../data/templates.json")
  }

  async getAllTemplates() {
    try {
      const data = await fs.readFile(this.templatesPath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      // Return default templates if file doesn't exist
      return this.getDefaultTemplates()
    }
  }

  async getTemplateById(templateId) {
    const templates = await this.getAllTemplates()
    return templates.find((template) => template.id === templateId)
  }

  getDefaultTemplates() {
    return [
      {
        id: "classic-santa",
        name: "Classic Santa",
        description: "Traditional Santa video with workshop background",
        thumbnail: "/assets/templates/classic-santa-thumb.jpg",
        duration: 120,
        clips: [
          { id: "intro", file: "classic-santa-intro.mp4", duration: 15 },
          { id: "name-mention", file: "classic-santa-name.mp4", duration: 10 },
          { id: "photo-segment", file: "classic-santa-photos.mp4", duration: 20 },
          { id: "custom-message", file: "classic-santa-message.mp4", duration: 60 },
          { id: "goodbye", file: "classic-santa-goodbye.mp4", duration: 15 },
        ],
      },
      {
        id: "north-pole-adventure",
        name: "North Pole Adventure",
        description: "Santa takes you on a tour of the North Pole",
        thumbnail: "/assets/templates/north-pole-thumb.jpg",
        duration: 150,
        clips: [
          { id: "intro", file: "north-pole-intro.mp4", duration: 20 },
          { id: "name-mention", file: "north-pole-name.mp4", duration: 10 },
          { id: "photo-segment", file: "north-pole-photos.mp4", duration: 25 },
          { id: "custom-message", file: "north-pole-message.mp4", duration: 80 },
          { id: "goodbye", file: "north-pole-goodbye.mp4", duration: 15 },
        ],
      },
      {
        id: "magical-christmas",
        name: "Magical Christmas",
        description: "Enchanted Christmas experience with special effects",
        thumbnail: "/assets/templates/magical-thumb.jpg",
        duration: 180,
        clips: [
          { id: "intro", file: "magical-intro.mp4", duration: 25 },
          { id: "name-mention", file: "magical-name.mp4", duration: 12 },
          { id: "photo-segment", file: "magical-photos.mp4", duration: 30 },
          { id: "custom-message", file: "magical-message.mp4", duration: 90 },
          { id: "goodbye", file: "magical-goodbye.mp4", duration: 23 },
        ],
      },
    ]
  }
}

module.exports = new TemplateService()
