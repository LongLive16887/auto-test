import { ReactNode } from "react"
import {NavLink } from "react-router-dom";
import { Baby, Bus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/user";
import { useNavigate } from "react-router-dom"
interface MainLayoutProps {
    children: ReactNode;
  }


function MainLayout({children}:MainLayoutProps){
    const {lougoutUser} =useUserStore()
    const navigate = useNavigate();
    function lougOut(){
        lougoutUser();
        navigate("/login")

    }
    return(
        <div className="flex flex-col justify-between min-h-dvh">
        <div className="w-full px-4 py-2 bg-gray-100 text-xs flex justify-between items-center">
            <p className="text-xs"> <Baby className="w-5 h-5" /></p>
            <NavLink to="/">APP NAV</NavLink> 
            <Button size="sm" onClick={lougOut}>Logout <LogOut /></Button>
        </div>
        <div className="w-full flex-1">
        {children}
        </div>
        <div className="w-full p-4 bg-gray-100">
            <div className="flex items-center text-xs gap-2">   <Bus className="w-5 h-5" /> Go home</div>
        </div>
        </div>
    )
}

export default MainLayout