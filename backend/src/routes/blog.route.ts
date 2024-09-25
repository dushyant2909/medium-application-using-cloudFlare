import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {
  updatePostInput,
  createPostInput,
  UpdatePostType,
} from "@dushyant2909/medium-common";

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
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    c.status(403);
    return c.json({
      success: false,
      message: "Authorization token missing or malformed",
    });
  }

  try {
    const payload = await verify(authHeader, c.env.JWT_SECRET);

    if (!payload || !payload.id) {
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
      success: false,
      message: "Error in user verification middleware for blog routes",
      error: e,
    });
  }
});

// Create a blog
blogRouter.post("/", async (c) => {
  const body = await c.req.json();

  const { success } = createPostInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      success: false,
      message: "Inputs not in correct format",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Get author id from context provided by token
    const authorId = c.get("userId");

    if (!body.title || !body.content) {
      c.status(400);
      return c.json({ error: "Title and content of blog are required" });
    }

    // Create a blog post
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({
      success: true,
      message: "Blog created successfully",
      blogId: blog.id,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      message: "Error while creating a blog post",
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Edit a blog post
blogRouter.put("/:id", async (c) => {
  // Get blog id from url
  const id = c.req.param("id");

  if (!id) {
    c.status(404);
    return c.json({
      success: false,
      message: "Blog id is required which you want to update",
    });
  }

  // Get userId from the context (set during token verification middleware)
  const userId = c.get("userId");
  if (!userId) {
    c.status(403);
    return c.json({
      success: false,
      message: "You must be logged in to update a blog post",
    });
  }

  const body = await c.req.json();

  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      success: false,
      message: "Inputs not in correct format",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Find the blog post to check ownership
    const existingPost = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        authorId: true,
      },
    });

    if (!existingPost) {
      c.status(404);
      return c.json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if the logged-in user is the owner of the post
    if (existingPost.authorId !== userId) {
      c.status(403);
      return c.json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    // Initialize dataToUpdate with the correct type
    const dataToUpdate: UpdatePostType = {};
    if (body.title) dataToUpdate.title = body.title;
    if (body.content) dataToUpdate.content = body.content;

    // Update blog post
    const updatedPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });

    return c.json({
      success: true,
      message: "Blog post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      message: "Error while updating a blog post",
      error,
    });
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.delete("/:id", async (c) => {
  const blogId = c.req.param("id");

  // Get logged-in user id from the token
  const userId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Find the blog post to check ownership
    const existingPost = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      },
    });

    // Check if the post exists
    if (!existingPost) {
      return c.json(
        {
          success: false,
          message: "Blog post not found",
        },
        404
      );
    }

    // Check if the logged-in user is the owner of the post
    if (existingPost.authorId !== userId) {
      return c.json(
        {
          success: false,
          message: "You are not authorized to delete this post",
        },
        403
      );
    }

    // Delete the blog post
    await prisma.post.delete({
      where: {
        id: blogId, // Delete post by its ID
      },
    });

    // Return success response
    return c.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Error while deleting the blog post",
        error,
      },
      500
    );
  } finally {
    await prisma.$disconnect();
  }
});

// Get blogs in bulk
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

// Get a particular blog information
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
