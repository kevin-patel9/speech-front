export const commonPoint = process.env.REACT_APP_ENDPOINT;

export function getCookie(name) {
    const cookieValue = document.cookie.match(
        "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return cookieValue ? cookieValue.pop() : "";
}

export const postData = async (endPoint = "", data, type = false) => {
    try {
        const url = commonPoint + endPoint;

        const token = getCookie("token");
        const headers = type
            ? { Authorization: `Bearer ${token}` }
            : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

        const body = type ? data : JSON.stringify(data);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        return response.json();
    } catch (error) {
        console.log("Error posting data:");
    }
};

export const getData = async (endPoint = "") => {
    try {
        const url = commonPoint + endPoint;
        const token = getCookie("token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, {
            headers,
            method: "GET",
        });

        return response.json();
    } catch (error) {
        console.error("Error fetching data:");
    }
};


