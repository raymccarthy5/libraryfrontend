import { React, useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import formatDate from "../components/formatDate";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const AdminReservations = () => {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/reservations", {
        params: {
          page: page - 1,
          size,
          sortField,
          sortDirection,
        },
      });
      setReservations(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  fetchReservations();
}, [page, size, sortField, sortDirection]);

const search = async () => {
  try {
    const response = await axios.get(`/reservations/${searchQuery}`);
    const data = response.data;
    setReservations([data]);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "An error occurred";
    toast.error(errorMessage);
    setReservations([]);
  }
};

const handlePageClick = (selectedPage) => {
  setPage(selectedPage.selected + 1);
};

const handleSortFieldChange = (event) => {
  setSortField(event.target.value);
  setPage(1); // Reset the page number to 1
};

const handleSortDirectionChange = (event) => {
  setSortDirection(event.target.value);
  setPage(1); // Reset the page number to 1
};

const handleSizeChange = (event) => {
  setSize(parseInt(event.target.value));
  setPage(1); // Reset the page number to 1
};

return (
<div className="container-xxl mt-2">
    {loading ? (
    <p>Loading...</p>
    ) : (
    <>
    <div className="container py-5 input-group">
        <input type="text" 
        className="form-control py-2" 
        placeholder="Search reservations by ID..." 
        aria-label="Search reservations by ID" 
        aria-describedby="basic-addon2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="admin-search p-3">
            <BsSearch className='fs-5' onClick={search}/>
        </span>
      </div>
    <div><h2 className="mb-5">Admin Reservations</h2></div>
    <div>
    <div className="controls">
      <label>
        Sort by:
        <select value={sortField} onChange={handleSortFieldChange}>
          <option value="id">Id</option>
          <option value="user.email">Email</option>
          <option value="pickUpBy">Pick Up By</option>
          <option value="checkedOutAt">Checkeded Out At</option>
          <option value="dueDate">Return date</option>
          <option value="returned">Returned</option>
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
    <table>
    <thead>
        <tr>
        <th>ID</th>
        <th>Email</th>
        <th>Reserved At</th>
        <th>Pick Up By</th>
        <th>Checked Out At</th>
        <th>Return Date</th>
        <th>Returned</th>
        <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {reservations.map((reservation) => (
        <tr key={reservation.id}>
        <td>{reservation.id}</td>
        <td>{reservation.user.email}</td>
        <td>{formatDate(reservation.reservedAt)}</td>
        <td>{formatDate(reservation.pickUpBy)}</td>
        <td>{formatDate(reservation.checkedOutAt)}</td>
        <td>{formatDate(reservation.dueDate)}</td>
        <td>{reservation.returned ? "Yes" : "No"}</td>           
        <td>
        <Link to={`/edit-reservation/${reservation.id}`}><button>Manage</button></Link>
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
    </div>
    </>
    )
    }
    <Link to="/admin-books">
    <button className="mb-5">Add Reservation</button>
    </Link>
    </div>
);
}

export default AdminReservations;