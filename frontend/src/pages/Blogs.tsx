import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { formatDate, useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div className="mt-[60px] flex justify-center bg-pink-50">
        <div>
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 flex flex-col justify-center bg-pink-50 items-center gap-5 px-4">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          authorName={blog.author.name || "Anonymous"}
          title={blog.title}
          content={blog.content}
          authorId={blog.authorId}
          publishedDate={formatDate(blog.createdAt)}
        />
      ))}
    </div>
  );
};
