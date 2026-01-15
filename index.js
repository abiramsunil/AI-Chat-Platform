require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const { register, login } = require("./src/auth");
const prisma = require("./src/db");
const { authMiddleware } = require("./src/middleware");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post("/register", register);
app.post("/login", login);

// --- PROJECT ROUTES ---
app.post("/projects", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Project name required" });

  const project = await prisma.project.create({
    data: { name, userId: req.user.userId },
  });

  res.json(project);
});

app.get("/projects", authMiddleware, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user.userId },
  });
  res.json(projects);
});

// --- PROMPT ROUTES ---
app.post("/projects/:projectId/prompts", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { projectId } = req.params;

  if (!content) return res.status(400).json({ error: "Prompt content required" });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== req.user.userId) {
    return res.status(403).json({ error: "Unauthorized or project not found" });
  }

  const prompt = await prisma.prompt.create({
    data: { content, projectId },
  });

  res.json(prompt);
});

app.get("/projects/:projectId/prompts", authMiddleware, async (req, res) => {
  const { projectId } = req.params;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== req.user.userId) {
    return res.status(403).json({ error: "Unauthorized or project not found" });
  }

  const prompts = await prisma.prompt.findMany({ where: { projectId } });
  res.json(prompts);
});

// --- CHAT ROUTE ---
app.post("/projects/:projectId/chat", authMiddleware, async (req, res) => {
  const { message } = req.body;
  const { projectId } = req.params;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { prompts: true },
  });

  if (!project || project.userId !== req.user.userId) {
    return res.status(403).json({ error: "Unauthorized or project not found" });
  }

  const systemPrompt =
    project.prompts.map(p => p.content).join("\n") ||
    "You are a helpful assistant.";

  try {
    console.log("Sending request to OpenAI Responses API");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "This is a demo AI reply.";

    res.json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err.message);
    res.json({
      reply: "This is a demo AI reply (OpenAI quota exhausted)."
    });
  }
});


// --- START SERVER ---
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
