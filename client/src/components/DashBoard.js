import { useState } from "react";
import "../styles/dashboard.css";
import { passChange, postComment, logoutUser } from "../utils/api";
import { useUserData } from "../context/UserProvider";

function DashBoard() {
    const {
        currentUser,
        setCurrentUser,
        getUsersArray,
        setIsLogIn,
        accessToken,
        setAccessToken,
        deleteUserAccount,
    } = useUserData();
    const [comment, setComment] = useState("");
    const [optionWindow, setOptionWindow] = useState("");
    const [passwords, setPassWords] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    function handleCommentChange(event) {
        const value = event.target.value;
        setComment(() => value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await postComment({
            userName: currentUser.userName,
            userComment: comment,
        });
        setComment("");
        getUsersArray();
        return response;
    }

    function handlePasswordChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setPassWords((prevState) => {
            return { ...prevState, [name]: value };
        });
    }

    async function handlePasswordSubmition() {
        const response = await passChange(
            {
                userName: currentUser.userName,
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            },
            accessToken
        );
        if (!response.success) return setErrorMsg(response.message);
        setErrorMsg("");
        setOptionWindow("");
    }

    async function logOut() {
        await logoutUser();
        setCurrentUser({});
        setAccessToken("")
        setIsLogIn(false);
    }

    async function deleteuser() {
        await deleteUserAccount();
        logOut();
    }

    const passOptionHTML = (
        <div className="option-window">
            <label htmlFor="oldpass">old password:</label>
            <input
                type="password"
                id="oldpass"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
            />
            <label htmlFor="newpass">new password:</label>
            <input
                type="password"
                id="newpass"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
            />
            <div className="change-confirm">
                <button onClick={handlePasswordSubmition}>confirm</button>
                <button
                    onClick={() => {
                        setOptionWindow("");
                        setErrorMsg("");
                    }}
                >
                    cancel
                </button>
            </div>
        </div>
    );

    const deleteOptionHTML = (
        <div className="option-window">
            <h4>Are you sure?</h4>
            <div className="delete-confirm">
                <button onClick={deleteuser}>yes</button>
                <button onClick={() => setOptionWindow("")}>cancel</button>
            </div>
        </div>
    );

    return (
        <div className="dash-board">
            <h1>Hi {currentUser.userName}</h1>
            <div className="dash-options">
                <span onClick={() => setOptionWindow("deleteacc")}>
                    delete account
                </span>
                <span onClick={() => setOptionWindow("passchange")}>
                    change password
                </span>
                <span onClick={logOut}>logout</span>
            </div>
            <p className={errorMsg ? "errMsg" : "offscreen"}>{errorMsg}</p>
            {optionWindow === "passchange" && passOptionHTML}
            {optionWindow === "deleteacc" && deleteOptionHTML}
            <form onSubmit={handleSubmit}>
                <textarea
                    name="userComment"
                    value={comment}
                    onChange={handleCommentChange}
                />
                <button>Post</button>
            </form>
        </div>
    );
}

export default DashBoard;
