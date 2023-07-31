import React, { useState, useEffect, useContext } from "react";
import { API, setAuthToken } from "../../../config/Api";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../../../context/UserContext"
import {Form, InputGroup, Image, Button} from "react-bootstrap"
import Attach from "../../../../public/assets/attach.svg"

const style = {
    labelForm: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#000", 
        marginLeft: "5px" 
    },
    formTrip: {
        background: "rgba(196, 196, 196, 0.50)",
        border: "2px solid #B1B1B1"

    },
    formDesc: {
        background: "rgba(196, 196, 196, 0.50)",
        border: "2px solid #B1B1B1",
        resize: "none",
        height: "120px"

    },
}

function FormTrip() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        title: "",
        country_id: "",
        accomodation: "",
        transportation: "",
        day: "",
        night: "",
        date_trip: "",
        price: "",
        quota: "",
        description: "",
        image: "",
    })
    const {title, country_id, accomodation, transportation, day, night, date_trip, price, quota, description, image} = form

    let { data: countries} = useQuery("countriesCache", async () => {
        const response = await API.get("/countries");
        return response.data.data
      })
      
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

        //   if (e.target.type === 'file') {
        //     let url = URL.createObjectURL(e.target.files[0]);
        //     setPreview(url);
        //   }
        
        // if (e.target.type === 'file') {
        //   // Update form state with the selected file
        //   setForm({
        //     ...form,
        //     [e.target.name]: e.target.files[0],
        //   });
    
        //   // Create an object URL and set it to the form.image_url field (optional)
        //   let imageUrl = URL.createObjectURL(e.target.files[0]);
        //   setForm({
        //     ...form,
        //     image_url: imageUrl,
        //   });
        // } else {
        //   setForm({
        //     ...form,
        //     [e.target.name]: e.target.value,
        //   });
        // }


      const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            // const config = {
            //     headers: {
            //       'Content-type': 'multipart/form-data',
            //     },
            //   };

            const formData = new FormData()
            formData.set("title", form.title)
            formData.set("country_id", form.country_id)
            formData.set("accomodation", form.accomodation)
            formData.set("transportation", form.transportation)
            formData.set("day", form.day)
            formData.set("night", form.night)
            formData.set("date_trip", form.date_trip)
            formData.set("price", form.price)
            formData.set("quota", form.quota)
            formData.set("description", form.description)
            formData.set("image", form.image[0], form.image[0].name)

            const response = await API.post("/trip", formData)
            console.log("add ticket success : ", response)
                setForm({
                    title: "",
                    country_id: "",
                    accomodation: "",
                    transportation: "",
                    day: "",
                    night: "",
                    date_trip: "",
                    price: "",
                    quota: "",
                    description: "",
                    image: "",
                })
            alert("Add Ticket Success")
            navigate("/list-transaction")
        } catch (error) {
            console.log("add ticket failed : ", error)
        }
      })
    return(
        <>
        <Form onSubmit={(e) => {handleSubmit.mutate(e)}} className="mt-5">  
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Tittle Trip</Form.Label>
                <Form.Control type="text" name="title" value={title} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Country</Form.Label>
                <Form.Select name="country_id" value={country_id} onChange={handleChange} style={style.formTrip}>
                    <option hidden>Select Country</option>
                    {countries?.map((data) => (
                    <option key={data?.id} value={data?.id}>{data.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Accomodation</Form.Label>
                <Form.Control type="text" name="accomodation" value={accomodation} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Transportation</Form.Label>
                <Form.Control type="text" name="transportation" value={transportation} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Day</Form.Label>
                <Form.Control type="number" name="day" value={day} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Night</Form.Label>
                <Form.Control type="number" name="night" value={night} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Eat</Form.Label>
                <Form.Control disabled placeholder="Included as Itinerary" type="text" style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Date Trip</Form.Label>
                <Form.Control type="text" name="date_trip" value={date_trip} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Price</Form.Label>
                <Form.Control type="text" name="price" value={price} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Quota</Form.Label>
                <Form.Control type="number" name="quota" value={quota} onChange={handleChange} style={style.formTrip}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label style={style.labelForm}>Description</Form.Label>
                <Form.Control as="textarea" type="text" name="description" value={description} onChange={handleChange} style={style.formDesc}></Form.Control>
            </Form.Group>
            <InputGroup className="mb-4">
                <Form.Control type="file" id="upload" name="image" required multiple onChange={handleChange} style={style.formTrip}></Form.Control>
                <Image src={Attach} />
            </InputGroup>
        <div>
            <Button type="submit" style={{fontSize: "16px", fontWeight: "700", background: "#FFAF00", border: "none", padding: "5px 30px"}}>Add Trip</Button>
        </div>
        </Form>
        </>
    )
}

export default FormTrip