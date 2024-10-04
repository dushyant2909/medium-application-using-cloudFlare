import { useSelector } from "react-redux";
import { Blog, formatDate } from "../hooks";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  const userData = useSelector((state: any) => state.auth?.userData?.userData);

  // Condition to check if userData.id matches blog.authorId
  const isOwner = userData && userData.id === blog.authorId;

  const navigate = useNavigate();

  const deleteHandler = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      navigate("/");
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      console.error("Error deleting the blog:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error while deleting blog"
      );
    }
  };

  return (
    <div className="flex justify-center bg-pink-50  min-h-screen py-10 pt-[90px]">
      <div className="grid grid-cols-12 gap-8 w-full max-w-screen-xl px-6 lg:px-8">
        <div className="col-span-12 lg:col-span-8 border border-gray-400 h-fit bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <p className="text-slate-500 mb-6">
            Posted on {formatDate(blog.createdAt)}
          </p>
          <div className="text-gray-700 leading-relaxed text-justify space-y-4">
            {blog.content}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-slate-600 text-xl font-semibold mb-4">
              Author Details
            </h2>
            <div className="flex items-center mb-2">
              <Avatar size="big" name={blog.author.name || "Anonymous"} />
              <div className="">
                <h3 className="ml-4 text-2xl font-bold text-gray-900">
                  {blog.author.name || "Anonymous"}
                </h3>
                <h2 className="ml-4 text-gray-900">{blog.author.email}</h2>
              </div>
            </div>
            <p className="text-slate-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
              adipisci.
            </p>
          </div>
          {/* Conditional rendering of Edit button */}
          {isOwner && (
            <>
              <Link
                to={`/edit/blog/${blog.id}`}
                className="mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              >
                Edit Blog
              </Link>
              <button
                className="mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-red-900 hover:bg-red-800"
                onClick={deleteHandler}
              >
                Delete Blog
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
