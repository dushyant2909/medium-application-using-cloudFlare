import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/authSlice";

export interface Blog {
  content: string;
  title: string;
  id: string;
  author: {
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.blog);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};

export const getCurrentUser = () => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(logout()); // Optionally, you can log out
        setLoading(false); // End loading since there's no token
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const userData = response?.data.user;

        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      } catch (e) {
        console.error("Error in getting current user details ::", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return {
    loading,
  };
};

// Utility function to format dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth(); // getMonth() returns 0-based month index
  const year = date.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daySuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"; // Covers 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(day)} ${monthNames[month]} ${year}`;
}
