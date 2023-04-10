import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { BsSearch } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/books", {
          params: {
            page: page - 1,
            size,
            sortField,
            sortDirection,
          },
        });
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, size, sortField, sortDirection]);
  

  const search = async () => {
    try {
      const response = await axios.get(`/books/search/${searchQuery}`);
      const data = response.data;
      setBooks(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      setBooks([]);
    }
  };

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage.selected + 1);
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
    closeModal();
    setLoading(true);
    try {
      const response = await axios.post("/reservations", {
        userId: id,
        bookId,
      });
      console.log(response);
      toast.success("Book Reserved!");
      setLoading(false);
      navigate("/user-loans");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const openModal = (bookId) => {
    setSelectedBookId(bookId);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addFavourite = async (bookId) => {
    closeAddFavModal();
    setLoading(true);
    try{
      const response = await axios.put('/users/add-to-favourites', {
        userId: id,
        bookId,
      });
      console.log(response);
      toast.success("Added to Favourites!");
      setLoading(false);
      navigate('/favourites');
    }catch (err){
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const openAddFavModal = (bookId) => {
    setSelectedFavBookId(bookId);
    setIsAddFavModalOpen(true);
  };
  
  const closeAddFavModal = () => {
    setIsAddFavModalOpen(false);
  };  

  return (
    <div className="container-xxl mt-2">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="container py-5 input-group">
            <input
              type="text"
              className="form-control py-2"
              placeholder="Search books by title, author or category..."
              aria-label="Search reservations by title, author or category"
              aria-describedby="basic-addon2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="admin-search p-3">
              <BsSearch className="fs-5" onClick={search} />
            </span>
          </div>
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
            <h2>All Books</h2>
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
            pageCount={totalPages > 0 ? totalPages : 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={page > 0 && totalPages > 0 ? page - 1 : 0}
          />
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Reserve Book Modal"
            className="Modal"
            overlayClassName="Overlay"
          >
            <h2>Confirm Reservation</h2>
            <p>Are you sure you want to reserve this book?</p>
            <button onClick={() => reserveBook(selectedBookId)}>Yes, Reserve</button>
            <button onClick={closeModal}>Cancel</button>
          </ReactModal>
          <ReactModal
            isOpen={isAddFavModalOpen}
            onRequestClose={closeAddFavModal}
            contentLabel="Add to Favourites Modal"
            className="Modal"
            overlayClassName="Overlay"
          >
            <h2>Confirm Add to Favourites</h2>
            <p>Are you sure you want to add this book to your favourites?</p>
            <button onClick={() => addFavourite(selectedFavBookId)}>Yes, Add to Favourites</button>
            <button onClick={closeAddFavModal}>Cancel</button>
          </ReactModal>
        </>
      )}
    </div>
  );
};

export default Books;