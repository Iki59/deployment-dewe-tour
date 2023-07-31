import React, {useState, useContext, useEffect} from "react"
import {Link, useNavigate} from "react-router-dom"
import {UserContext} from "../../../context/UserContext"
import {useQuery} from "react-query"
import { API, setAuthToken } from "../../../config/Api";
import {Navbar, Container, Nav, Image, Button, Dropdown} from "react-bootstrap"
import ModalLogin from "../../modals/ModalLogin"
import ModalRegister from "../../modals/ModalRegister"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Beach from "/assets/image/beach.png"
import Brand from "/assets/brand.svg"
import Bill from "/assets/bill.svg"
import Journey from "/assets/journey.svg"
import Logout from "/assets/logout.svg"
import Profile from "/assets/image/profile.png"

const style = {
    Navbar: {
        height: "10vh",
        webkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)"
    },
    btnLogin: {
        padding: "2px 30px",
        background: "none",
        border: "1px solid white",
        marginRight: "10px"

    },
    btnRegister: {
        padding: "4px 25px",
        background: "#FFAF00",
        border: "none",

    }
}

function NavigationBar() {
    const [loginShow, setLoginShow] = useState(false)
    const [registerShow, setRegisterShow] = useState(false)

    const handleCloseLogin = () => setLoginShow(false)
    const handleShowLogin= () => {
        handleCloseRegister(false)
        setLoginShow(true)
    }

    const handleCloseRegister = () => setRegisterShow(false)
    const handleShowRegister= () => {
        handleCloseLogin(false)
        setRegisterShow(true)
    }

    const [state, dispatch] = useContext(UserContext)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);

    let { data: User } = useQuery("userCache", async () => {
        const response = await API.get(`/user`);
        console.log("ini profile",response.data.data);
        return response.data.data;
        });

    // useEffect(() => {
    //     if (!isLoading && state.isLogin === false) {
    //         navigate("/")
    //     }
    // }, [isLoading])

    // useEffect(() =>{
    //     if (localStorage.token) {
    //         setAuthToken(localStorage.token)
    //         checkUser();
    //     } else {
    //         setIsLoading(false)
    //     }
    // }, [])

    const checkUser = async () => {
        try {
          const response = await API.get("/check-auth");
          console.log("check user success : ", response);
          let payload = response.data.data;
          payload.token = localStorage.token;
          dispatch({
            type: "USER_SUCCESS",
            payload,
          });
          setIsLoading(false);
        } catch (error) {
          console.log("check user failed : ", error);
          dispatch({
            type: "AUTH_ERROR",
          });
          setIsLoading(false);
        }
      };

    const logout = () => {
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
    }
    return(
        <div style={{backgroundImage: `url(${Beach})`, height:"10vh"}}>
            <Navbar className="p-2" style={style.Navbar}>
                <Container>
                    <Navbar.Brand onClick={() => navigate("/")} style={{cursor: "pointer"}}> <Image src={Brand} /> </Navbar.Brand>
                    <Nav>
                    {state.isLogin === true ? (
                    state.user.role === 'admin' ? (
                        <>
                        <Dropdown>
                            <Dropdown.Toggle style={{background: "none", border: "none", boxShadow: "none"}}>
                                <Image src={Profile} className="border border-warning border-4 rounded-circle" style={{width:"3rem", height: "47px", cursor:"pointer"}} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-3">
                                <Dropdown.Item onClick={() => navigate("/income-trip")} className="fw-bold mb-1"> <Image src={Journey}/>Trip</Dropdown.Item>
                                <Dropdown.Divider className="border-3" />
                                <Dropdown.Item onClick={logout} className="fw-bold"> <Image src={Logout}/> Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>
                    ) : (
                        <>
                        <Dropdown>
                            <Dropdown.Toggle style={{background: "none", border: "none", boxShadow: "none"}}>
                                <Image src={User?.image} className="border border-warning border-4 rounded-circle " style={{width:"3rem", height: "47px", cursor:"pointer", border: "1px solid #FFAF00"}} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-3">
                                <Dropdown.Item onClick={() => navigate("/profile")} className="fw-bold mb-1"><FontAwesomeIcon icon={faUser} style={{color: "#ffaf00", marginRight:"7px", fontSize:"20px"}} />Profile</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate("/payment")} className="fw-bold mb-1"> <Image src={Bill}/> Pay</Dropdown.Item>
                                <Dropdown.Divider className="border-3" />
                                <Dropdown.Item onClick={logout} className="fw-bold"> <Image src={Logout}/> Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </>
                    )
                    ) : (
                        <>
                            <Button onClick={handleShowLogin} style={style.btnLogin}>Login</Button>
                            <Button onClick={handleShowRegister} style={style.btnRegister}>Register</Button>
                        </>
                    )
                    }
                    </Nav>
                </Container>
            </Navbar>
            <ModalLogin show={loginShow} onHide={handleCloseLogin} onClick={handleShowRegister} />
            <ModalRegister show={registerShow} onHide={handleCloseRegister} onClick={handleShowLogin}  />
        </div>
    )
}

export default NavigationBar