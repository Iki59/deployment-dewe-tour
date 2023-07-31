import React, {useState} from "react"
import {useMutation} from "react-query"
import { API } from '../../config/Api';    
import {Container, Form, Button, Modal, Alert} from "react-bootstrap"
import "../../App.css"

const style = {
    formBox: {
        height: "auto",
        padding: "30px",
        boxShadow: "4px 4px 20px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        overflow: "auto",
    },
    formLabel: {
        fontFamily: "product-sans",
        fontSize: "21px",
        fontWeight: "700",
    },
    fontRegister: {
        fontSize: "36px",
        fontWeight: "700",
        fontFamily: "product-sans",
        marginBottom: "60px",
        marginTop: "30px",
    },
    formRegister : {
        width: "350px",
        height: "45px",
        background: "rgba(210, 210, 210, 0.25)",
    },
    btnRegister : {
        borderRadius: "none",
        border: "none",
        background: "#FFAF00",
        width: "360px",
        margin: "5px auto"

    },
    linkTo: {
        fontSize: "18px",
        marginTop: "20px",
        color: "#B1B1B1"
    },
    formAdress: {
        width: "350px",
        height: "130px",
        resize: "none",
        background: "rgba(210, 210, 210, 0.25)",
    },
}

function ModalLogin(props) {
const [message, setMessage] = useState(null)
const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
    address: '',
})
const {full_name, email, password, gender, phone, address} = form

const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = useMutation(async (e) => {
    try {
        e.preventDefault()
        const response = await API.post('/register', form)

        console.log("register success :", response)

        const alert = (
            <Alert variant="success" className="py-1">
                Register Success!
            </Alert>
        )
        setMessage(alert)
        setForm({
            full_name: '',
            email: '',
            password: '',
            gender: '',
            phone: '',
            address: '',
        })
    } catch (error) {
        const alert = (
            <Alert variant="danger" className="py-1">
                Failed to Register!
            </Alert>
        )
        setMessage(alert)
        console.log("register failed : ", error)
    }
})
    return(
        <>
        <Modal show={props.show} onHide={props.onHide}>
        <Modal.Body className="formBox" style={style.formBox}>
        <Container fluid>
            <h3 className="text-center" style={style.fontRegister}>Register</h3>
            {message && message}
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Full Name</Form.Label>
                        <Form.Control type="text" value={full_name} name="full_name" onChange={handleChange} style={style.formRegister} />
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Email</Form.Label>
                        <Form.Control type="email" value={email} name="email" onChange={handleChange} style={style.formRegister} />
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Password</Form.Label>
                        <Form.Control type="password" value={password} name="password" onChange={handleChange} style={style.formRegister} />
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Phone</Form.Label>
                        <Form.Control type="text" value={phone} name="phone" onChange={handleChange} style={style.formRegister} />
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Gender</Form.Label>
                        <Form.Select type="text" value={gender} name="gender" onChange={handleChange} style={style.formRegister} >
                            <option hidden></option>
                            <option>Male</option>
                            <option>Female</option>
                        </Form.Select>
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Adress</Form.Label>
                        <Form.Control as="textarea" type="text" value={address} name="address" onChange={handleChange} style={style.formAdress} />
                    </Form.Group>
                    </div>
                <div className="d-grid gap-2">
                    <Button type="submit" onClick={props.onHide} size="lg" style={style.btnRegister}>Register</Button>
                </div>
                </Form>
                <p className="text-center" style={style.linkTo}>Already have an account? Klik <span onClick={props.onClick} style={{cursor: "pointer", fontWeight: "bold"}}>Here</span></p>
        </Container>
        </Modal.Body>
        </Modal>
        </>
    )
}

export default ModalLogin