import { Hono } from "hono";
import { userRouter } from "./routes/user.route";
import { blogRouter } from "./routes/blog.route";
import { cors } from "hono/cors";

// Initialise app using Hono
const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Medium application using HONO!");
});

app.use("/*", cors());

// Define a prefix for each route
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
