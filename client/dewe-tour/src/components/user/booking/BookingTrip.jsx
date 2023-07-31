import Navbar from "../Header/Navbar"
import BookingContent from "./BookingContent"

function BookingTrip() {
    return(
    <>
        <Navbar />
        <div style={{padding: "10px 150px"}}>
        <BookingContent />
        </div>
    </>
    )
}

export default BookingTrip