import React from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../assets/spinnerlottie.json';
import { useState } from 'react';

function Book({ imagesrc, bookId, name, publicationYear, author, available, handleIconClick, handleSubmit }) {
  const [loading,setLoading] = useState(false);
  
  const handleChange = (value) => {
    if (available <= 0 && value < 0) {
      toast.error('No more available books to allocate.');
      return;
    }

    const newAvailable = available + value;
    if (newAvailable < 0) {
      toast.error('Available count cannot be negative.');
      return;
    }
    handleIconClick(name);
  };

  const deleteBook = async (id) => {
    const isConfirmed = window.confirm(`Are you sure you want to permanently delete "${name}"?`);
    
    if (isConfirmed) {
      try {
        const response = await fetch('https://library-management-1-6d7t.onrender.com/delete-book', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'authorization':  `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ bookId: id }),
        });
        
        if (!response.ok) {
          throw new Error('Error deleting book');
        }
        toast.success('Book deleted successfully');
        handleSubmit(true);
      } catch (error) {
        toast.error('Error deleting book');
      }
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
    <div className="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      
      {loading && <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <Lottie options={defaultOptions} height={250} width={250} />
      </div>}
      
      {!loading && (
        <div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={imagesrc} 
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg" 
              alt={name} 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-black bg-opacity-50">
              <div className="text-white text-center">
                <div>Available: {available}</div>
                <button
                  className="bg-blue-500 text-white py-2 px-3 m-2 rounded hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleChange(-1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M212.31-140q-29.92 0-51.12-21.19Q140-182.39 140-212.31v-535.38q0-29.92 21.19-51.12Q182.39-820 212.31-820h178q3.77-33.31 29.08-56.65Q444.69-900 480-900q35.69 0 61 23.35 25.31 23.34 28.69 56.65h178q29.92 0 51.12 21.19Q820-777.61 820-747.69v253q-14.77-6.31-29.58-10.69-14.81-4.39-30.42-7v-235.31q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h234.31q2.23 16.61 6.61 31.42 4.39 14.81 10.69 28.58H212.31ZM200-240v40-560 247.62-3V-240Zm90-54.62h160.69q2.62-15.61 7.77-30.42 5.16-14.81 11.23-29.57H290v59.99ZM290-450h253.62q25.84-21.92 55.15-36.73 29.31-14.81 62.77-21.04V-510H290v60Zm0-155.39h380v-59.99H290v59.99Zm190-180.76q13 0 21.5-8.5t8.5-21.5q0-13-8.5-21.5t-21.5-8.5q-13 0-21.5 8.5t-8.5 21.5q0 13 8.5 21.5t21.5 8.5ZM720-57.69q-74.92 0-127.46-52.54Q540-162.77 540-237.69q0-74.92 52.54-127.46 52.54-52.54 127.46-52.54 74.92 0 127.46 52.54Q900-312.61 900-237.69q0 74.92-52.54 127.46Q794.92-57.69 720-57.69ZM702.31-120h35.38v-100h100v-35.38h-100v-100h-35.38v100h-100V-220h100v100Z"/></svg>
                </button>

                  <button onClick={() => deleteBook(bookId)} className="bg-blue-500 text-white py-2 px-3 m-2 rounded hover:bg-blue-600 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="p-4 flex-grow">
            <h3 className="font-bold text-base mb-1 line-clamp-2 h-12">{name}</h3>
            <p className="text-sm text-gray-600 mb-1">{publicationYear}</p>
            <p className="text-sm text-gray-600 truncate">{author}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Book;
