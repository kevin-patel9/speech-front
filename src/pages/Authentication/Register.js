import React, { useContext, useEffect, useState } from "react";
import google from "../../assets/google.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { registerApi } from "../../API/UserApi";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { UserAuthContext } from "../../App";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVqyZyrxcejXSb8XlLZM6963-G6QPIfrw",
  authDomain: "listen2-lt.firebaseapp.com",
  projectId: "listen2-lt",
  storageBucket: "listen2-lt.appspot.com",
  messagingSenderId: "285191480761",
  appId: "1:285191480761:web:513f5483596edb32a08268",
  measurementId: "G-51NTW6S7T2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoggedIn } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
      if (isLoggedIn) navigate("/");
  },[isLoggedIn]);

  const generateRandomName = () => {
    const randomId = Math.floor(Math.random() * 1234567890);
    return "user" + randomId;
  };

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const name = user.displayName || generateRandomName();

      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
      });
      const data = { uid: user.uid, name, email };
      await registerApi(data);
      navigate("/");

    } catch (error) {
      if (error.code === "auth/email-already-in-use"){
        setError("User with email already exist");
        return;
      }

      setError("Registration failed. Please check your details and try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const name = user.displayName || generateRandomName();

      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        uid: user.uid,
      });

      const data = {
        uid: user.uid,
        name,
        email: user.email,
      };
      await registerApi(data);
      navigate("/");

    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="absolute top-[10%] left-[90%] translate-x-[-50%] translate-y-[-50%] z-10 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 text-4 font-semibold">
          <div>Already have an Account?</div>
          <NavLink
            to="/login"
            className="w-fit px-[24px] py-2 bg-pbRed rounded-[8px]"
          >
            Log In
          </NavLink>
        </div>
      </div>

      <NavLink to="/">
        <p>Home</p>
      </NavLink>

      <div className="mt-[36px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[425px] flex flex-col gap-4 p-4 rounded-[8px] border-[#D7D7D7] border-[1px] justify-self-center place-self-center ">
        <div className="font-semibold text-4">Create Account</div>
        {error && <div className="text-red-500">{error}</div>}{" "}
        {/* Error message */}
        <form
          className="w-full text-4 font-medium flex flex-col gap-4"
          onSubmit={handleEmailSignup}
        >
          {/* Name input */}
          <label htmlFor="name" className="font-semibold">
            Name
            <input
              id="name"
              className="w-full h-[36px] border-b-[2px] border-[#9A9A9A] placeholder:text-[#9A9A9A]"
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
            />
          </label>

          {/* Email input */}
          <label htmlFor="email" className="font-semibold">
            Email
            <input
              id="email"
              className="w-full h-[36px] border-b-[2px] border-[#9A9A9A] placeholder:text-[#9A9A9A]"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </label>

          {/* Password input */}
          <label htmlFor="password" className="font-semibold">
            Password
            <input
              id="password"
              className="w-full h-[36px] border-b-[2px] border-[#9A9A9A] placeholder:text-[#9A9A9A]"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </label>

          <button
            className="border-[#9A9A9A] h-[36px] border-[1px] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
          >
            Register
          </button>
        </form>
        {/* Google sign-in button */}
        <div className="flex justify-center items-center">
          <div
            className="w-full border-[#9A9A9A] h-[36px] border-[1px] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            <img className="w-[20px]" src={google} alt="Google" />
            <span>Sign in with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
