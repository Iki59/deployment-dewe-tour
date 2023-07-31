import React, {useState} from "react"
import {useQuery} from "react-query"
import { API} from "../../../config/Api"
import QRCode from "react-qr-code"
import {Container, Row, Col, Image, Button} from "react-bootstrap"
import ModalChangePhoto from "../../modals/ModalChangePhoto"
import Name from "/assets/name.svg"
import Email from "/assets/email.svg"
import Phone from "/assets/phone.svg"
import Place from "/assets/place.svg"
import Brand2 from "/assets/brand2.svg"
function ProfileUser() {
    const [modalProfile, setModalProfile] = useState(false)

    const handleCloseChange = () => setModalProfile(false)
    const handleShowChange= () => setModalProfile(true)

    const formatIDR = (number) => {
        return "IDR. " + new Intl.NumberFormat("id-ID").format(number);
      }

    let { data: User } = useQuery("userCache", async () => {
        const response = await API.get(`/user`);
        console.log("ini profile",response.data.data);
        return response.data.data;
        });

        let {data: historyTransaction} = useQuery("historyCache", async () => {
            const response = await API.get("/my-transaction")
            return response.data.data
        })
        console.log(historyTransaction)

        const approvedHistoryTransactions = historyTransaction?.filter(
            (data) => data.status === "Approved"
          );
    
    return(
        <>
            <Container className="mt-5 bg-white" style={{width: "785px", padding: "25px", borderRadius: "10px"}}>
                <Row>
                    <Col>
                     <h3 style={{fontWeight: "800"}}>Personal Info</h3>
                     <div>
                     <Row className="mt-4">
                            <Col md="2" className="mt-3 ps-4">
                                <Image src={Name} style={{width: "30px", marginBottom: "40px"}} />
                                <Image src={Email} style={{width: "30px", marginBottom: "40px"}} />
                                <Image src={Phone} style={{width: "30px", marginBottom: "40px"}} />
                                <Image src={Place} style={{width: "30px", marginBottom: "40px"}} />
                            </Col>
                            <Col className="mt-3">
                                <div>
                                    <p style={{fontSize: "14px", fontWeight: "800", marginBottom: "0px"}}>{User?.full_name}</p>
                                    <p style={{fontSize: "12px", color: "#8A8C90", marginBottom: "30px"}}>Full Name</p>
                                </div>
                                <div>
                                    <p style={{fontSize: "14px", fontWeight: "800", marginBottom: "0px"}}>{User?.email}</p>
                                    <p style={{fontSize: "12px", color: "#8A8C90", marginBottom: "30px"}}>Email</p>
                                </div>
                                <div>
                                    <p style={{fontSize: "14px", fontWeight: "800", marginBottom: "0px"}}>{User?.phone}</p>
                                    <p style={{fontSize: "12px", color: "#8A8C90", marginBottom: "30px"}}>Mobile Phone</p>
                                </div>
                                <div>
                                    <p style={{fontSize: "14px", fontWeight: "800", marginBottom: "0px"}}>{User?.address}</p>
                                    <p style={{fontSize: "12px", color: "#8A8C90"}}>Address</p>
                                </div>
                            </Col>
                        </Row>
                     </div>
                    </Col>
                    <Col>
                    <div className="d-flex justify-content-end mb-3">
                    <Image src={User?.image} style={{width: "70%", height: "50%"}} />
                    </div>
                    <div className="d-flex justify-content-end">
                    <Button onClick={handleShowChange} style={{fontSize: "18px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "8px 30px"}}>Change Photo Profile</Button>
                    </div>
                    </Col>
                </Row>  
            </Container>
            <div>
                
            </div>
            <h4 className="fw-bold" style={{marginLeft: "7rem", marginTop: "6rem"}}>History Trip</h4>
            {approvedHistoryTransactions?.map((data, id) => 
            <Container className="border mt-5 bg-white py-2 pb-0" key={id}>
            <div className="d-flex justify-content-between mb-4 px-4">
                <div>
                    <Image src={Brand2} />
                </div>
                <div>
                    <p className="text-end mb-0" style={{fontSize: "30px", fontWeight: "700"}}>Booking</p>
                    <p style={{fontSize: "15px", fontWeight: "600", color: "#878787"}}>Saturday, <span style={{fontWeight: "300"}}>{data.trip.date_trip}</span></p>
                </div>
            </div>
            <div className="px-4">
                <Row>
                    <Col md="4">
                     <h5 style={{fontWeight: "700"}}>{data.trip.title}</h5>
                     <p style={{fontSize: "14px", color: "#959595", marginBottom: "30px"}}>{data.trip.country.name}</p>
                     <p style={{fontSize: "12px", color: "#0BDC5F", fontWeight: "500"}}>{data.status}</p>
                    </Col>
                    <Col md="2">
                        <div className="mb-4">
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Date Trip</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{data.trip.date_trip}</p>
                        </div>
                        <div>
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Accomodation</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{data.trip.accomodation}</p>
                        </div>
                    </Col>
                    <Col md="2">
                        <div className="mb-4">
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Duration</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{data.trip.day} Day {data.trip.night} Night</p>
                        </div>
                        <div>
                            <p style={{fontSize: "16px", fontWeight: "700", marginBottom: "0px"}}>Transportation</p>
                            <p style={{fontSize: "12px", color: "#959595"}}>{data.trip.transportation}</p>
                        </div>
                    </Col>
                    <Col md="4">
                        <div className="d-flex justify-content-end">
                            <QRCode 
                            style={{width: "9rem", height: "9rem", marginRight: "2rem"}}
                            value={`Tittle: ${data.trip.title}
                            \n Date: ${data.trip.date_trip}
                            \n Duration: ${data.trip.day} Day ${data.trip.day} Night
                            \n Accomodation: ${data.trip.accomodation}
                            \n Transportation: ${data.trip.transportation}
                            \n Quantity: ${data.quantity}
                            \n Price: ${formatIDR(data.total)}`}
                            />
                        </div>
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
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{data.user.full_name}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{data.user.gender}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "400", color: "#B1B1B1"}}>{data.user.phone}</p>
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", fontWeight: "500", textAlign: "center"}}>Qty</p>
                    </Col>
                    <Col md="1">
                        <p style={{fontSize: "16px", fontWeight: "500"}}>:</p>
                    </Col>
                    <Col md="1">
                            <p style={{fontSize: "16px", fontWeight: "500", marginLeft: "-60px"}}>{data.quantity}</p>
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
                        <p style={{fontSize: "16px", fontWeight: "500", color: "#F00", marginLeft: "-60px"}}>{formatIDR(data.total)}</p>
                    </Col>
                </Row>
            </div>
            </Container>
            )}
            <ModalChangePhoto show={modalProfile} onHide={handleCloseChange} />
        </>
    )
}

export default ProfileUser