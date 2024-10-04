import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  authorId: string;
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
  id,
}: BlogCardProps) => {
  return (
    <div className="h-auto md:max-w-screen-lg max-w-screen-sm bg-emerald-50 w-full p-6 rounded-lg shadow-md border border-emerald-700 hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <Link to={`/blog/${id}`}>
        <div className="mb-2">
          <h2 className="text-2xl font-bold capitalize">{title}</h2>
        </div>

        <div className="mb-3 flex justify-between">
          <div className="text-sm text-gray-800 capitalize">{authorName}</div>
          <div className="text-sm text-gray-800">{publishedDate}</div>
        </div>

        <div className="mb-4">
          <p className="text-justify">
            {content.slice(0, 500) + " .... "}
            <span className="underline cursor-pointer">Read more</span>
          </p>
        </div>

        <div className="text-gray-700 text-sm">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
      </Link>
    </div>
  );
};

export function Circle() {
  return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  // Adjust size dynamically based on screen size
  const sizeClasses = size === "small" ? "sm:w-8 sm:h-8" : "sm:w-12 sm:h-12";

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-300 rounded-full ${sizeClasses} lg:w-12 lg:h-12`}
    >
      <span
        className={`${
          size === "small" ? "text-sm" : "text-lg"
        } font-semibold text-gray-800`}
      >
        {name[0]}
      </span>
    </div>
  );
}
