const express = require("express")
const router = express.Router()
const templateService = require("../services/templateService")

// Get all available video templates
router.get("/", async (req, res) => {
  try {
    const templates = await templateService.getAllTemplates()
    res.json(templates)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get specific template details
router.get("/:templateId", async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.templateId)
    if (!template) {
      return res.status(404).json({ error: "Template not found" })
    }
    res.json(template)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
