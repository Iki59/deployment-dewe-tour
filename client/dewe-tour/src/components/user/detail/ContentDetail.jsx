import React, {useEffect, useState, useContext} from "react"
import { useQuery, useMutation } from "react-query"
import { API, setAuthToken } from "../../../config/Api"
import {Link, useParams, useNavigate} from "react-router-dom"
import {UserContext} from "../../../context/UserContext"
import {Container, Image, Row, Col, Button} from "react-bootstrap"
import ModalLogin from "../../modals/ModalLogin"
import Labuan from "/assets/image/labuan-bajo-2.jpeg"
import Labuan2 from "/assets/image/labuan-bajo-3.png"
import Labuan3 from "/assets/image/labuan-bajo-4.jpg"
import Hotel from "/assets/hotel.svg"
import Plane from "/assets/plane.svg"
import Meal from "/assets/meal.svg"
import Time from "/assets/time.svg"
import Calendar from "/assets/calendar.svg"

const style = {
    fontCountry: {
        fontSize: "24px",
        color: "#A8A8A8",
    }
}

function ContentDetail() {
    const formatIDR = (number) => {
        return "IDR. " + new Intl.NumberFormat("id-ID").format(number);
      };
    const [loginShow, setLoginShow] = useState(false)

    const handleCloseLogin = () => setLoginShow(false)
    const handleShowLogin= () => setLoginShow(true)

    const [state] = useContext(UserContext)

    setAuthToken(localStorage.token);

    let param = useParams();
    let id = parseInt(param.id)
    let {data: detailTrip} = useQuery("detailTripCache", async () => {
        const response = await API.get(`/trip/${id}`)
        return response.data.data
    })
    
    const [count, setCount] = useState(1);
        const handleIncrement = () => {
            setCount(count + 1)
        }
        const handleDecrement = () => {
            setCount(count - 1)
        }
    const tripId = detailTrip?.id
    const totalPrice = detailTrip?.price * count
    const navigate = useNavigate()

    const handleBuy = useMutation(async (e) => {
      try{
          e.preventDefault()

          let form = new FormData()
          form.set("trip_id", tripId)
          form.set("quantity", count)
          form.set("total", totalPrice)
          const response = await API.post("/transaction", form)
          navigate(`/booking/${response.data.data.id}`)
          console.log("Transaction Success: ", response)
          return response.data.data
      } catch (error) {
          console.log("Transaction error: ", error)
      }
    })
    
    return(
        <>
            <Container style={{padding:"10px 60px"}}>
                <h1 style={{fontWeight: "900", marginBottom: "5px"}}>{detailTrip?.title}</h1>
                <p style={style.fontCountry}>{detailTrip?.country.name}</p>
                <div>
                    <Image src={detailTrip?.image} style={{width: "100%", height: "500px"}} />
                    <Row className="mt-3 mb-5">
                        <Col>
                            <Image src={Labuan} style={{width: "100%", height: "100%"}} />
                        </Col>
                        <Col>
                            <Image src={Labuan2} style={{width: "100%", height: "100%"}} />
                        </Col>
                        <Col>
                            <Image src={Labuan3} style={{width: "100%", height: "100%"}} />
                        </Col>
                    </Row>
                </div>
                <p style={{fontSize: "18px", fontWeight: "700"}}>Information Trip</p>
                <Row>
                    <Col>
                        <p style={{fontSize: "13px", color: "#A8A8A8", marginBottom: "7px"}}>Accomodation</p>
                        <Row>
                            <Col md="2">
                                <Image src={Hotel}/>
                            </Col>
                            <Col md="10">
                                <p style={{fontSize: "18px", fontWeight: "500"}}>{detailTrip?.accomodation}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <p style={{fontSize: "13px", color: "#A8A8A8", marginBottom: "7px"}}>Transportation</p>
                        <Row>
                            <Col md="2">
                                <Image src={Plane}/>
                            </Col>
                            <Col md="10">
                                <p style={{fontSize: "18px", fontWeight: "500"}}>{detailTrip?.transportation}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="3">
                        <p style={{fontSize: "13px", color: "#A8A8A8", marginBottom: "7px"}}>Eat</p>
                        <Row>
                            <Col md="2" style={{marginRight: "-9px"}}>
                                <Image src={Meal}/>
                            </Col>
                            <Col md="10">
                                <p style={{fontSize: "18px", fontWeight: "500"}}>{detailTrip?.eat}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <p style={{fontSize: "13px", color: "#A8A8A8", marginBottom: "7px"}}>Duration</p>
                        <Row>
                            <Col md="2">
                                <Image src={Time}/>
                            </Col>
                            <Col md="10">
                                <p style={{fontSize: "18px", fontWeight: "500"}}>{detailTrip?.day} Day {detailTrip?.night} Night</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <p style={{fontSize: "13px", color: "#A8A8A8", marginBottom: "7px"}}>Date Trip</p>
                        <Row>
                            <Col md="2">
                                <Image src={Calendar}/>
                            </Col>
                            <Col md="10">
                                <p style={{fontSize: "18px", fontWeight: "500"}}>{detailTrip?.date_trip}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="mt-4 mb-4">
                    <p className="mb-2" style={{fontSize: "18px", fontWeight: "700"}}>Description</p>
                    <p style={{fontSize: "14px", color: "#A8A8A8", textAlign: "justify"}}>
                    {detailTrip?.description}
                    </p>
                </div>
                <div className="mb-4 d-flex justify-content-between">
                    <p style={{fontSize: "24px", fontWeight: "700", color: "#FFAF00"}}> {formatIDR(detailTrip?.price)} <span className="text-black">/ Person</span></p>
                <div>
                    {count <= 1 ? (
                        <Button disabled style={{background: "#FFAF00", border: "none", padding: "3px 13px"}} onClick={handleDecrement}>-</Button>
                    ) : (
                    <Button style={{background: "#FFAF00", border: "none", padding: "3px 13px"}} onClick={handleDecrement}>-</Button>
                    )}
                    <span className="px-4">{count}</span>
                    {detailTrip?.quota <= count ? (
                        <Button disabled style={{background: "#FFAF00", border: "none", padding: "3px 13px"}} onClick={handleIncrement}>+</Button>
                    ) : (
                        <Button style={{background: "#FFAF00", border: "none", padding: "3px 13px"}} onClick={handleIncrement}>+</Button>
                    )}
                </div>
                </div>
                <div className="d-flex justify-content-between p-3 pb-0 " style={{borderTop: "2px solid #A8A8A8", borderBottom: "2px solid #A8A8A8"}}>
                    <p style={{fontSize: "22px", fontWeight: "700"}}>Total :</p>
                    <p style={{fontSize: "24px", fontWeight: "700", color: "#FFAF00"}}> {formatIDR(detailTrip?.price * count )}</p>
                </div>
                <div className="text-end mt-4">
                    <Button onClick={state.isLogin === true? ((e) => {handleBuy.mutate(e)}) : (() => setLoginShow(true))} style={{fontSize: "18px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "8px 40px"}}>Book Now</Button>
                </div>
            </Container>
            <ModalLogin show={loginShow} onHide={handleCloseLogin} onClick={handleShowLogin}  />
        </>
    )
}

export default ContentDetail