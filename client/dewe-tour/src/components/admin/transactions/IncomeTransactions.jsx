import Navbar from "../../user/Header/Navbar"
import IncomeContent from "./IncomeContent"

function IncomingTransaction() {
    return(
        <>
        <Navbar />
        <div className="pt-4">
        <IncomeContent />
        </div>
        </>
    )
}

export default IncomingTransaction