import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertQuizAttemptSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all questions
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get questions by type
  app.get("/api/questions/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const validTypes = ["logical", "mathematical", "pattern"];
      
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid question type" });
      }
      
      const questions = await storage.getQuestionsByType(type);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions by type" });
    }
  });

  // Get a specific question by ID
  app.get("/api/question/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
      }
      
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch question" });
    }
  });

  // Save quiz result
  app.post("/api/results", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid quiz result data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  // Get all quiz results
  app.get("/api/results", async (req, res) => {
    try {
      const results = await storage.getQuizResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  // Get a specific quiz result
  app.get("/api/results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid result ID" });
      }
      
      const result = await storage.getQuizResultById(id);
      
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz result" });
    }
  });

  // Save quiz attempt
  app.post("/api/attempts", async (req, res) => {
    try {
      const validatedData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(validatedData);
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid quiz attempt data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to save quiz attempt" });
    }
  });

  // Get quiz attempts by result ID
  app.get("/api/results/:resultId/attempts", async (req, res) => {
    try {
      const resultId = parseInt(req.params.resultId);
      
      if (isNaN(resultId)) {
        return res.status(400).json({ message: "Invalid result ID" });
      }
      
      const attempts = await storage.getQuizAttemptsByResultId(resultId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz attempts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
