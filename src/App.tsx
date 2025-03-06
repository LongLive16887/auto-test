import { BrowserRouter, Routes, Route,  } from "react-router-dom"; 
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import { Toaster } from "@/components/ui/sonner"
import AuthMiddleware from "./middleware/authMiddleware";
function App() { 

  return (
    <BrowserRouter>
      <Routes>  
          <Route path="/login" element={<LoginView />} /> 
          <Route element={<AuthMiddleware />}>
            <Route path="/" element={<HomeView />} />
          </Route>
      </Routes> 
      <Toaster />
    </BrowserRouter>
  )
}

export default App
