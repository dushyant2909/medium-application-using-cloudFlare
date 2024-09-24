import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@dushyant2909/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  
  // const { success } = signupInput.safeParse(body);

  // if (!success) {
  //   c.status(411);
  //   return c.json({
  //     message: "Inputs not in correct format",
  //   });
  // }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Check if the user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { email: body.email },
    // });
    // if (existingUser) {
    //   c.status(409);
    //   return c.json({ error: "Email already in use" });
    // }
    const imageSeed = body.name[0];
    // Create a new user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
        thumbnail: `https://api.dicebear.com/5.x/initials/svg?seed=${imageSeed}`,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    console.log("Error in singup route::", e);

    c.status(403);
    return c.json({ error: "Error while signing up" });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not in correct format",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      c.status(403); // unauthorised
      return c.json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = body.password == user.password;

    if (!isPasswordValid) {
      c.status(403);
      return c.json({ error: "Invalid password" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error while signing in" });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.use("/me", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";

  try {
    const payload = await verify(authHeader, c.env.JWT_SECRET);

    if (!payload) {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }

    //@ts-ignore
    c.set("userId", payload.id);

    await next(); // Ensuring next middleware or route handler is called
  } catch (e) {
    console.log("Error in middleware::", e);
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});

userRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        thumbnail: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ message: "User not found" });
    }

    return c.json({ user });
  } catch (e) {
    console.log("Error in fetching user details::", e);
    c.status(500);
    return c.json({ error: "Error while fetching user details" });
  } finally {
    await prisma.$disconnect();
  }
});
