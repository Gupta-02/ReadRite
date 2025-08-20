import { useState,useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import register from '../assets/register.png';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function isLoggedIn() {
        if (checkAndRemoveExpiredToken()) {
            navigate('/');
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if(!username || !password || !confirmPassword) {
            toast.warning('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            toast.warning('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("https://library-management-1-6d7t.onrender.com/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':  `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setLoading(false);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                toast.success(data.message);
            } else {
                setLoading(false);
                toast.error(data.message);
            }
        } catch (e) {
            console.log(e.message);
            toast.error('Something went wrong Please try again later');
            setLoading(false);
        }
    }

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <Navbar />
            
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-white bg-opacity-75">
                    <Lottie options={defaultOptions} height={250} width={250}/>
                </div>
            )}
            
            <div className='flex-grow flex justify-center items-center p-4 mt-16'>
                <div className='w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden'>
                    <h1 className='text-3xl font-bold text-center w-full py-4 '>
                        <span className="font-extrabold">R </span>
                        <span className="font-medium">E A D</span>
                        <span className="font-extrabold"> R</span>
                        <span className="font-medium"> I T E</span>
                    </h1>
                    <div className='flex flex-col md:flex-row'>
                        <div className='w-full md:w-1/2 p-6'>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <h2 className='text-xl font-medium'>Register a new user</h2>
                                <div>
                                    <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Enter Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500'
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Enter Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500'
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500'
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                        <div className='hidden md:block w-1/2 p-6'>
                            <img 
                                src={register} 
                                alt='Register' 
                                className='w-full h-full object-cover rounded-lg shadow-md' 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
