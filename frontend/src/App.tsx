import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Appbar } from "./components/Appbar";
import { getCurrentUser } from "./hooks";
import Loader from "./components/Loader";

function App() {
  const location = useLocation();

  // Check if the current path is /signup or /signin
  const hideAppbar =
    location.pathname === "/signup" || location.pathname === "/signin";

  const { loading } = getCurrentUser();

  if (loading) {
    return <Loader />;
  }
  
  return (
    <>
      <div>
        {!hideAppbar && <Appbar />} {/* Conditionally render Appbar */}
        <main>
          <Outlet />
        </main>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
}

export default App;
