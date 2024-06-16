import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, Link } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login, logout } from "../features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SignupInput } from "@dushyant2909/medium-common";

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name: string;
  [key: string]: any; // Allow additional props
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
  name,
  ...restprops
}: LabelledInputType) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <label className="block mb-2 text-sm text-black font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={showPassword ? "text" : type || "text"}
        name={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        {...restprops}
      />
      {type === "password" && (
        <div
          className="absolute top-10 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}
    </div>
  );
}

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {type === "signup" ? "Create an account" : "Login to your account"}
          </div>
          <div className="text-gray-500">
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
        <form className="mt-8 flex flex-col gap-2" onSubmit={sendRequest}>
          {type === "signup" && (
            <LabelledInput
              label="Name"
              placeholder="John Doe.."
              name="name"
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
            name="email"
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
            name="password"
            placeholder="12345 (Atleast 4 chars)"
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
            className="mt-8 w-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 text-white font-medium rounded-lg text-sm px-5 py-2.5"
          >
            {type === "signup" ? "Sign Up" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};
