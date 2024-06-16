import React, { useState, useEffect, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface AuthLayoutProps {
  children: ReactNode;
  authentication?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state: any) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/signin");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <Loader /> : <>{children}</>;
};

export default AuthLayout;
