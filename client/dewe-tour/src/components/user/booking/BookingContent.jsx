import React, {useEffect} from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query"
import { API } from "../../../config/Api"
import QRCode from "react-qr-code"
import {Container, Row, Col, Image, Button} from "react-bootstrap"
import Brand2 from "/assets/brand2.svg"


function BookingContent() {
    let param = useParams();
    let id = parseInt(param.id)

    let navigate = useNavigate()

    const formatIDR = (number) => {
        return "IDR. " + new Intl.NumberFormat("id-ID").format(number);
      }

    let {data: transaction} = useQuery("myTransactionCache", async () => {
        const response = await API.get(`/transaction/${id}`)
        return response.data.data
    })

    const handleBuy = useMutation (async () => {
        try {
            const response = await API.get(`getpayment/${id}`)
            console.log("ini payment", response)

            const token = response.data.data.token
            console.log("ini token", token)

            window.snap.pay(token, {
                onSuccess: function (result) {
                    console.log(result)
                    navigate(`/booking/${id}`)
                },
                onPending: function (result) {
                    console.log(result)
                    navigate(`/booking/${id}`)
                },
                onError: function (result) {
                    console.log(result)
                    navigate(`/booking/${id}`)
                },
                onClose: function () {
                    alert("Close the Pop Up")
                },
            })
        } catch (error) {
            console.log(error)
        }
    })

    useEffect (() => {
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
    
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        };
      }, []);
    return(
        <>
        <Container className="border mt-5 bg-white py-2 pb-0">
            <div className="d-flex justify-content-between mb-4 px-4">
                <div>
                    <Image src={Brand2} />
                </div>
                <div>
                    <p className="text-end mb-0" style={{fontSize: "30px", fontWeight: "700"}}>Booking</p>
                    <p style={{fontSize: "15px", fontWeight: "600", color: "#878787"}}>Saturday, <span style={{fontWeight: "300"}}>{transaction?.trip.date_trip}</span></p>
                </div>
            </div>
            <div className="px-4">
                <Row>
                    <Col md="4">
                     <h5 style={{fontWeight: "700"}}>{transaction?.trip.title}</h5>
                     <p style={{fontSize: "14px", color: "#959595", marginBottom: "30px"}}>{transaction?.trip.country.name}</p>
                     {transaction?.status === "Waiting Payment" && (
                     <p className="text-warning" style={{fontSize: "12px", fontWeight: "500"}}>{transaction?.status}</p>
                     )}
                     {transaction?.status === "Approved" && (
                     <p style={{fontSize: "12px", color: "#0BDC5F", fontWeight: "500"}}>{transaction?.status}</p>
                     )}
                    </Col>
                    <Col md="2">
                        <div className="mb-4">
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Date Trip</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{transaction?.trip.date_trip}</p>
                        </div>
                        <div>
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Accomodation</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{transaction?.trip.accomodation}</p>
                        </div>
                    </Col>
                    <Col md="2">
                        <div className="mb-4">
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Duration</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{transaction?.trip.day} Day {transaction?.trip.night} Night</p>
                        </div>
                        <div>
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Transportation</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{transaction?.trip.transportation}</p>
                        </div>
                    </Col>
                    <Col md="4">
                    {transaction?.status === "Approved" && (
                    <div className="d-flex justify-content-end">
                        <QRCode 
                            style={{width: "9rem", height: "9rem", marginRight: "2rem"}}
                            value={`Tittle: ${transaction?.trip.title}
                            \n Date: ${transaction?.trip.date_trip}
                            \n Duration: ${transaction?.trip.day} Day ${transaction?.trip.day} Night
                            \n Accomodation: ${transaction?.trip.accomodation}
                            \n Transportation: ${transaction?.trip.transportation}
                            \n Quantity: ${transaction?.quantity}
                            \n Price: ${formatIDR(transaction?.total)}`}
                            />
                        </div>
                    )}
                    </Col>
                </Row>
            </div>
            <div className="mt-5">
                <Row>
                    <Col md="2">
                        <p style={{fontSize: "16px", fontWeight: "700", marginLeft: "20px"}}>No</p>
                    </Col>
                    <Col md="2">
                        <p style={{fontSize: "16px", fontWeight: "700"}}>Full Name</p>
                    </Col>
                    <Col md="2">
                        <p style={{fontSize: "16px", fontWeight: "700"}}>Gender</p>
                    </Col>
                    <Col md="2">
                        <p style={{fontSize: "16px", fontWeight: "700"}}>Phone</p>
                    </Col>
                </Row>
            </div>
            <div>
                <Row className="border-top border-bottom pt-2 pb-0">
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1", marginLeft: "20px"}}>1</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{transaction?.user.full_name}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{transaction?.user.gender}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{transaction?.user.phone}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "500", textAlign: "center"}}>Qty</p>
                    </Col>
                    <Col md="1">
                        <p style={{fontSize: "16px", fontWeight: "500"}}>:</p>
                    </Col>
                    <Col md="1">
                            <p style={{fontSize: "16px", fontWeight: "500", marginLeft: "-60px"}}>{transaction?.quantity}</p>
                    </Col>
                </Row>
            </div>
            <div>
                <Row>
                    <Col md="8">
                    </Col>
                    <Col md="2">
                        <p style={{fontSize: "16px", fontWeight: "500", textAlign: "center"}}>Total</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "500"}}>:</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "500", color: "#F00", marginLeft: "-60px"}}>{formatIDR(transaction?.total)}</p>
                    </Col>
                </Row>
            </div>
        </Container>
        <div className="mt-3 text-end">
        {transaction?.status === "Waiting Payment" && (
            <Button onClick={() => handleBuy.mutate(id)} style={{fontSize: "18px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "6px 70px"}}>Pay</Button>
        )}
        {transaction?.status === "Approved" && (
            <Button onClick={() => navigate("/")} style={{fontSize: "18px", fontWeight: "700", background: "#FFF", color: "#000", border: "none", padding: "6px 30px"}}>Back to Home</Button>
        )}
        </div>
        </>
    )
}

export default BookingContent