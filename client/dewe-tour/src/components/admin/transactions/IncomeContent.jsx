import React, {useState} from "react"
import {useQuery} from "react-query"
import { API } from "../../../config/Api"
import {Container, Table} from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import ModalIncome from "../../modals/ModalIncome"

function IncomingContent() {
    const [modalShow, setModalShow] = useState(false)

    const handleCloseModal = () => setModalShow(false)
    const handleShowModal= () => setModalShow(true)
    const [transactionID, setTransactionID] = useState();

    let { data: transactions } = useQuery(
        "transactionCache",
        async () => {
          const response = await API.get("/transactions");
          return response.data.data;
        }   
        )
    return(
        <>
        <Container className="mt-5">
            <h3 className="fw-bold mb-4">Incoming Transaction</h3>
            <div>
                <Table striped variant="datk">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Users</th>
                            <th>Trip</th>
                            <th>Bukti Transfer</th>
                            <th>Status Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {transactions?.map((data, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.user.full_name}</td>
                            <td>{data.trip.title}</td>
                            <td>bca.jpg</td>
                            {data.status === "Waiting Payment" && (
                            <td className="text-warning">{data.status}</td>
                            )}
                            {data.status === "Approved" && (
                            <td className="text-success">{data.status}</td>
                            )}
                            <td><FontAwesomeIcon onClick={() => {handleShowModal(); setTransactionID(data?.id)}} icon={faMagnifyingGlass} style={{color: "#2fc5f7", fontSize: "25px", cursor: "pointer"}} /></td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        </Container>
        <ModalIncome id={transactionID} show={modalShow} onHide={handleCloseModal} />
        </>
    )
}

export default IncomingContent