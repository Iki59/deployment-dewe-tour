import {useContext, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useMutation} from "react-query"
import {UserContext} from "../../context/UserContext"
import {API, setAuthToken} from "../../config/Api"
import {Container, Form, Button, Modal, Alert} from "react-bootstrap"
import "../../App.css"

const style = {
    formBox: {
        height: "auto",
        padding: "30px",
        boxShadow: "4px 4px 20px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "5px",
        
    },
    formLabel: {
        fontFamily: "product-sans",
        fontSize: "21px",
        fontWeight: "700",
    },
    fontLogin: {
        fontSize: "36px",
        fontWeight: "700",
        fontFamily: "product-sans",
        marginBottom: "60px",
        marginTop: "30px",
    },
    formLogin : {
        width: "350px",
        height: "45px",
        background: "rgba(210, 210, 210, 0.25)",
    },
    btnLogin : {
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
}

function ModalLogin(props) {
const navigate = useNavigate()
const [,dispatch] = useContext(UserContext)
const [message, setMessage] = useState(null);

const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
})

const {email, password} = formLogin

const handleChange = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
        e.preventDefault()

        const response = await API.post('/login', formLogin)
        console.log("login success : ", response)

        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data.data,
        })
        setAuthToken(response.data.data.token)
        if (response.data.data.role === "admin") {
            navigate("/list-transaction")
            alert("Admin Success Login")
        } else {
            navigate("/")
            alert("User Success Login")
        }
    } catch (error) {
        const alert = (
            <Alert variant="danger" className="py-1">
                Login Failed
            </Alert>
        )
        setMessage(alert)
        console.log("login failed : ", error)
    }
  })
    return(
        <>
        <Modal show={props.show} onHide={props.onHide}>
        <Modal.Body className="formBox" style={style.formBox}>
        <Container fluid>
            <h3 className="text-center" style={style.fontLogin}>Login</h3>
                {message && message}
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Email</Form.Label>
                        <Form.Control type="text" value={email} name="email" onChange={handleChange} style={style.formLogin} />
                    </Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                    <Form.Group>
                        <Form.Label style={style.formLabel}>Password</Form.Label>
                        <Form.Control type="password" value={password} name="password" onChange={handleChange} style={style.formLogin} />
                    </Form.Group>
                    </div>
                <div className="d-grid gap-2">
                    <Button type="submit" onClick={props.onHide} size="lg" style={style.btnLogin}>Login</Button>
                </div>
                </Form>
                <p className="text-center" style={style.linkTo}>Don't have an account? Klik <span onClick={props.onClick} style={{cursor: "pointer", fontWeight: "bold"}}>Here</span></p>
        </Container>
        </Modal.Body>
        </Modal>
        </>
    )
}

export default ModalLogin