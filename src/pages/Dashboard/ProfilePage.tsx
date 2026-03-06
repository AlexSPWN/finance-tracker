import { useAuthContext } from "../../hooks/useAuthContext";
import profilePicture from "../../assets/ProfilePic.png";

export const ProfilePage = () => {
    const {state} = useAuthContext();
    return (<div className="flex flex-col items-start">
        <h2>User Profile</h2>
        <div className="flex flex-col items-start p-5 mt-5 rounded-2xl bg-blue-100">
            <img src={profilePicture} alt="Profile picture" className="w-40 h-40 m-10"/>

            <div><b>Email: </b>{state.userEmail}</div>
            <div><b>Role: </b>{state.role}</div>
        </div>
    </div>);
}