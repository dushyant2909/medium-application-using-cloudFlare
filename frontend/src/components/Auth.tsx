import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { SignupInput } from "@dushyant2909/medium-common";
// import axios from "axios";
// import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  //   const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest(event: React.FormEvent) {
    event.preventDefault(); // Prevents the default form submission behavior
    try {
      console.log("PI:", postInputs);

      //   const response = await axios.post(
      //     `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
      //     postInputs
      //   );
      //   const jwt = response.data;
      //   localStorage.setItem("token", jwt);
      //   navigate("/blogs");
    } catch (e) {
      alert("Error while signing up");
      // alert the user here that the request failed
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>
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
                {type === "signup" ? "submit" : "Sign in"}
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
        // id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        {...restprops}
      />
    </div>
  );
}
