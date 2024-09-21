"use client"
import NavBar from "../components/navBar";
import LoginForm from "../components/loginForm";

export default function Login() {
    return (
        <div>
            <NavBar />
            <div className="inline-flex justify-center items-center w-full">
                <div className="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">User Login</h2>
                    <LoginForm redirectTo="/" role="user" />
                </div>

                <div className="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">Admin Login</h2>
                    <LoginForm redirectTo="/" role="admin" />
                </div>
            </div>
        </div>
    );
}
