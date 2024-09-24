import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

// Use Bindings to define the type of variables used in .env
// Use Variables to define the type of variable used in token
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Register a user
userRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  // const { success } = signupInput.safeParse(body);

  // if (!success) {
  //   c.status(411);
  //   return c.json({
  //     message: "Inputs not in correct format",
  //   });
  // }

  //   Initialise prisma client
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ success: false, message: "Email already in use" });
    }
    // Generate image using first letter of name
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
    // Create a jwt token for the user
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      success: true,
      message: "User registered successfully",
      jwt,
    });
  } catch (e) {
    console.log("Error in singup route::", e);
    c.status(403);
    return c.json({
      success: false,
      message: "Error while signing up",
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Signin a user
userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  //   const { success } = signinInput.safeParse(body);

  //   if (!success) {
  //     c.status(411);
  //     return c.json({
  //       message: "Inputs not in correct format",
  //     });
  //   }

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
      return c.json({ error: "Incorrect password" });
    }

    // Create a jwt token
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ success: true, message: "Logged in successfully", jwt });
  } catch (error) {
    c.status(500);
    return c.json({ success: false, message: "Error while signing in", error });
  } finally {
    await prisma.$disconnect();
  }
});

// Middleware to set userId from token to c after verifying
userRouter.use("/me", async (c, next) => {
  // Get token
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    c.status(403);
    return c.json({
      success: false,
      message: "Authorization token missing or malformed",
    });
  }

  try {
    // Verify the token
    const payload = await verify(authHeader, c.env.JWT_SECRET);

    if (!payload || !payload.id) {
      c.status(403);
      return c.json({
        success: false,
        message: "You are not logged in",
      });
    }

    // @ts-ignore
    // set the user id to context (c) for future use
    c.set("userId", payload.id);

    await next(); // Ensuring next middleware or route handler is called
  } catch (e) {
    c.status(403);
    return c.json({
      success: false,
      message: "Error in verifying user login middleware",
      error: e,
    });
  }
});

// Get details of currently logged in user
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
      return c.json({ success: false, message: "User not found" });
    }

    return c.json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (e) {
    c.status(500);
    return c.json({
      success: false,
      message: "Error while fetching logged in user details",
      error: e,
    });
  } finally {
    await prisma.$disconnect();
  }
});
