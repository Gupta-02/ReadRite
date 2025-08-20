import './App.css'
import Addbook from './components/Addbook'
import Login from './components/Login'
import Page from './components/Page'
import { Routes,Route } from 'react-router-dom'
import Register from './components/Register'
import DataTable from './components/BookAllocation'
import ReturnDetails from './components/ReturnDetails'
import PageNotFound from './components/PageNotFound'
import { ToastContainer, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/home" element={<Page />} />
        <Route path="/add-book" element={<Addbook />} />
        <Route path="/book-allocation" element={<DataTable />} />
        <Route path="/return-details" element={<ReturnDetails />} />
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  )
}

export default App
