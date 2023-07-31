import Navbar from "../../components/user/Header/Navbar"
import ProfileUser from "../../components/user/profile/ProfileUser"
import Footer from "../../components/Footer"

function Profile() {
    return(
    <>
        <Navbar />
        <div className="py-5">
        <ProfileUser />
        </div>
        <Footer />
    </>
    )
}

export default Profile