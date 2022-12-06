//import { useEffect, useState } from "react";
import { useUserData } from "../context/UserProvider";
import "../styles/comment.css";
import { sortByDate } from "../utils/functions";
import EditableComment from "./EditableComment";

function Comments() {
    const { users, currentUser } = useUserData();

    //hace un arreglo de los comentarios de los usuarios y
    //les agrega su autor id y nombre
    const usersCommentsArray = users
        .map((user) => {
            return user.userComments.map((comment) => {
                return {
                    ...comment,
                    user_id: user._id,
                    userName: user.userName,
                };
            });
        })
        .flat()
        .sort(sortByDate);

    const commentsHTML = usersCommentsArray.map((comment) => {
        delete comment.updatedAt;

        return (
            <div className="comment" key={comment._id}>
                {currentUser._id === comment.user_id ? (
                    <EditableComment comment={comment} />
                ) : (
                    <>
                        <h2 className="user-name">{comment.userName}</h2>
                        <p>{comment.comment}</p>
                    </>
                )}
            </div>
        );
    });

    return (
        <div className="comments-container">
            <h1>Comment Thread</h1>
            <hr/>
            <div className="comment-array">{commentsHTML}</div>
        </div>
    );
}

export default Comments;
