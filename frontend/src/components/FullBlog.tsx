import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex justify-center bg-gray-50 py-10 mt-[60px]">
      <div className="grid grid-cols-12 gap-8 w-full max-w-screen-xl px-6 lg:px-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-lg shadow-lg ">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            {blog.title}
          </h1>
          <p className="text-slate-500 mb-6">Posted on 2nd December 2023</p>
          <div className="text-gray-700 leading-relaxed text-justify space-y-4">
            {blog.content}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-8 rounded-lg shadow-lg  flex flex-col">
            <h2 className="text-slate-600 text-xl font-semibold mb-4">
              Author Details
            </h2>
            <div className="flex items-center mb-2">
              <Avatar size="big" name={blog.author.name || "Anonymous"} />
              <h3 className="ml-4 text-2xl font-bold text-gray-900">
                {blog.author.name || "Anonymous"}
              </h3>
            </div>
            <p className="text-slate-500">
              Random catch phrase about the author's ability to grab the user's
              attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
