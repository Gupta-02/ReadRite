import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { checkAndRemoveExpiredToken } from '../../server/tokenService.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';

function DataTable() {
    const [bookDetails, setBookdetails] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const response = await fetch('https://library-management-1-6d7t.onrender.com/book-allocation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':  `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();
            setBookdetails(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching book allocation', err);
            toast.error('Failed to fetch updated book details');
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            if (selectedRows.length === 0) {
                toast.warning('No rows selected');
                return;
            }

            const deleteRequests = selectedRows.map(async (rowId) => {
                const rowData = bookDetails.find(row => row._id === rowId);
                if (rowData) {
                    await fetch('https://library-management-1-6d7t.onrender.com/return-book', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization':  `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({
                            book: rowData.book,
                            name: rowData.name
                        })
                    });
                }
            });

            await Promise.all(deleteRequests);
            setLoading(false);
            toast.success('Book returned successfully');
            get_allocation();
            setSelectedRows([]);
        } catch (err) {
            console.error('Error:', err);
            setLoading(false);
            toast.error('Some error occurred. Please try again');
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 230 },
        { field: 'book', headerName: 'Book', width: 310 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone', width: 160 },
        { field: 'datetime', headerName: 'Borrowed Time', width: 200 },
    ];

    const rows = (bookDetails || []).slice().reverse().map((item, index) => ({
        id: item._id,
        book: item.book,
        name: item.name,
        phoneNumber: item.phone,
        datetime: item.borrowedDateTime,
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

            {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 my-0">
                <Navbar />
                <Lottie options={defaultOptions} height={250} width={250}/>
            </div>}

            {!loading && (
                <div>
                    <Navbar />
                    <div className='flex-1 p-4'>
                        <div className='w-full max-w-6xl mx-auto overflow-x-auto'>
                            <div className='text-center mb-4'>
                                <h1 className='text-xl font-bold pt-14'>Book Allocation</h1>
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
                                    checkboxSelection
                                    rowSelectionModel={selectedRows}
                                    onRowSelectionModelChange={(newSelectionModel) => {
                                        setSelectedRows(newSelectionModel);
                                    }}
                                    className='min-w-full'
                                />
                            </div>
                            <div className='mt-4 text-center'>
                                <button
                                    onClick={handleDelete}
                                    className='px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700'
                                >
                                    Mark as Returned
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
