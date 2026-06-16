import bcrypt from "bcryptjs";

const users = [
  {
    name: "Test Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("password123", 10),
    isAdmin: true,
  },
  {
    name: "Test User",
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 10),
  },
  {
    name: "Another Test User",
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10),
  },
  {
    name: "Animesh Raj",
    email: "animesh@example.com",
    password: bcrypt.hashSync("password123", 10),
    isAdmin: true,
  },
];

export default users;
