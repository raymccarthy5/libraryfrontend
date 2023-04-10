import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import LinkPage from './components/LinkPage';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Books from './pages/Books';
import AdminBooks from './pages/AdminBooks';
import AdminUsers from './pages/AdminUsers';
import AdminReservations from './pages/AdminReservations';
import EditReservation from './pages/EditReservation';
import EditBook from './pages/EditBook';
import AddReservation from './pages/AddReservation';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AddBook from './pages/AddBook';
import SearchResults from './pages/SearchResults';
import LoggedOut from './pages/LoggedOut';
import { AuthProvider } from './context/AuthProvider';
import OverdueReservations from './pages/OverdueReservations';
import Favourites from './pages/Favourites';
import UserAccountDetails from './pages/UserAccountDetails';
import UserEditDetails from './pages/UserEditDetails';
import UserReservations from './pages/UserReservations';
import ChangePassword from './components/ChangePassword';
import StripeCheckout from './components/StripeCheckout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminStats from './pages/AdminStats';
import BooksByGenre from './pages/BooksByGenre';

function App() {

  return (
    <div>
    <AuthProvider>
    <Routes>
      <Route path = "/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path='books' element={<Books />} />
        <Route path="/books/:genre" element={<BooksByGenre />} />
 
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="logged-out" element={<LoggedOut />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="search/:query" element={<SearchResults />} />


        {/* private routes */}
        {/* <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']}/>}> */}
        <Route path ="favourites" element={<Favourites />} />
        <Route path ="user-loans" element={<UserReservations />} />
        <Route path ="user-account-details" element={<UserAccountDetails />} />
        <Route path ="user-edit-details" element={<UserEditDetails />} />
        <Route path ="change-password" element={<ChangePassword />} />
        <Route path ="checkout" element={<StripeCheckout />} />

        {/* admin routes */}
        <Route element={<RequireAuth allowedRoles={true}/>}> 
        <Route path='admin' element={<Admin />} />
        <Route path='admin-users' element={<AdminUsers />} />
        <Route path='admin-books' element={<AdminBooks />} />
        <Route path='admin-reservations' element={<AdminReservations />} />
        <Route path='admin-stats' element={<AdminStats />} />
        <Route path='add-user' element={<AddUser /> } />
        <Route path='add-book' element={<AddBook /> } />
        <Route path='reserve-book/:bookId' element={<AddReservation />} />
        <Route path='edit-book/:id' element={<EditBook />} />
        <Route path='edit-user/:id' element={<EditUser />} />
        <Route path='edit-reservation/:id' element={<EditReservation />} />
        <Route path='overdue-reservations' element={<OverdueReservations />} />
        </Route> 

        {/* catch all */}
        <Route path="*" element={<Missing />} />

      </Route>
    </Routes>
    <ToastContainer />
    </AuthProvider>
    </div>
  );
}

export default App;
