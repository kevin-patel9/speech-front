import React, { useContext, useEffect, useState } from "react";
import DoughnutChart from "./components/Doughnut";
import BarGraphChart from "./components/BarGraph";
import FloatingPlusButton from "./components/Model";
import { UserAuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import TransactionList from "./components/TransactionList";

const HomePage = () => {
  const [refresh, setRefresh] = useState(false);
  const { isLoggedIn } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    signOut(auth);
    setRefresh(!refresh);
    navigate("/login");
  };

  return (
    <div className="bg-gray-200 flex flex-col items-center p-6 relative">
      <div className="flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-1/2 p-2">
          <DoughnutChart refresh={refresh} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <TransactionList refresh={refresh} />
        </div>
      </div>
      <div className="w-full max-w-4xl mt-4 p-2">
          <BarGraphChart refresh={refresh} />
      </div>
      <button
        onClick={handleLogout}
        className="fixed top-5 right-5 transition rounded duration-300 hover:bg-blue-600 p-2"
      >
        Logout
      </button>
      <FloatingPlusButton refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
};

export default HomePage;
