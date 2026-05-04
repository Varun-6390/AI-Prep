import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loading, handleRegister} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({
            username, email, password
        })
        navigate("/")
    }

    if(loading)
    {
        return (<main><h1>Loading....</h1></main>)
    }

    return (
        <div className="flex min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/20">
            {/* Left side: Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden items-center justify-center border-r border-gray-200">
                {/* Background Decorative Circles */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-10"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-15"></div>

                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center h-full">
                    <div className="mb-8 p-4 bg-white/50 rounded-2xl backdrop-blur-md border border-gray-100 shadow-sm">
                        {/* Logo vector */}
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-primary mb-2">
                            <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold font-display mb-4 tracking-tight text-on-surface">Join Us Today</h1>
                    <p className="text-gray-600 text-lg max-w-md leading-relaxed font-sans">
                        Create an account to start building your professional resume.
                        Access beautiful templates and kickstart your career.
                    </p>
                </div>
            </div>

            {/* Right side: Register Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 bg-surface relative">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo for mobile */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden text-primary">
                        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                            <User className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold font-display text-on-surface">Resume Builder</span>
                    </div>

                    <div className="mb-10 lg:mb-12">
                        <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to={"/login"} className="font-semibold text-primary hover:text-primary-container transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-on-surface mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-outline bg-white rounded-lg text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                                    placeholder="johndoe"
                                    onChange={(e) => {setUsername(e.target.value)}}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-outline bg-white rounded-lg text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                                    placeholder="name@example.com"
                                    onChange={(e) => {setEmail(e.target.value)}}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className="block w-full pl-10 pr-10 py-3 border border-outline bg-white rounded-lg text-on-surface placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => {setPassword(e.target.value)}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Must be at least 8 characters long.</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 bg-white border-outline text-primary focus:ring-primary rounded cursor-pointer"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                I agree to the <a href="#" className="font-semibold text-primary hover:text-primary-container">Terms of Service</a> and <a href="#" className="font-semibold text-primary hover:text-primary-container">Privacy Policy</a>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-all shadow-sm hover:shadow-md"
                            >
                                Create Account
                                <span className="absolute right-4 flex items-center inset-y-0">
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
