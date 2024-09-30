import { postData } from "../common/Apicall"

export const registerApi = (data) => {
    return postData("/api/v1/user/register", data);
}

export const checkIfUserExistApi = (uid) => {
    return postData("/api/v1/user/checkIfUserExist", { uid });
}