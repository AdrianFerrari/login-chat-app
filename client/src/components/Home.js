import {Outlet} from "react-router-dom"
import Comments from "./Comments"
import "../styles/home.css"

function Home() {
    return (
        <div className="home">
            <div className="home-body">
                <div className="outlet">
                    <Outlet />
                </div>
                <Comments />
            </div>
            <div className="footer">
                <p>Made by Adrian Ferrari. <a href="https://github.com/AdrianFerrari/login-chat-app">Github Source</a></p>
                <p>Email me at: <a href="mailto:sdadrian@gmail.com">sdadrian@gmail.com</a></p>
            </div>
        </div>
    )
}

export default Home