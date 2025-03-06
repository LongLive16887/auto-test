import LoginForm from "@/components/forms/LoginForm"
function LoginView(){
    return(
        <div className="w-full min-h-dvh p-4 flex items-center justify-center">
            <div className="max-w-[400px] w-full border rounded-2xl p-4">
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Login</h1>
            <LoginForm  />
            </div>
         
        </div>
    )
}

export default LoginView