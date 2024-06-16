import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@dushyant2909/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/authSlice";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function fetchData() {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const userData = response.data.user;

      if (userData) {
        dispatch(login({ userData }));
      } else {
        dispatch(logout());
      }
    } catch (e) {
      console.error("Error in getting current user details ::", e);
    }
  }

  async function sendRequest(event: React.FormEvent) {
    event.preventDefault(); // Prevents the default form submission behavior
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      const jwt = response.data.jwt;
      localStorage.setItem("token", jwt);

      fetchData();

      if (type === "signup") toast.success("User registered successfully");
      else toast.success("Logged in successfully");
      navigate("/");
    } catch (e: any) {
      console.log("Error while signup::", e);
      toast.error(
        e.response.data.error ||
          e.response.data.message ||
          "Error while signing up"
      );
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">
              {type === "signup"
                ? "Create an account"
                : "Login to your account"}
            </div>
            <div className="text-slate-500">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
          <div className="pt-8">
            <form onSubmit={sendRequest}>
              {type === "signup" && (
                <LabelledInput
                  label="Name"
                  placeholder="John Doe.."
                  onChange={(e) => {
                    setPostInputs({
                      ...postInputs,
                      name: e.target.value,
                    });
                  }}
                />
              )}
              <LabelledInput
                label="Email"
                placeholder="youremail@gmail.com"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    email: e.target.value,
                  });
                }}
                autoComplete="username"
              />
              <LabelledInput
                label="Password"
                type="password"
                placeholder="123456"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    password: e.target.value,
                  });
                }}
                autoComplete="current-password"
              />
              <button
                type="submit"
                className="mt-8 w-full text-white bg-gray-800 hover:bg-grXay-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                {type === "signup" ? "Sign Up" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  [key: string]: any; // Allow additional props
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
  ...restprops
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        {...restprops}
      />
    </div>
  );
}
