import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Question Schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'logical', 'mathematical', 'pattern'
  text: text("text").notNull(),
  options: jsonb("options").notNull(), // Array of option objects
  correctAnswer: text("correct_answer").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-5
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  type: true,
  text: true,
  options: true,
  correctAnswer: true,
  difficulty: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Quiz Result Schema
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  educationLevel: text("education_level").notNull(),
  score: integer("score").notNull(),
  iqScore: integer("iq_score").notNull(),
  logicalScore: integer("logical_score").notNull(),
  mathematicalScore: integer("mathematical_score").notNull(),
  patternScore: integer("pattern_score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  createdAt: text("created_at").notNull(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  name: true,
  age: true,
  educationLevel: true,
  score: true,
  iqScore: true,
  logicalScore: true,
  mathematicalScore: true,
  patternScore: true,
  totalQuestions: true,
  timeSpent: true,
  createdAt: true,
});

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

// Quiz Attempt Schema
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id").notNull(),
  questionId: integer("question_id").notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  resultId: true,
  questionId: true,
  userAnswer: true,
  isCorrect: true,
  timeSpent: true,
});

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export const userInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(8, "Age must be at least 8").max(99, "Age must be at most 99"),
  educationLevel: z.enum(["elementary", "highschool", "bachelors", "masters", "phd"], {
    errorMap: () => ({ message: "Please select an education level" }),
  }),
});

export type UserInfo = z.infer<typeof userInfoSchema>;
