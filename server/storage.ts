import { 
  users, 
  type User, 
  type InsertUser, 
  type Question, 
  type InsertQuestion,
  type QuizResult,
  type InsertQuizResult,
  type QuizAttempt,
  type InsertQuizAttempt
} from "@shared/schema";

// Interface with all CRUD methods needed for the app
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Question operations
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByType(type: string): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Quiz result operations
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResults(): Promise<QuizResult[]>;
  getQuizResultById(id: number): Promise<QuizResult | undefined>;
  
  // Quiz attempt operations
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getQuizAttemptsByResultId(resultId: number): Promise<QuizAttempt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private quizResults: Map<number, QuizResult>;
  private quizAttempts: Map<number, QuizAttempt>;
  
  // Counters for IDs
  currentUserId: number;
  currentQuestionId: number;
  currentQuizResultId: number;
  currentQuizAttemptId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.quizResults = new Map();
    this.quizAttempts = new Map();
    
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentQuizResultId = 1;
    this.currentQuizAttemptId = 1;
    
    // Initialize with sample questions
    this.initializeQuestions();
  }

  // Initialize with sample IQ test questions
  private initializeQuestions() {
    // Logical reasoning questions
    this.createQuestion({
      type: 'logical',
      text: 'If all Flurbs are Bloops and some Bloops are Zips, which statement must be true?',
      options: [
        { id: 'a', text: 'All Flurbs are Zips' },
        { id: 'b', text: 'Some Flurbs might be Zips' },
        { id: 'c', text: 'No Flurbs are Zips' },
        { id: 'd', text: 'All Zips are Flurbs' }
      ],
      correctAnswer: 'b',
      difficulty: 3
    });
    
    this.createQuestion({
      type: 'logical',
      text: 'If A is taller than B, and B is taller than C, which statement must be true?',
      options: [
        { id: 'a', text: 'A is taller than C' },
        { id: 'b', text: 'C is taller than A' },
        { id: 'c', text: 'B is taller than A' },
        { id: 'd', text: 'B and C are the same height' }
      ],
      correctAnswer: 'a',
      difficulty: 2
    });
    
    this.createQuestion({
      type: 'logical',
      text: 'All tigers have stripes. No lions have stripes. Therefore:',
      options: [
        { id: 'a', text: 'All tigers are lions' },
        { id: 'b', text: 'No tigers are lions' },
        { id: 'c', text: 'Some tigers are lions' },
        { id: 'd', text: 'Some lions are tigers' }
      ],
      correctAnswer: 'b',
      difficulty: 3
    });
    
    // Mathematical questions
    this.createQuestion({
      type: 'mathematical',
      text: 'What is the next number in this sequence: 2, 6, 12, 20, 30, ?',
      options: [
        { id: 'a', text: '40' },
        { id: 'b', text: '42' },
        { id: 'c', text: '36' },
        { id: 'd', text: '48' }
      ],
      correctAnswer: 'b',
      difficulty: 4
    });
    
    this.createQuestion({
      type: 'mathematical',
      text: 'If a car travels at 60 miles per hour, how far will it travel in 2.5 hours?',
      options: [
        { id: 'a', text: '120 miles' },
        { id: 'b', text: '150 miles' },
        { id: 'c', text: '180 miles' },
        { id: 'd', text: '200 miles' }
      ],
      correctAnswer: 'b',
      difficulty: 2
    });
    
    this.createQuestion({
      type: 'mathematical',
      text: 'What is the value of x in the equation: 3x - 7 = 14?',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '7' },
        { id: 'c', text: '8' },
        { id: 'd', text: '9' }
      ],
      correctAnswer: 'b',
      difficulty: 3
    });
    
    // Pattern recognition questions
    this.createQuestion({
      type: 'pattern',
      text: 'Which figure completes the pattern?',
      options: [
        { id: 'a', text: 'Top Left Circle' },
        { id: 'b', text: 'Center Circle' },
        { id: 'c', text: 'Top Left Circle (duplicate)' },
        { id: 'd', text: 'Bottom Right Circle' }
      ],
      correctAnswer: 'd',
      difficulty: 3
    });
    
    this.createQuestion({
      type: 'pattern',
      text: 'Select the option that follows the pattern: A1, B2, C3, ?',
      options: [
        { id: 'a', text: 'D4' },
        { id: 'b', text: 'C4' },
        { id: 'c', text: 'D3' },
        { id: 'd', text: 'A4' }
      ],
      correctAnswer: 'a',
      difficulty: 2
    });
    
    this.createQuestion({
      type: 'pattern',
      text: 'Which shape would complete the pattern?',
      options: [
        { id: 'a', text: 'Square' },
        { id: 'b', text: 'Triangle' },
        { id: 'c', text: 'Circle' },
        { id: 'd', text: 'Pentagon' }
      ],
      correctAnswer: 'c',
      difficulty: 3
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Question operations
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }
  
  async getQuestionsByType(type: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      question => question.type === type
    );
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }
  
  // Quiz result operations
  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const result: QuizResult = { ...insertResult, id };
    this.quizResults.set(id, result);
    return result;
  }
  
  async getQuizResults(): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values());
  }
  
  async getQuizResultById(id: number): Promise<QuizResult | undefined> {
    return this.quizResults.get(id);
  }
  
  // Quiz attempt operations
  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const attempt: QuizAttempt = { ...insertAttempt, id };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }
  
  async getQuizAttemptsByResultId(resultId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      attempt => attempt.resultId === resultId
    );
  }
}

export const storage = new MemStorage();
