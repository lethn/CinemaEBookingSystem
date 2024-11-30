"use client"
import NavBar from "../components/navBar";
import LoginForm from "../components/loginForm";

export default function Login() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex flex-col flex-grow justify-center items-center">
                <LoginForm />
            </div>
        </div>
    );
}
