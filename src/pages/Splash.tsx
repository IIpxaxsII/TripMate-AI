import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative">
            <Plane className="w-20 h-20 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white">TripMate AI</h1>
        <p className="text-white/90 text-lg">Your Personal Travel Assistant</p>
      </div>
    </div>
  );
};

export default Splash;
