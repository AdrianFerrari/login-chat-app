import axios from "axios";

const controller = new AbortController();
const client = axios.create({
    baseURL: '/',
    withCredentials: true,
    timeout: 5000,
});


export async function getUsers() {
    try {
        const response = await client.get("/user/all", {
            signal: controller.signal,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getUser(accessToken) {
    try {
        const response = await client.get("/", {
            headers: { authorization: "Bearer " + accessToken },
            signal: controller.signal,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function login(data) {
    try {
        const response = await client.post("/user/login", data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function signup(data) {
    try {
        const response = await client.post("/user/signup", data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function passChange(data, accessToken) {
    try {
        const response = await client.post("/user/passchange", data, {
            headers: { Authorization: "Bearer " + accessToken },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function postComment(data) {
    try {
        const response = await client.post("/user/comment", data, {
            signal: controller.signal,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function refreshAccessToken() {
    try {
        const response = await client.get("/user/refresh");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function logoutUser() {
    try {
        const response = await client.get("/user/logout");
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function editComment(data, accessToken) {
    try {
        const response = await client.post("/user/comment/update", data, {
            headers: { Authorization: "Bearer " + accessToken },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteComment(data, accessToken) {
    try {
        const response = await client.post("/user/comment/delete", data, {
            headers: { Authorization: "Bearer " + accessToken },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteUser(data, accessToken) {
    try {
        const response = await client.post("/user/delete", data, {
            headers: { Authorization: "Bearer " + accessToken },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
