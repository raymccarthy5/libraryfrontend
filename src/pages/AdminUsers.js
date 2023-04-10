import { useState, useEffect } from "react";
import axios from "../api/axios";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/users", {
        params: {
          page: page - 1,
          size,
          sortField,
          sortDirection,
        },
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  fetchUsers();
}, [page, size, sortField, sortDirection]);

const search = async () => {
  try {
    const response = await axios.get(`/users/id/${searchQuery}`);
    const data = response.data;
    setUsers([data]);
  } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    setUsers([]);
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
  <div className="container mt-2">
    {loading ? (
    <p>Loading...</p>
    ) : (
    <>
    <div className="container py-5 input-group">
        <input type="text" 
        className="form-control py-2" 
        placeholder="Search users by ID..." 
        aria-label="Search reservations by title, author or category" 
        aria-describedby="basic-addon2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="admin-search p-3">
            <BsSearch className='fs-5' onClick={search}/>
        </span>
      </div>
      <div><h2 className="mb-5">Admin Users</h2></div>
      <div className="controls">
        <label>
          Sort by:
          <select value={sortField} onChange={handleSortFieldChange}>
            <option value="id">Id</option>
            <option value="lastname">Lastname</option>
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
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Email</th>
          <th>Balance Owed</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
        <tr key={user?.id}>
          <td>{user?.id}</td>
          <td>{user?.firstname}</td>
          <td>{user?.lastname}</td>
          <td>{user?.email}</td>
          <td>€{user?.fine}</td>
          <td>{user?.role}</td>
          <td>
          <Link to={`/edit-user/${user?.id}`}><button>Manage</button></Link>
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
    <Link to={`/add-user`}><button className="mb-5">Add User</button></Link>
    </>
    
    )
    }
    
  </div>
  );
}

export default UserTable;