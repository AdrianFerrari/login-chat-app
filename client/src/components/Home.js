import {Outlet} from "react-router-dom"
import Comments from "./Comments"
import "../styles/home.css"

function Home() {
    return (
        <div className="home">
            <div className="outlet">
                <Outlet />
            </div>
            <Comments />
        </div>
    )
}

export default Home