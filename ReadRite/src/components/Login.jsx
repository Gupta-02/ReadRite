import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import animationData from '../assets/spinnerlottie.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login from '../assets/login.jpg';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const navigate =useNavigate();

    function isLoggedIn() {
        if (checkAndRemoveExpiredToken()) {
            navigate('/');
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        else{
            navigate('/home');
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    async function handleSubmit(event){
        event.preventDefault();
        try{
            if(!username || !password){
                toast.error('All fields are required');
                return;
            }
            setLoading(true);
            const response = await fetch('https://library-management-1-6d7t.onrender.com/', {
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            })
            const data = await response.json();
            if(response.ok){
                setLoading(false);
                setUsername('');
                setPassword('');
                if(data.token){
                    localStorage.setItem('token', data.token);
                    navigate('/home');
                }
            }
            else{
                setLoading(false);
                setUsername('');
                setPassword('');
                toast.error(data.message);
            }
        }catch(e){
            setLoading(false);
            toast.error('Something went wrong. Please try again');
            setUsername('');
            setPassword('');
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
        <div className='bg-gray-50 relative'>
            
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <Lottie options={defaultOptions} height={250} width={250} />
                </div>
            )}

            {!loading && (
                <div className='flex justify-center h-screen items-center'>
                    <div className='flex p-6 rounded-xl shadow-xl bg-white relative'>
                            <h1 className='absolute top-[3rem] sm:top-10 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center w-full'> <span className="font-extrabold">R</span>
                            <span className="font-medium"> E A D </span>
                            <span className="font-extrabold">R</span>
                            <span className="font-medium"> I T E</span>
                        </h1>
                        <div className='p-10 rounded mt-12'>
                            <h2 className='ml-1 text-lg font-medium'>Enter your login credentials</h2>
                            <h3 className='p-2 mt-4 pl-1'>Enter Username</h3>
                            <input
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                type="text"
                                placeholder="username"
                                autoComplete="off"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />

                            <h3 className='p-2 pl-1 mt-2'>Enter Password</h3>
                            <input
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            /><br /><br />
                            <button
                                className='p-2 text-base rounded bg-sky-600 text-white mt-2 ml-10 px-16 hover:bg-sky-700'
                                onClick={handleSubmit}
                            >
                                Login
                            </button>
                        </div>
                        <div className='sm:rounded'>
                            <img
                                src={login}
                                alt='login image'
                                className='hidden sm:block rounded mt-12'
                                width={400}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Login;