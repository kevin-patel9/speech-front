import { commonPoint } from "./Apicall";

export const setToken = (uid) => {
    try {
        fetch(`${commonPoint}/api/v1/user/loginToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            document.cookie = `token=${data.token}; path=/`;
        })
        .catch((error) => console.error(error));
    } catch (e) {
        console.log(e);
    }
};