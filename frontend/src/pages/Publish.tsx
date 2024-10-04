import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export const Publish = () => {
  const [clicked, setclicked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const publishHandler = async () => {
    try {
      setclicked(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content: description },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log("RESP::", response);
      navigate(`/blog/${response.data.blogId}`);
      toast.success("Published successfully");
    } catch (e: any) {
      console.log("Error in publishing blog::", e);
      toast.error(
        e.response.data.error ||
          e.response.data.message ||
          "Error while publishing blog"
      );
    } finally {
      setclicked(false);
    }
  };

  if (clicked) return <Loader message="Publishing"/>;
  return (
    <div className="min-h-screen flex justify-center items-center mt-10 md:mt-0  bg-pink-50 pt-10 px-4">
      <div className="max-w-screen-md w-full mx-2 md:mx-auto bg-white border border-gray-400 p-4 md:p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Publish Your Blog
        </h1>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
          placeholder="Title"
        />
        <TextEditor onChange={(e) => setDescription(e.target.value)} />
        <button
          onClick={publishHandler}
          type="submit"
          className="mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
        >
          Publish Blog
        </button>
      </div>
    </div>
  );
};

function TextEditor({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between border border-gray-300 bg-white rounded-lg p-2">
        <div className="w-full">
          <label htmlFor="editor" className="sr-only">
            Publish post
          </label>
          <textarea
            onChange={onChange}
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
