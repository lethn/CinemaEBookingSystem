"use client"
import NavBar from "../components/navBar";
import LoginForm from "../components/loginForm";

export default function Login() {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-col p-24 mx-auto items-center">
                    <LoginForm />
                </div>

                {/* <div className="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">User Login</h2>
                    <LoginForm redirectTo="/" role="user" />
                </div>

                <div className="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">Admin Login</h2>
                    <LoginForm redirectTo="/" role="admin" />
                </div> */}
            </div>
        </div>
    );
}
