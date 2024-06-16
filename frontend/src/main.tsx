import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Signup } from "./pages/Signup.tsx";
import { Signin } from "./pages/Signin.tsx";
import { Blogs } from "./pages/Blogs.tsx";
import { Blog } from "./pages/Blog.tsx";
import { Publish } from "./pages/Publish.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import AuthLayout from "./components/AuthLayout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/signin",
        element: (
          <AuthLayout authentication={false}>
            <Signin />
          </AuthLayout>
        ),
      },
      {
        path: "/",
        element: (
          <AuthLayout authentication>
            <Blogs />
          </AuthLayout>
        ),
      },
      {
        path: "/blog/:id",
        element: <Blog />,
      },
      {
        path: "/publish",
        element: <Publish />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
