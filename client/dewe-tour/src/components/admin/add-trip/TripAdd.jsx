import {Container} from "react-bootstrap"
import Navbar from "../../user/Header/Navbar"
import FormTrip from "./FormTrip"

function TripAdd() {
    return(
        <>
        <Navbar />
        <div className="py-4">
        <Container className="mt-5">
            <h3 style={{fontWeight: "700"}}>Add Trip</h3>
            <FormTrip />
        </Container>
        </div>
        </>
    )
}

export default TripAdd