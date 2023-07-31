import React, { useState } from "react";
import { API } from "../../config/Api";
import { useMutation } from "react-query";
import {Container, Image, Form, Modal, Button} from "react-bootstrap"

function ModalChangePhoto(props) {
    const [form, setForm] = useState({
        image: "",
    })
    const {image} = form
      
      const [preview, setPreview] = useState(null);
      const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
        });
    
        // Create image url for preview
        if (e.target.type === 'file') {
          let url = URL.createObjectURL(e.target.files[0]);
          setPreview(url);
        }
      };


      const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                  'Content-type': 'multipart/form-data',
                },
              };

            const formData = new FormData()
            formData.set("image", form.image[0], form.image[0].name)

            const response = await API.patch("/change-image", formData, config)
            console.log("change photo success : ", response)
                setForm({
                    image: "",
                })
            alert("Change Photo Success")
        } catch (error) {
            console.log("Change Photo failed : ", error)
        }
      })
    return(
        <div>
            <Modal show={props.show} onHide={props.onHide}>
            <Modal.Body>
            <Container fluid>
                <div className="d-flex justify-content-center mb-3">
                {preview && (<Image src={preview} style={{width: "70%", height: "50%"}} /> )}
                </div>
                <div style={{margin: "10px 1rem"}}>
                    <Form onSubmit={(e) => {handleSubmit.mutate(e)}}>
                        <Form.Control type="file" id="upload" name="image" required multiple onChange={handleChange} className="w-100" />
                <div className="d-flex justify-content-end gap-3 mt-3">
                    <Button onClick={props.onHide} style={{fontSize: "15px", fontWeight: "700", color: "grey", background: "#FFF", border: "none", padding: "6px 20px"}}>Cancel</Button>
                    <Button onClick={props.onHide} type="submit" style={{fontSize: "15px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "6px 20px"}}>Change</Button>
                </div>
                    </Form>
                </div>
            </Container>
            </Modal.Body>
            </Modal>
        </div>
    )
}

export default ModalChangePhoto