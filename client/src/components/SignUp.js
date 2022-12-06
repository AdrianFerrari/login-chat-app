import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login_sigin.css";
import { useUserData } from "../context/UserProvider";

function SignUp() {
    const userRef = useRef();
    const navigate = useNavigate();
    const { signupUser, setIsLogIn } = useUserData();
    const [errMsg, setErrMsg] = useState("");
    const [user, setUser] = useState({
        userName: "",
        userPassword: "",
    });

    useEffect(() => {
        userRef.current.focus();
    }, []);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setUser((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await signupUser(user);
            setIsLogIn(true)
            navigate("/dashboard");
        } catch (error) {
            setErrMsg(error.message);
        }
    }

    return (
        <>
            <section className="login">
                <p className={errMsg ? "errMsg" : "offscreen"}>{errMsg}</p>
                <h1>Sign Up</h1>
                <form className="user-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        UserName:
                        <input
                            ref={userRef}
                            type="text"
                            id="username"
                            name="userName"
                            value={user.userName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="password">
                        Password:
                        <input
                            type="password"
                            id="password"
                            name="userPassword"
                            value={user.userPassword}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button>Sign Up</button>
                </form>
            </section>
        </>
    );
}

export default SignUp;