import { useState, useRef, useEffect } from "react";
import { useUserData } from "../context/UserProvider";
import "../styles/comment.css";

function EditableComment({ comment }) {
    const [commentEdit, setCommentEdit] = useState(comment);
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const { editUserComment, deleteUserComment } = useUserData();
    const ref = useRef();

    function handleChange(event) {
        const value = event.target.value;
        setCommentEdit((prev) => ({ ...prev, comment: value }));
    }

    function enterEditState() {
        setIsBeingEdited(true);
    }

    function cancelEdit() {
        setIsBeingEdited(false);
        setCommentEdit(comment);
    }

    function acceptEdit() {
        setIsBeingEdited(false);
        editUserComment(commentEdit);
    }

    function deleteComment() {
        setIsBeingEdited(false);
        deleteUserComment(comment);
    }

    useEffect(() => {
        ref.current.style.height = "5px"
        ref.current.style.height = (ref.current.scrollHeight)+"px";
        ref.current.focus();
    }, [isBeingEdited]);

    return (
        <>
            <h2 id="current-user-h2">{comment.userName}</h2>
            <textarea
                className="comment-input"
                disabled={!isBeingEdited}
                value={commentEdit.comment}
                onChange={handleChange}
                ref={ref}
            />
            <div className="change-comment">
                {isBeingEdited ? (
                    <>
                        <button onClick={acceptEdit}>Accept</button>
                        <button onClick={cancelEdit}>Cancel</button>
                    </>
                ) : (
                    <>
                        <span onClick={enterEditState}>edit</span>
                        <span onClick={deleteComment}>delete</span>
                    </>
                )}
            </div>
        </>
    );
}

export default EditableComment;
