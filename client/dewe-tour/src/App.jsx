import React, { useContext, useEffect, useState } from "react"
import { API, setAuthToken } from './config/Api'
import { UserContext } from './context/UserContext'
import {Routes, Route, useNavigate} from "react-router-dom"
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css'
import Home from "./pages/user/Home"
import Profile from "./pages/user/Profile"
import TourDetail from "./pages/user/TourDetail"
import Booking from "./pages/user/Booking"
import IncomingTransaction from "./pages/admin/IncomingTransaction"
import IncomeTrip from "./pages/admin/IncomeTrip"
import AddTrip from "./pages/admin/AddTrip"
import Payment from "./pages/user/Payment"
import { PrivateRouteAdmin } from './privateroute/PrivateRoute'
import { PrivateRoute } from './privateroute/PrivateRoute'

function App() {
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth")
      console.log("Check user success : ", response)
      let payload =response.data.data;
      payload.token = localStorage.token;

      dispatch({
        type : "USER_SUCCESS",
        payload,
      })
      setIsLoading(false)

    } catch (error) {
      console.log("Check user failed : ", error);
      dispatch({
        type: "AUTH_ERROR",
      })
      navigate("/")
      setIsLoading(false)
      }
    }
    
    useEffect(() =>{
      if (localStorage.token) {
        setAuthToken(localStorage.token);
        checkUser();
      } else {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      if (!isLoading && !state.isLogin) {
        navigate("/");
      }
    }, [isLoading]);

  return (
    <>
      {isLoading ? null : (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/trip/:id" element={<TourDetail/>} />
      <Route path="/booking/:id" element={<Booking/>} />
      <Route path="/payment" element={<Payment/>} />
    <Route element={<PrivateRouteAdmin />}>
      <Route path="/list-transaction" element={<IncomingTransaction/>} />
      <Route path="/income-trip" element={<IncomeTrip/>} />
      <Route path="/add-trip" element={<AddTrip/>} />
    </Route>
    </Routes>
       )} 
    </>
  )
}

export default App
