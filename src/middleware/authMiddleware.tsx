import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user";
const AuthMiddleware = () => {
 const {token} = useUserStore()
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthMiddleware;
