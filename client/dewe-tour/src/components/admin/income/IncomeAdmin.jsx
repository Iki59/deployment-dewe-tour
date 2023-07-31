import React, {useState} from "react"
import {useQuery} from "react-query"
import {useNavigate} from "react-router-dom"
import { API } from "../../../config/Api"
import {Container, Row, Button} from "react-bootstrap"
import Navbar from "../../user/Header/Navbar"
import CardAdmin from "./CardAdmin"
import ModalAddCountry from "../../modals/ModalAddCountry"

function IncomeAdmin() {
    const [addCountry, setAddCountry] = useState(false)

    const handleCloseAdd = () => setAddCountry(false)
    const handleShowAdd= () => setAddCountry(true)
    const navigate = useNavigate()
    let {data: trips} = useQuery("tripsAdminCache", async() => {
        const response = await API.get("/trips")
        console.log("ini coba trips", response)
        return response.data.data
    })
    return(
        <>
        <Navbar />
        <Container className="mt-5 mb-5 d-flex justify-content-between">
            <h3 className="fw-bold">Income Trip</h3>
            <div>
            <Button onClick={handleShowAdd} style={{fontSize: "16px", fontWeight: "700", background: "#FFF", color: "#FFAF00", border: "none", padding: "5px 20px", marginRight: "15px"}}>Add Country</Button>
            <Button onClick={() => navigate("/add-trip")} style={{fontSize: "16px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "5px 30px"}}>Add Trip</Button>
            </div>
        </Container>
        <Container>
            <Row>
            {trips?.map((data, id) =>
                <CardAdmin key={id} data={data} />
                )}
            </Row>
        </Container>
                <ModalAddCountry show={addCountry} onHide={handleCloseAdd} />
        </>
    )
}

export default IncomeAdmin