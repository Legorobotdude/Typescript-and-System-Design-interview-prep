/**
 * TypeScript Fundamentals for Interview Prep
 * This file covers TypeScript-specific features you need to know
 */

// ============================================================================
// 1. TYPE SYSTEM BASICS
// ============================================================================

// Primitive types
let userName: string = "John";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Tuples - fixed length arrays with known types
let person: [string, number] = ["Alice", 25];

// Enums - named constants
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// ============================================================================
// 2. INTERFACES vs TYPE ALIASES
// ============================================================================

// Interfaces - better for object shapes, can be extended
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Cannot be modified after creation
}

// Type aliases - more flexible, can represent unions, primitives, etc.
type ID = string | number;
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Extending interfaces
interface Admin extends User {
  permissions: string[];
}

// Intersection types
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type AuditedUser = User & Timestamped;

// ============================================================================
// 3. FUNCTIONS & TYPE INFERENCE
// ============================================================================

// Function with typed parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Function types
type MathOperation = (a: number, b: number) => number;
const divide: MathOperation = (a, b) => a / b;

// ============================================================================
// 4. GENERICS - Reusable Type-Safe Code
// ============================================================================

// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic interface
interface Box<T> {
  value: T;
  getValue(): T;
}

// Generic class
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// Constrained generics
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

// ============================================================================
// 5. UTILITY TYPES (Critical for Interviews!)
// ============================================================================

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Partial - makes all properties optional
type PartialProduct = Partial<Product>;

// Required - makes all properties required
type RequiredProduct = Required<Product>;

// Pick - select specific properties
type ProductPreview = Pick<Product, "id" | "name">;

// Omit - exclude specific properties
type ProductWithoutDescription = Omit<Product, "description">;

// Record - create object type with specific keys and values
type ProductMap = Record<number, Product>;

// ReturnType - extract return type from function
function createUser(name: string) {
  return { name, createdAt: new Date() };
}
type CreatedUser = ReturnType<typeof createUser>;

// ============================================================================
// 6. UNION & LITERAL TYPES
// ============================================================================

// Union types
type APIResponse = string | number | boolean;

// Literal types
type Direction = "up" | "down" | "left" | "right";

// Discriminated unions (VERY IMPORTANT for interviews)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

function getArea(shape: Shape): number {
  // TypeScript narrows the type based on discriminant
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
}

// ============================================================================
// 7. TYPE GUARDS & NARROWING
// ============================================================================

// typeof type guard
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's a string here
  }
  return value.toFixed(2); // TypeScript knows it's a number here
}

// instanceof type guard
class Dog {
  bark() { return "Woof!"; }
}
class Cat {
  meow() { return "Meow!"; }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark();
  }
  return animal.meow();
}

// Custom type guard
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// ============================================================================
// 8. CLASSES & MODIFIERS
// ============================================================================

class BankAccount {
  private balance: number; // Only accessible within class
  protected accountNumber: string; // Accessible in subclasses
  public readonly owner: string; // Accessible everywhere, cannot be modified

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.accountNumber = Math.random().toString(36).substring(2, 11);
  }

  // Public method
  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  // Getter
  get currentBalance(): number {
    return this.balance;
  }

  // Setter
  set updateBalance(amount: number) {
    if (amount >= 0) {
      this.balance = amount;
    }
  }

  // Static method
  static createAccount(owner: string): BankAccount {
    return new BankAccount(owner, 0);
  }
}

// ============================================================================
// 9. ASYNC/AWAIT with TypeScript
// ============================================================================

// Promise with generic type
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data: User = await response.json();
  return data;
}

// Handling errors with Result type
async function safeFetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    const data: T = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ============================================================================
// 10. ADVANCED PATTERNS for Interviews
// ============================================================================

// Readonly arrays and objects
const immutableArray: ReadonlyArray<number> = [1, 2, 3];
// immutableArray.push(4); // Error!

// Const assertions
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const; // All properties become readonly and literal types

// Mapped types
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableProduct = Nullable<Product>;

// Conditional types
type IsString<T> = T extends string ? true : false;

// Template literal types (TypeScript 4.1+)
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;
type RouteHandler = `handle${HTTPMethod}`;

// ============================================================================
// 11. Common Interview Patterns
// ============================================================================

// Builder pattern with TypeScript
class QueryBuilder {
  private query = "";

  select(...fields: string[]): this {
    this.query += `SELECT ${fields.join(", ")} `;
    return this;
  }

  from(table: string): this {
    this.query += `FROM ${table} `;
    return this;
  }

  where(condition: string): this {
    this.query += `WHERE ${condition} `;
    return this;
  }

  build(): string {
    return this.query.trim();
  }
}

// Usage:
const query = new QueryBuilder()
  .select("id", "name")
  .from("users")
  .where("age > 18")
  .build();

// Factory pattern with generics
interface Animal {
  speak(): string;
}

class DogImpl implements Animal {
  speak() { return "Woof"; }
}

class CatImpl implements Animal {
  speak() { return "Meow"; }
}

class AnimalFactory {
  static create<T extends Animal>(type: new () => T): T {
    return new type();
  }
}

// Singleton pattern
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private constructor() {
    // Private constructor prevents instantiation
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
