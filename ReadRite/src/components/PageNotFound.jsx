import { useNavigate } from "react-router-dom";
import { checkAndRemoveExpiredToken } from "../../server/tokenService.js";
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import pageNotFoundAnimation from '../assets/pagenotfound.json';
import Lottie from "react-lottie";
function PageNotFound(){
    const navigate = useNavigate();

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: pageNotFoundAnimation,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };  

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
    return <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        <Navbar/>
        <div className="flex flex-col justify-center items-center h-72">
            <Lottie options={defaultOptions} height={250} width={300}/>
            <p className="text-xl text-gray-600 mt-2">The page you requested does not exist.</p>
        </div>
        
    </div>
}
export default PageNotFound;