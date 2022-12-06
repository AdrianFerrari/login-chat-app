import './styles/app.css';
import Login from "./components/Login"
import Home from "./components/Home"
import DashBoard from "./components/DashBoard"
import SignUp from "./components/SignUp" 
import { Routes, Route, Navigate } from "react-router-dom"
import { useUserData } from "./context/UserProvider";

function App() {
  const { isLogIn } = useUserData();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={isLogIn ? <Navigate to="dashboard" replace={true} /> : <Login />}/>
          <Route path="dashboard" element={isLogIn ?  <DashBoard/> : <Navigate to="/" replace={true} /> }/>
          <Route path="signup" element={isLogIn ? <Navigate to="dashboard" replace={true} /> : <SignUp />}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
