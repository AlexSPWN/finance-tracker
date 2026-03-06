import { NavLink } from "react-router";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import profilePicture from "../../assets/ProfilePic.png";

export const Header = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const { logout, state } = useAuthContext();
    
    const menuRef = useRef<HTMLDivElement>(null);
        
    const handleLogout = () => {
        setShowDialog(true);
    }

    const confirmLogout = () => {
        logout();
        setShowDialog(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
        {showDialog && (
            <Modal onClose={() => setShowDialog(false)}>
                <ConfirmDialog 
                    title="Logout"
                    message="Are you sure?"
                    confirmButtonName="Logout"
                    onConfirm={confirmLogout}
                    onCancel={()=> setShowDialog(false)}
                />
            </Modal>
        )}
        <div className="flex justify-between items-center p-3">
            <div className="flex items-baseline">
            <div id="appLogo" className="text-blue-500">
                <NavLink to="/">
                    <h2>FinTrack</h2>
                </NavLink>
            </div>
                
            {state.isAuthenticated &&
            <div id="navLinks" className="">
                <nav>
                    <ul className="flex px-10">
                        <li>
                            <NavLink to="/dashboard"
                            end
                            /* className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 hover:text-gray-50 hover:bg-stone-600 hover:rounded-xl ${
              isActive
                ? "text-gray-50 bg-[#809bce] rounded-xl px-2 py-1 "
                : "text-stone-900"
            }`} */
                            className={({ isActive }) =>
                             isActive ? "text-[#809bce]" : ""}
                            >
                                Dashboard
                            </NavLink>
                            
                        </li>
                        {state.role === "admin" &&
                        <li className="px-2">
                            <NavLink to="/dashboard/admin"
                            className={({ isActive }) =>
                             isActive ? "text-[#809bce]" : ""}
                            >
                                Admin
                            </NavLink>
                        </li>
                        }
                        {(state.role === "admin" || state.role === "manager") && 
                        <li>
                            <NavLink to="/dashboard/manager"
                            className={({ isActive }) =>
                             isActive ? "text-[#809bce]" : ""}
                            >
                                Manager
                            </NavLink>
                        </li>
                        }
                    </ul>
                </nav>
            </div>      
            }        
            </div>
            <div id="userProfile" className="flex relative" ref={menuRef}>
                {state.isAuthenticated && 
                    <div 
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => setShowProfileMenu(prev => !prev)}
                    >
                        <img src={profilePicture} alt="Profile picture" className="w-10 h-10"/>
                        {state.userEmail} 
                    </div>
                }
                {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-stone-100 rounded shadow-xl p-4 w-40 z-50">
                        <ul className="flex flex-col space-y-2">
                            <li>
                                <NavLink 
                                    to="/dashboard/profile" 
                                    onClick={() => setShowProfileMenu(false)}
                                    className="block w-full text-left hover:bg-[#95b8d1] px-3 py-1 rounded"
                                >
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left hover:bg-[#95b8d1] px-3 py-1 rounded"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                {!state.isAuthenticated && 
                    <ul className="flex">
                        <li className="px-2">
                            <NavLink to="/login"
                                className="border-2 font-semibold border-[#809bce] text-[#809bce] rounded-lg p-2"
                            >
                                Log in
                            </NavLink>
                        </li>
                        <li className="px-2">
                            <NavLink to="/signup"
                                className="border-2 border-[#809bce] text-gray-50 font-semibold bg-[#809bce] rounded-lg p-2"
                            >
                                Sign up
                            </NavLink>
                        </li>
                    </ul>
                }
                {/* <ul className="flex">
                    {state.isAuthenticated ?
                        <>
                            <li className="px-2">
                                <NavLink to="/dashboard/profile">
                                    Profile
                                </NavLink>
                            </li>
                            <li className="px-2">
                                <button type="button" onClick={handleLogout} >Logout</button>
                            </li>
                        </>
                        : <>
                            <li className="px-2">
                                <NavLink to="/login">
                                    Log in
                                </NavLink>
                            </li>
                            <li className="px-2">
                                <NavLink to="/signup">
                                    Sign up
                                </NavLink>
                            </li>
                        </>
                    }
                </ul> */}
            </div>
        </div>
        </>
        );
}