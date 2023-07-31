import React, {useEffect, useState, useContext} from "react"
import {useQuery, useMutation} from "react-query"
import {Link, useNavigate} from "react-router-dom"
import {UserContext} from "../../../context/UserContext"
import { API, setAuthToken } from "../../../config/Api"
import {Container, Row} from "react-bootstrap"
import Card from "./CardTour"

function CardGroup({country, search}) {
    const navigate = useNavigate()
    let {data: trips, refetch} = useQuery("tripsCache", async() => {
        const response = search? (await API.get(`trip?country=${country}`))
        : (await API.get("/trips"))
        console.log("ini coba trips", response)
        return response.data.data
    })

    useEffect(() => {
        refetch();
      }, [search]);

    const handleDetail = async (id) => {
        try {
            const response = await API.get(`/trip/${id}`)
                navigate(`/trip/${id}`)
                console.log("ini detail trip", response)
                return response.data.data
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>
        <Container>
            <h3 className="text-center mb-5">Group Tour</h3>
            <Row>
            {trips?.map((data, id) =>
                <Card key={id} data={data} onClick={handleDetail} />
                )}
            </Row>
        </Container>
        </>
    )
}

export default CardGroup