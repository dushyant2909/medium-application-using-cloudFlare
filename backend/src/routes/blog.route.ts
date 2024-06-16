import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogPostInput } from "@dushyant2909/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// All routes need to be authenticated so use middleware
blogRouter.use("/*", async (c, next) => {
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

blogRouter.post("/", async (c) => {
  const body = await c.req.json();

  const { success } = createBlogPostInput.safeParse(body);

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
    const authorId = c.get("userId");

    if (!body.title || !body.content) {
      c.status(400);
      return c.json({ error: "Title and content are required" });
    }

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({
      id: blog.id,
    });
  } catch (e) {
    console.log("Error in uploading blog::", e);
    c.status(500);
    return c.json({ error: "Error while creating a blog post" });
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.put("/:id", async (c) => {
  const body = await c.req.json();

  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Define an interface for the dataToUpdate object
    interface UpdateData {
      title?: string;
      content?: string;
    }

    // Initialize dataToUpdate with the correct type
    const dataToUpdate: UpdateData = {};
    if (body.title) dataToUpdate.title = body.title;
    if (body.content) dataToUpdate.content = body.content;

    const blog = await prisma.post.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });

    return c.json({
      id: blog.id,
    });
  } catch (e) {
    console.log("Error in updating blog::", e);
    c.status(500);
    return c.json({ error: "Error while updating a blog post" });
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        authorId: true,
      },
    });

    return c.json({
      blogs,
    });
  } catch (e) {
    console.log("Error in getting blogs::", e);
    c.status(500);
    return c.json({ error: "Error while fetching blog posts" });
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        authorId: true,
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({ message: "Blog post not found" });
    }

    return c.json({
      blog,
    });
  } catch (e) {
    console.log("Error while fetching blog post::", e);
    c.status(500);
    return c.json({
      message: "Error while fetching blog post",
    });
  } finally {
    await prisma.$disconnect();
  }
});
