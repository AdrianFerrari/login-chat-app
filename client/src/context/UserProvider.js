import { createContext, useContext, useState, useEffect } from "react";
import {
    getUsers,
    refreshAccessToken,
    editComment,
    deleteComment,
    deleteUser,
    login,
    signup,
} from "../utils/api";

const UserDataContext = createContext({});

export function useUserData() {
    return useContext(UserDataContext);
}

export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [accessToken, setAccessToken] = useState("");
    const [isLogIn, setIsLogIn] = useState(false);

    async function getUserData() {
        const response = await refreshAccessToken();
        if (!response?.success) return setIsLogIn(false);
        setCurrentUser(response.user);
        setAccessToken(response.accessToken);
        setIsLogIn(true);
    }

    async function getUsersArray() {
        const response = await getUsers();
        setUsers(response);
    }

    async function editUserComment(comment) {
        const response = await editComment(comment, accessToken);
        if (!response?.success) return
        const newusers = users.map(user => {
            return {
                ...user,
                userComments: user.userComments.map(item => item._id === comment._id ? {...item, comment:comment.comment} : item)
            }
        })
        setUsers(newusers)
    }

    async function deleteUserComment(comment) {
        const response = await deleteComment(comment, accessToken);
        if (!response?.success) return
        const newusers = users.map(user => {
            return {
                ...user,
                userComments: user.userComments.filter(item => item._id !== comment._id)
            }
        })
        setUsers(newusers)
    }

    async function deleteUserAccount() {
        const response = await deleteUser(
            { userName: currentUser.userName },
            accessToken
        );
        if (!response?.success) return
        getUsersArray();
    }

    async function loginUser(user) {
        const response = await login(user);
        if (!response.success) {
            setIsLogIn(false);
            throw new Error(response.message);
        }
        setCurrentUser(response.data);
        setAccessToken(response.accessToken);
        setIsLogIn(true);
    }

    async function signupUser(user) {
        const response = await signup(user);
        if (!response.success) {
            if (response.code === 11000) {
                throw new Error("that name is already used");
            }
            throw new Error(response.message);
        }
        setCurrentUser(response.data);
        setAccessToken(response.accessToken);
    }

    useEffect(() => {
        getUsersArray();
        getUserData();
    }, []);

    return (
        <UserDataContext.Provider
            value={{
                users,
                currentUser,
                accessToken,
                isLogIn,
                setCurrentUser,
                getUsersArray,
                setAccessToken,
                setIsLogIn,
                editUserComment,
                deleteUserComment,
                deleteUserAccount,
                loginUser,
                signupUser,
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
}
