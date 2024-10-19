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
            </div>
        </div>
    );
}
