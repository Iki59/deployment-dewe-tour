import {Col, Card, Row} from "react-bootstrap"

function CardAdmin({data}) {
    const formatIDR = (number) => {
        return "IDR. " + new Intl.NumberFormat("id-ID").format(number);
      }
    return(
        <>
        <Col md="4" className="mb-5">
            <Card style={{width: "20rem", height: "20rem", padding: "9px"}}>
                <Card.Img src={data.image} />
                <p style={{fontSize:"20px", marginTop: "5px"}}>{data.title}</p>
                <Row>
                    <Col>
                    {data.income_trip === 0 ?(
                        <>
                        <p style={{fontSize: "16px", color: "#878787"}}>No Income Yet</p>
                        </>
                    ) : (
                        <>
                        <p style={{fontSize: "16px", color: "#FFAF00"}}>{formatIDR(data.income_trip)}</p>
                        </>
                    )}
                    </Col>
                    <Col>
                        <p style={{fontSize: "16px", color: "#878787", textAlign:"right"}}>{data.country.name}</p>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end" style={{position: "absolute", right: 0, top: 20}}>
                <div style={{background: "#FFF", width: "4rem", padding: "3px 4px", borderRadius: "7px"}}>
                    <p className="mb-0 ms-1">{data.quota} left</p>
                </div>
                </div>
            </Card>
        </Col>
        </>
    )
}

export default CardAdmin