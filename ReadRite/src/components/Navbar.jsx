import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../server/tokenService";
import logo from "../assets/logo.png";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="bg-white shadow fixed top-0 left-0 w-full z-50 flex justify-between items-center p-3">
            <button 
                onClick={() => navigate('/home')} className="hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400 sm:ml-2 px-4"
            >
            <div className="flex items-center">
                <img 
                    src={logo} 
                    alt="logo" 
                    className="w-10 m-0"
                    />
                <span 
                    className="ml-2"
                    ><span className="font-extrabold">R</span><span className="font-medium"> E A D </span><span className="font-extrabold">R</span><span className="font-medium"> I T E</span>
                    </span>
            </div>
        
            </button>
            
            <div className="hidden md:flex space-x-4">
                <button 
                    onClick={() => navigate('/add-book')}
                    className=" font-medium hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400"
                >
                    Add book
                </button>
                <button 
                    onClick={() => navigate('/book-allocation')}
                    className=" font-medium hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400"
                >
                    Book Allocation
                </button>
                <button 
                    onClick={() => navigate('/return-details')}
                    className=" font-medium hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400"
                >
                    Return details
                </button>
                <button 
                    onClick={() => {
                        const isConfirmed = window.confirm(`Are you sure you want to logout?`);
                        if (isConfirmed) {
                        removeToken();
                        window.location.reload();
                        }
                    }}
                    className=" font-medium hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400"
                >
                    Logout
                </button>
                <button 
                    onClick={() => navigate('/register')}
                    className=" font-medium hover:text-gray-700 hover:ring-2 ring-offset-4 ring-gray-400"
                >
                    Register
                </button>
            </div>

            {/* Dropdown menu for small screens */}
            <div className="sm:hidden relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=" font-medium hover:text-gray-700"
                >
                    Menu
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white  rounded shadow-lg z-50">
                        <button 
                            onClick={() => { navigate('/add-book'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-300 w-full text-left"
                        >
                            Add Book
                        </button>
                        <button 
                            onClick={() => { navigate('/book-allocation'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-300 w-full text-left"
                        >
                            Book Allocation
                        </button>
                        <button 
                            onClick={() => { navigate('/return-details'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-300 w-full text-left"
                        >
                            Return Details
                        </button>
                        <button 
                            onClick={() => { removeToken(); window.location.reload(); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-300 w-full text-left"
                        >
                            Logout
                        </button>
                        <button 
                            onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                            className="block px-4 py-2 hover:bg-gray-300 w-full text-left"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
