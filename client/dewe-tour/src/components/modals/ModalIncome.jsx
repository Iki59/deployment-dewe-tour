import { useQuery } from "react-query";
import { API } from "../../config/Api";
import QRCode from "react-qr-code"
import {Container, Row, Col, Image, Modal} from "react-bootstrap"
import Brand2 from "/assets/brand2.svg"


function ModalIncome(props) {
    const formatIDR = (number) => {
        return "IDR. " + new Intl.NumberFormat("id-ID").format(number);
      }
    
    let { data: transaction } = useQuery(["transactionCache", props.id], async () => {
        const response = await API.get(`/transaction/${props?.id}`);
        console.log("ini modal detail", response)
        return response.data.data;
        })
    return(
        <>
        <Modal size="xl" show={props.show} onHide={props.onHide}>
        <Modal.Body>
        <Container>
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
                     <h5 style={{fontWeight: "700"}}>6{transaction?.trip.title}</h5>
                     <p style={{fontSize: "14px", color: "#959595", marginBottom: "30px"}}>{transaction?.trip.country.name}</p>
                     {transaction?.status === "Approved" && (
                     <p className="text-success" style={{fontSize: "12px", fontWeight: "500"}}>{transaction?.status}</p>
                     )}
                     {transaction?.status === "Waiting Payment" && (
                     <p style={{fontSize: "12px", color: "#EC7A7A", fontWeight: "500"}}>{transaction?.status}</p>
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
                        <p style={{fontSize: "16px", fontWeight: "500", color: "#F00", marginLeft: "-60px"}}>IDR. {transaction?.total}</p>
                    </Col>
                </Row>
            </div>
        </Container>
        </Modal.Body>
        </Modal>
        </>
    )
}

export default ModalIncome