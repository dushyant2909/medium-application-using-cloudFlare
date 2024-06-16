import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${id}`}
      className="block transition duration-300 transform hover:scale-105"
    >
      <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md w-full max-w-screen-md mx-auto">
        <div className="flex items-center mb-4">
          <Avatar name={authorName} />
          <div className="ml-3">
            <div className="text-gray-800 font-semibold">{authorName}</div>
            <div className="flex items-center text-gray-500 text-sm">
              <Circle />
              <span className="ml-2">{publishedDate}</span>
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-2">{title}</div>
        <div className="text-gray-700 mb-4">
          {content.slice(0, 100) + "..."}
        </div>
        <div className="text-gray-500 text-sm">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
      </div>
    </Link>
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
