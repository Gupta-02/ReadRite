import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import { toast } from 'react-toastify';
function ReturnDetails() {
    const [bookDetails, setBookdetails] = useState([]);
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
        get_allocation();
        isLoggedIn();
    }, []);

    async function get_allocation() {
        try {
            setLoading(true);
            const response = await fetch('https://library-management-1-6d7t.onrender.com/return-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':  `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) {
                toast.error('Error fetching the detils');
                setLoading(false);
                return;
            }
            const data = await response.json();
            setBookdetails(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching book allocation", err);
            setLoading(false);
            toast.error('Failed to fetch return book details');
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'book', headerName: 'Book', width: 320 },
        { field: 'name', headerName: 'Name', width: 190 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
        { field: 'Bdatetime', headerName: 'Borrowed Time', width: 200 },
        { field: 'Rdatetime', headerName: 'Returned Time', width: 190 },
    ];
    
    const rows = (bookDetails || []).slice().reverse().map((item, index) => ({
        id: item._id,
        book: item.book,
        name: item.name,
        phoneNumber: item.phone,
        Bdatetime: item.borrowedDateTime,
        Rdatetime: item.returnedDateTime,
    }));

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='bg-gray-50 min-h-screen flex flex-col'>
            
            {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                <Navbar />
                <Lottie options={defaultOptions} height={250} width={250}/>
            </div>}

            {!loading && (
                <>
                    <Navbar />
                    <div className='flex-1 p-4'>
                        <div className='w-full mx-auto max-w-7xl overflow-x-auto'>
                            <div className='text-center mb-4'>
                                <h1 className='text-xl font-bold pt-14'>Return Details</h1>
                            </div>
                            <div className='bg-white rounded-lg shadow-md'>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { pageSize: 10, page: 0 },
                                        },
                                    }}
                                    pageSizeOptions={[5, 10]}
                                    className='min-w-full'
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ReturnDetails;
