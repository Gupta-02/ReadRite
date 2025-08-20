import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import addbook from '../assets/addbook.jpg';

function Addbook() {
    const [bookname, setBookname] = useState('');
    const [author, setAuthor] = useState('');
    const [available, setAvailable] = useState('');
    const [publicationyear, setPublicationyear] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (checkAndRemoveExpiredToken()) {
            navigate('/');
        }
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = async (event) => {
        event.preventDefault();
        if (!bookname || !author || !available || !publicationyear || !image) {
            toast.error('All fields are required');
            return;
        }

        if (parseInt(available) <= 0) {
            toast.warning('Number of available books must be positive');
            return;
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(publicationyear) > currentYear) {
            toast.warning('Publication year cannot be in the future');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('bookname', bookname);
        formData.append('author', author);
        formData.append('available', available);
        formData.append('publicationyear', publicationyear);

        try {
            setLoading(true);
            const response = await fetch('https://library-management-1-6d7t.onrender.com/add-book', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            toast.success('New Book uploaded successfully');
            setLoading(false);
            setBookname('');
            setAuthor('');
            setAvailable('');
            setPublicationyear('');
            setImage(null);
        } catch (error) {
            console.error("Error adding book:", error);
            setLoading(false);
            toast.error('Failed to add book. Please try again.');
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
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
        <div className="flex items-center justify-center h-screen bg-gray-50">
            {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <Navbar />
                <Lottie options={defaultOptions} height={250} width={250}/>
            </div>}

            {!loading &&
            <div>
                <Navbar />
                <div className="flex p-8 pr-4 shadow-lg bg-white mt-8 pt-20 rounded-xl">
                    <h1 className='absolute top-[7rem] sm:top-28 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center w-full'> <span className="font-extrabold">R</span>
                    <span className="font-medium"> E A D </span>
                    <span className="font-extrabold">R</span>
                    <span className="font-medium"> I T E</span></h1>
                    <div>
                        <img 
                            src={addbook} 
                            alt="Book Addition" 
                            className="max-w-sm py hidden sm:block" />
                    </div>
                    <form onSubmit={handleChange} autoComplete="off">
                        <h1 className='ml-1 text-lg mt-2 font-medium'>Add a Book</h1>
                        <h3 className='p-2 pl-1 pr-0'>Name of the Boook</h3>
                            <input 
                                type="text" 
                                placeholder="name of the book" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setBookname(event.target.value)} 
                                value={bookname}
                            />
                        <h3 className='p-2 pl-1 pr-0'>Number of books available</h3>
                            <input 
                                type="number" 
                                placeholder="no of books available" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setAvailable(event.target.value)} 
                                value={available}
                            />
                        <h3 className='p-2 pl-1 pr-0'>Author of the book</h3>
                            <input 
                                type="text" 
                                placeholder="enter the author name" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setAuthor(event.target.value)} 
                                value={author}
                            />
                        
                        <h3 className='p-2 pl-1 pr-0'>Publication Year</h3>
                            <input 
                                type="number" 
                                placeholder="publication year" 
                                className='p-2 w-64 rounded border-2 focus:outline-none focus:border-1 focus:ring focus:ring-sky-500 focus:ring-1 focus:shadow-xl'
                                onChange={(event) => setPublicationyear(event.target.value)} 
                                value={publicationyear}
                            /><br/>
                        <input type="file" className="mt-1 p-2 pl-1 pr-0" onChange={handleImageChange} required /><br/>
                        <button 
                            type="submit"
                            className="p-2 text-base rounded bg-sky-600 text-white ml-7 mt-4 px-16 hover:bg-sky-700 font-medium"
                        >
                            Add Book
                        </button>
                    </form>
                </div>
            </div>}
        </div>
    );
}

export default Addbook;