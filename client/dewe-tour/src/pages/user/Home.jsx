import React, {useState} from "react"
import {Container, Row, Col, Card, Image} from "react-bootstrap"
import Header from "../../components/user/Header/Header"
import Search from "../../components/user/Search"
import CardGroup from "../../components/user/card/CardGroup"
import Footer from "../../components/Footer"
import Beach from "../../../public/assets/image/beach.png"
import Guarantee from "../../../public/assets/guarantee.svg"
import Heart from "../../../public/assets/heart.svg"
import Agent from "../../../public/assets/agent.svg"
import Support from "../../../public/assets/support.svg"


function Home() {
    const [form, setForm] = useState({
        country: "",
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const [search, setSearch] = useState(false)

    const handleClick = (e) => {
        e.preventDefault()
        form.country == ""
        ? setSearch(false)
        : setSearch(true)
    }
    return(
        <div style={{backgroundImage: `url(${Beach})`, height:"85vh", backgroundRepeat: "no-repeat"}}>
        <Header />
        <Container className="mt-5 p-4">
            <h2 className="text-white mb-0" style={{fontFamily:"product-sans", fontSize:"54px", fontWeight:"500"}}>Explore</h2>
            <h2 className="text-white" style={{fontFamily:"product-sans", fontSize:"54px", fontWeight:"300"}}>your amazing city together</h2>
        </Container>
        <Search value={form.country} name={"country"} onChange={handleChange} onClick={handleClick} />
        <Container className="mt-5">
        <Row>
            <Col>
                <Card style={{width: "15rem", height: "20rem", padding: "20px", border: "none"}}>
                    <Image src={Guarantee} style={{width:"60px", margin:"25px auto"}} />
                    <p style={{fontSize:"22px", fontWeight:"600", textAlign: "center"}}>Best Price <br/>Guarantee </p>
                    <p style={{fontSize:"16px", color:"#878787", textAlign: "center", wordSpacing: "1px "}}>A small river named Duren flows by their place and supplies</p>
                </Card>
            </Col>
            <Col>
                <Card style={{width: "15rem", height: "20rem", padding: "20px", border: "none"}}>
                    <Image src={Heart} style={{width:"65px", margin:"25px auto"}} />
                    <p style={{fontSize:"22px", fontWeight:"600", textAlign: "center"}}>Travellers Love Us</p>
                    <p style={{fontSize:"16px", color:"#878787", textAlign: "center", wordSpacing: "1px "}}>A small river named Duren flows by their place and supplies</p>
                </Card>
            </Col>
            <Col>
                <Card style={{width: "15rem", height: "20rem", padding: "20px", border: "none"}}>
                    <Image src={Agent} style={{width:"65px", margin:"25px auto"}} />
                    <p style={{fontSize:"22px", fontWeight:"600", textAlign: "center"}}>Best Travel Agent</p>
                    <p style={{fontSize:"16px", color:"#878787", textAlign: "center", wordSpacing: "1px "}}>A small river named Duren flows by their place and supplies</p>
                </Card>
            </Col>
            <Col>
                <Card style={{width: "15rem", height: "20rem", padding: "20px", border: "none"}}>
                    <Image src={Support} style={{width:"65px", margin:"25px auto"}} />
                    <p style={{fontSize:"22px", fontWeight:"600", textAlign: "center"}}>Our Dedicated Support</p>
                    <p style={{fontSize:"16px", color:"#878787", textAlign: "center", wordSpacing: "1px "}}>A small river named Duren flows by their place and supplies</p>
                </Card>
            </Col>
        </Row>
        </Container>
        <div className="mt-5">
        <CardGroup country={form.country} search={search} />
        </div>
        <Footer />
        </div>
    )
}

export default Home