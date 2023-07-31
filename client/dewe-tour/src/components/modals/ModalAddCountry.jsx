import React, {useState} from "react"
import {useMutation} from "react-query"
import {API, setAuthToken} from "../../config/Api"
import {Container, Form, Button, Modal} from "react-bootstrap"

function ModalAddCountry({show, onHide}) {
    const [form, setForm] = useState({
        name: "",
    })
    const {name} = form

      
    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        })
      }


      const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
            const formData = new FormData()
            formData.set("name", form.name)

            const response = await API.post("/country", form)
            console.log("add country success : ", response)
            setForm({
                name: "",
            })
            alert("Add Country Success")
        } catch (error) {
            console.log("Add Country Failed : ", error)
        }
      })
    return(
        <>
        <Modal show={show} onHide={onHide}>
            <Modal.Body>
            <Container>
                <Form onSubmit={(e) => {handleSubmit.mutate(e)}}>
                    <Form.Group className="mb-2">
                        <Form.Control type="text" name="name" value={name} onChange={handleChange} placeholder="Change Country" />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                    <Button type="submit" onClick={onHide} style={{fontSize: "16px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "5px 15px"}}>Add Country</Button>
                    </div>
                </Form>
            </Container>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ModalAddCountry