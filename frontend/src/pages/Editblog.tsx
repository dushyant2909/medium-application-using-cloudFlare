import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useBlog } from "../hooks";
import Loader from "../components/Loader";

export const Editblog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id || "" });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setDescription(blog.content || "");
    }
  }, [blog]);

  const navigate = useNavigate();

  const editHandler = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog/${id}`,
        { title, content: description },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      navigate(`/blog/${response.data.id}`);
      toast.success("Blog updated successfully");
    } catch (e: any) {
      console.log("Error in updating blog:", e);
      toast.error(
        e.response?.data?.error ||
          e.response?.data?.message ||
          "Error while updating blog"
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex justify-center items-center mt-10 md:mt-0 bg-gray-100 py-8 px-4">
      <div className="max-w-screen-md w-full mx-2 md:mx-auto bg-white p-4 md:p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Edit Your Blog
        </h1>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
          placeholder="Title"
        />
        <TextEditor
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={editHandler}
          type="submit"
          className="mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          Update Blog
        </button>
      </div>
    </div>
  );
};

interface TextEditorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between border border-gray-300 bg-white rounded-lg p-2">
        <div className="w-full">
          <label htmlFor="editor" className="sr-only">
            Edit post
          </label>
          <textarea
            onChange={onChange}
            value={value}
            id="editor"
            rows={8}
            className="focus:outline-none block w-full px-2 text-sm text-gray-800 bg-white border-0"
            placeholder="Write about your blog..."
            required
          />
        </div>
      </div>
    </div>
  );
}
