import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import allocation from '../assets/allocation.jpg';

function PopupForm({ bookName, setpopup, handleSubmit }) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
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

    const handleChange = async (event) => {
        event.preventDefault();
        if (!name || !phoneNumber) {
            toast.error('All fields are required');
            handleSubmit(false);
            return;
        }
        if(phoneNumber.length!==10){
            toast.error('Invalid phone number');
            handleSubmit(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('https://library-management-1-6d7t.onrender.com/allocate-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':  `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    bookName: bookName,
                    name: name,
                    phone: phoneNumber,
                })
            });
            const data = await response.json();
            setLoading(false);
            handleSubmit(true);
            toast.success(data.message);
            setpopup(false);
        } catch (error) {
            console.error('Error allocating book:', error);
            setLoading(false);
            handleSubmit(false);
            toast.error('An error occurred. Please try again.');
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                    <Lottie options={defaultOptions} height={250} width={250}/>
                </div>
            )}
            
            {!loading && (
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
                    <h1 className='text-3xl font-bold text-center w-full py-4'>
                        <span className="font-extrabold">R</span>
                        <span className="font-medium"> E A D </span>
                        <span className="font-extrabold">R</span>
                        <span className="font-medium"> I T E</span>
                    </h1>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2">
                            <img 
                                src={allocation} 
                                alt="Book Allocation" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="w-full md:w-1/2 p-6">
                            <form onSubmit={handleChange} className="space-y-4">
                                <h2 className='text-xl font-medium'>Book Allocation Form</h2>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Enter Name</label>
                                    <input 
                                        id="name"
                                        type="text" 
                                        placeholder="Name" 
                                        autoComplete="off" 
                                        className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500'
                                        onChange={(event) => setName(event.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Enter Phone number</label>
                                    <input 
                                        id="phone"
                                        type="number" 
                                        placeholder="Phone number" 
                                        autoComplete="off" 
                                        className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500'
                                        onChange={(event) => setPhoneNumber(event.target.value)}
                                    />
                                </div>
                                <div>
                                    <button 
                                        type="submit" 
                                        className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 mt-2'
                                    >
                                        Allocate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopupForm;
