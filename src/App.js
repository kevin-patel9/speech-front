import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Authentication/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase/firebase"
import Register from "./pages/Authentication/Register";
import HomePage from "./pages/HomePage";
import { getCookie } from "./common/Apicall";

export const UserAuthContext = createContext();

const App = () => {
  const [userUid, setUserUid] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!getCookie("token")){
      signOut(auth);
    }

    onAuthStateChanged(auth, (user) => {
      if (user) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    });  

    setUserUid(auth);
  }, []);

  return (
    <UserAuthContext.Provider value={{ userUid, isLoggedIn }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </UserAuthContext.Provider>
  );
};

export default App;
