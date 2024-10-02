import { commonPoint } from "./Apicall";

export const setToken = async (uid) => {
    try {
        const response = await fetch(`${commonPoint}/api/v1/user/loginToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid }),
        });

        const data = await response.json();
        document.cookie = `token=${data.token}; path=/`;
        
    } catch (error) {
        console.error("Error setting token:", error);
    }
};