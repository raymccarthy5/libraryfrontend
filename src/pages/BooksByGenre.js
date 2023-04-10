import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import AuthContext from '../context/AuthProvider';

function BooksByGenre() {
  const [books, setBooks] = useState([]);
  const { genre } = useParams();
  const { isLoggedIn, id } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [isAddFavModalOpen, setIsAddFavModalOpen] = useState(false);
  const [selectedFavBookId, setSelectedFavBookId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`/books/genre/${genre}`, {
        params: {
          page: page - 1,
          size,
          sortField,
          sortDirection,
        },
      });
      setBooks(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    }

    fetchData();
  }, [genre, page, size, sortField, sortDirection]);

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };
  
  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
    setPage(1); 
  };
  
  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
    setPage(1); 
  };
  
  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value));
    setPage(1); 
  };

  const reserveBook = async (bookId) => {
    setIsModalOpen(false);
    try {
      await axios.post("/reservations", {
        userId: id,
        bookId,
      });
      navigate("/user-loans");
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (bookId) => {
    setSelectedBookId(bookId);
    setIsModalOpen(true);
  };
  
  const addFavourite = async (bookId) => {
    setIsAddFavModalOpen(false);
    try {
      await axios.put('/users/add-to-favourites', {
        userId: id,
        bookId,
      });
      navigate('/favourites');
    } catch (err) {
      console.error(err);
    }
  };

  const openAddFavModal = (bookId) => {
    setSelectedFavBookId(bookId);
    setIsAddFavModalOpen(true);
  };


  return (
    <>
    <div className='m-5'>
      <div className="controls">
        <label>
          Sort by:
          <select value={sortField} onChange={handleSortFieldChange}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Category</option>
            <option value="rating">Rating</option>
          </select>
        </label>
        <label>
          Order:
          <select value={sortDirection} onChange={handleSortDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <label>
          Items per page:
          <select value={size} onChange={handleSizeChange}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
      <div>
        <h2>{genre}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.rating < 1 ? '' : `${book.rating}/5`}</td>
              <td>
                {isLoggedIn ? (
                  <button
                    onClick={() => openModal(book.id)}
                    disabled={book.quantityAvailable < 1}
                    className={
                      book.quantityAvailable < 1
                        ? "btn btn-secondary"
                        : "button"
                    }
                  >
                    {book.quantityAvailable < 1
                      ? "Out of Stock"
                      : "Reserve"}
                  </button>
                ) : (
                  <Link to="/login">
                    <button
                      disabled={book.quantityAvailable < 1}
                      className={
                        book.quantityAvailable < 1
                          ? "btn btn-secondary"
                          : "button"
                      }
                    >
                      {book.quantityAvailable < 1
                        ? "Out of Stock"
                        : "Reserve"}
                    </button>
                  </Link>
                )}
                {isLoggedIn ? (
                  <button onClick={() => openAddFavModal(book.id)}>
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        forcePage={page > 0 ? page - 1 : 0} 
      />
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Reserve Book Modal"
        className="Modal"
        overlayClassName="Overlay"
      ><h2>Confirm Reservation</h2>
      <p>Are you sure you want to reserve this book?</p>
      <button onClick={() => reserveBook(selectedBookId)}>Yes, Reserve</button>
      <button onClick={() => setIsModalOpen(false)}>Cancel</button>
    </ReactModal>
    <ReactModal
      isOpen={isAddFavModalOpen}
      onRequestClose={() => setIsAddFavModalOpen(false)}
      contentLabel="Add to Favourites Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Confirm Add to Favourites</h2>
      <p>Are you sure you want to add this book to your favourites?</p>
      <button onClick={() => addFavourite(selectedFavBookId)}>Yes, Add to Favourites</button>
      <button onClick={() => setIsAddFavModalOpen(false)}>Cancel</button>
    </ReactModal>
    </div>
  </>
);
}

export default BooksByGenre;

