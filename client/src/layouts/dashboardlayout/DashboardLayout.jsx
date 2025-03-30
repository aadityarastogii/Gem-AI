import React, { useEffect } from "react";
import "./dashboardlayout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ChatList from "../../components/chatList/ChatList";
const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();

  const nevigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      nevigate("/sign-in");
    }
  }, [isLoaded, userId, nevigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList/>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
