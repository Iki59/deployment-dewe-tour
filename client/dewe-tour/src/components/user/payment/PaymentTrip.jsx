import Navbar from "../Header/Navbar"
import PaymentContent from "./PaymentContent"

function PaymentTrip() {
    return(
    <>
        <Navbar />
        <div style={{padding: "10px 150px"}}>
        <PaymentContent />
        </div>
    </>
    )
}

export default PaymentTrip