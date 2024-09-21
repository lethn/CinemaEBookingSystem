"use client"
import NavBar from "../components/navBar";
import LoginForm from "../components/loginForm";

export default function Login() {
    return (
        <div>
            <NavBar/>
            <div class="inline-flex justify-center items-center w-full">
                <div class="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">User Login</h2>
                    <LoginForm redirectTo="/"/>
                </div>
                <div class="mr-4 p-40">
                    <h2 className="text-2xl font-semibold mb-2">Admin Login</h2>
                    <LoginForm redirectTo="/admin"/>
                </div>
            </div>
        </div>
    );
}