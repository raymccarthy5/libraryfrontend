import { NavLink, Link } from 'react-router-dom'
import {BsSearch} from 'react-icons/bs' 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import axios from '../api/axios';
import { useEffect } from 'react';


const Header = () => {
    const { isLoggedIn, isAdmin } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [genres, setGenres] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn, setIsAdmin, setId } = useContext(AuthContext); 
    

    const logout = (e) => {
        e.preventDefault();
        setIsLoggedIn(false);
        setIsAdmin(false);
        setId(null);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('isAdmin', 'false');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('auth');
        toast.success("Logged out!");
        navigate("/");
    }

    useEffect(() => {
        async function fetchData() {
          const fetchedGenres = await fetchGenres();
          setGenres(fetchedGenres);
        }
    
        fetchData();
    }, []);

    

    const handleCloseLogoutModal = () => setShowLogoutModal(false);
    const handleShowLogoutModal = () => setShowLogoutModal(true);
    const handleConfirmLogout = (e) => {
    logout(e);
    handleCloseLogoutModal();
    };


    const search = (e) => {
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
    };

    async function fetchGenres() {
        try {
          const response = await axios.get('/books/genres');
          return response.data;
        } catch (error) {
          console.error('Error fetching genres:', error);
          return [];
        }
    };
      

    return (
        <>
        {isLoggedIn ? isAdmin ? "Logged in as admin" : "Logged in as user" : "Logged out" }
        <header className='header-top-strip py-3'>
            <div className='container-xxl'>
                <div className='row'>
                    <div className='col-6'>
                        <p className='text-white mb-0'>Welcome to the Library</p>
                    </div>
                    <div className='col-6'>
                        <p className='text-end text-white mb-0'>Phone: <a className='text-white' href='tel:+01 620 0000'>+01 620 0000</a></p>
                    </div>
                </div>
            </div>
        </header>
        <header className='header-upper py-3'>
            <div className='container-xxl'>
                <div className='row align-items-center'>
                    <div className='col-2'>
                        <h2>
                            <Link className='text-white'>Library.</Link>
                        </h2>
                    </div>
                    <div className='col-5'>
                        <div className="input-group">
                            <input type="text" 
                            className="form-control py-2" 
                            placeholder="Search books, authors or category..." 
                            aria-label="Search books, authors or category..." 
                            aria-describedby="basic-addon2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="admin-search p-3">
                                <BsSearch className='fs-5' onClick={search}/>
                            </span>
                        </div>
                    </div>
                    {isLoggedIn ? 
                    <div className='col-5'>
                        <header className='header-upper-links d-flex align-items-center justify-content-between'>
                            <div>
                                <Link className='d-flex align-items-center gap-10 text-white' to='/user-loans'>
                                    <img src="images/compare.svg" alt="compare" />
                                        <p className='mb-0'>Your <br/> Loans</p>
                                </Link>
                            </div>
                            <div>
                                <Link className='d-flex align-items-center gap-10 text-white' to="/favourites">
                                    <img src="images/wishlist.svg" alt="wishlist" />
                                        <p className='mb-0'>Your <br/> Favourites</p>
                                </Link>
                            </div>
                            <div>
                                <Link className='d-flex align-items-center gap-10 text-white' to='/user-account-details'>
                                    <img src="images/user.svg" alt="user" />
                                    <p className='mb-0'>Your <br/> Account</p>
                                </Link>
                            </div>
                            <div>
                            <Link className='d-flex align-items-center gap-10 text-white' onClick={handleShowLogoutModal}>
                                <img src="images/logout.svg" alt="cart" />
                                <p className='mb-0'>Logout</p>
                            </Link>
                            </div>
                        </header>
                    </div>
                    :
                    <>
                    <div className='col-5'>
                        <div className='header-upper-links d-flex align-items-center'>
                            <div>
                                <Link className='d-flex align-items-center gap-10 text-white' to={"login"}>
                                <img src="images/login.svg" alt="user" />
                                <p className='mb-0'>Login</p>
                                </Link>
                            </div>
                            <div style={{marginLeft:"15px"}}>
                                <Link className='d-flex align-items-center gap-10 text-white' to={"register"}>
                                <img src="images/register.svg" alt="user" />
                                <p className='mb-0'>Register</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                    </>
                    }
                </div>
            </div>
        </header>
    <header className='header-bottom py-3'>
        <div className='container-xxl'>
            <div className='row'>
                <div className='col-12'>
                    <div className='menu-bottom d-flex align-items-center gap-30'>
                        <div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-10 d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src='images/menu.svg' alt="" />
                                    <span className='me-2 d-inline=block'>Browse Categories</span>
                                </button>
                                <ul className="dropdown-menu">
                                    {genres.map((genre, index) => (
                                    <li key={index}>
                                        <Link className="dropdown-item text-white" to={`/books/${genre}`}>
                                        {genre}
                                        </Link>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='menu-links'>
                            <div className='d-flex align-items-center gap-15'>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/books">Books</NavLink>
                                <NavLink to="/about">About</NavLink>
                                <NavLink to="/contact">Contact</NavLink>
                            </div>
                        </div>
                        { isAdmin ? (
                        <div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-10 d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className='me-2 d-inline=block'>Admin</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item text-white" to="/admin-books">Books</Link></li>
                                    <li><Link className="dropdown-item text-white" to="/admin-users">Users</Link></li>
                                    <li><Link className="dropdown-item text-white" to="/admin-reservations">Reservations</Link></li>
                                    <li><Link className="dropdown-item text-white" to="/overdue-reservations">Overdue</Link></li>
                                    <li><Link className="dropdown-item text-white" to="/admin-stats">Statistics</Link></li>
                                </ul>
                            </div>
                        </div> ) : (" ")
                        }
                    </div>
                </div>
            </div>
        </div>
    </header>
    <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer>
            <button onClick={handleConfirmLogout}>
                Log Out
            </button>
            <button onClick={handleCloseLogoutModal}>
                Cancel
            </button>
        </Modal.Footer>
    </Modal>
    </>
  );
};

export default Header