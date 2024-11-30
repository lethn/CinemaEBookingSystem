import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../contexts/user";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function LoginForm() {
    const { signIn, isLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem("rememberedEmail");
        const storedPassword = localStorage.getItem("rememberedPassword");
        if (storedEmail) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setRememberMe(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);

            // Store or remove email based on "Remember Me" option
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedPassword", password);
            } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
            }
        } catch (error) {
            alert('Email or Password is incorrect or user is unverified');
            console.error("Error signing in:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-800/60 p-8 shadow-lg w-96 rounded-lg">
            <h2 className="text-4xl font-semibold mb-6">Login</h2>
            <form className='flex flex-col p-2 m-2' onSubmit={handleSubmit}>
                <label className="font-medium text-white">
                    Username <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full p-3 mt-1 mb-4 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                    required
                />

                <label className="font-medium text-white">
                    Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-4 mt-1">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-3 pr-10 rounded-lg bg-neutral-700/50 text-white outline-1 outline-navBarRed focus:outline focus:bg-neutral-700 hover:bg-neutral-700"
                        required
                    />
                    <div
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                        {showPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                    />
                    <label className="text-white">Remember Me</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`p-3 rounded-lg transition duration-300 ease-in-out ${loading ? "bg-red-800" : "bg-navBarRed hover:bg-red-800"
                        } text-white`}
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>

            <p className="font-medium mt-4 text-center">
                <Link className="text-white hover:underline" href="/forgot-password">
                    Forgot Password?
                </Link>
            </p>

            <p className="font-medium text-center mt-2">
                <span className="text-stone-400">Not a user? </span>
                <Link className="text-white hover:underline" href="/register">
                    Sign Up Here
                </Link>
            </p>
        </div>
    );
}