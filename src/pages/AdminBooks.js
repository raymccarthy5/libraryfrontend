import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);

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
        }).catch((err) => {
          const errorMessage = err.response?.data?.message || err.message || "An error occurred";
          toast.error(errorMessage);
        });
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
        <h2>Admin Books</h2>
      </div>
      <div className="table-responsive">
        {books.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Quantity Av.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.rating < 1 ? '' : `${book.rating}/5`}</td>
                  <td>{book.quantityAvailable}</td>
                  <td>
                    <Link to={`/reserve-book/${book.id}`}>
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
                    <Link to={`/edit-book/${book.id}`}>
                      <button>Manage</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1 className="py-5">No books found...</h1>
        )}
      </div>
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
        forcePage={page - 1} 
      />
    </>
  )}
  <Link to="/add-book">
    <button className="mb-5">Add Book</button>
  </Link>
</div>
);
};

export default AdminBooks;
