import MainLayout from "../layout/MainLayout"
import { useUserStore } from "@/store/user"
function HomeView(){
    const {user}= useUserStore()
    return(
        <MainLayout>
        
        <div className="p-10 w-full flex items-center justify-center">
            <div className="max-w-[400px] text-center">
                <h1 className="font-bold text-2xl text-gray-900 mb-4">WELCOME!</h1>
                <p className="font-bold text-3xl   text-purple-500">{user.username}</p>
            </div>
         
        </div>
        
        </MainLayout>
    )
}

export default HomeView