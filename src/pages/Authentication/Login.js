import React, { useContext, useEffect, useState } from "react";
import google from "../../assets/google.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { setToken } from "../../common/LoginTokenCall";
import { UserAuthContext } from "../../App";
import { checkIfUserExistApi } from "../../API/UserApi";

const LoginPage = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");
    const { isLoggedIn } = useContext(UserAuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/");
    },[isLoggedIn]);
    
    console.log(isLoggedIn);

    const submitLoginCred = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userExists = await checkIfUserExistApi(user.uid);

            if (!userExists?.user) {
                setError("User does not exist in the database. Deleting account...");
                
                // Delete the user account
                await deleteUser(user);
                return;
            }

            setToken(user.uid);
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user")
                setError("Something went wrong")
        }
    };

    const handleLoginWithEmail = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            const user = result.user;
            setToken(user.uid);
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user"){
                setError("Something went wrong")
                return;
            }

            if (error.code === "auth/invalid-credential")
                setError("Invalid email id");
        }
    };

    return (
        <div className="w-full h-screen flex flex-row">
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[425px] flex flex-col gap-4 p-4 rounded-[8px] border-[#D7D7D7] border-[1px] justify-self-center place-self-center ">
            <div className="font-semibold text-4">Login</div>
            {error && <div className="text-red-500">{error}</div>}
            <form className="w-full text-4 font-medium flex flex-col gap-[24px]">
            <input
                className="w-full  h-[36px] border-b-[2px] border-[#9A9A9A] placeholder:text-[#9A9A9A]"
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError("");
                }}
            />
            <input
                className="w-full  h-[36px] border-b-[2px] border-[#9A9A9A] placeholder:text-[#9A9A9A]"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setError("");
                }}
            />
            <button
                onClick={handleLoginWithEmail}
                className="border-[#9A9A9A] h-[36px] border-[1px] rounded-[8px] flex items-center justify-center gap-2 cursor-pointer"
            >
                Login
            </button>
            {/* <NavLink to="/AccountRecovery" className="w-full text-right text-[#999999]">Forget Password ?</NavLink> */}
            </form>
            <div className="flex flex-col gap-[24px]">
            <div className="flex flex-row justify-between items-center gap-4">
                <hr className="w-full h-[2px] bg-[#999999]" />
                <div className="text-nowrap text-[#999999]">Or Login Using</div>
                <hr className="w-full h-[2px] bg-[#999999]" />
            </div>
            <div className="flex flex-col gap-4 items-center font-semibold">
                <img onClick={submitLoginCred} src={google} alt="" />
                <div>
                New to website?{" "}
                <NavLink to="/register" className="text-pbRed">
                    Sign Up
                </NavLink>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
