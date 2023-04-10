import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { Card, Col, Row, Form } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { toast } from 'react-toastify';
import ReactModal from "react-modal";

const UserEditDetails = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const { id } = useContext(AuthContext);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const { setIsLoggedIn, setIsAdmin, setId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/id/${id}`)
      .then((res) => {
        setUser(res?.data);
        setFirstname(res?.data.firstname);
        setLastname(res?.data.lastname);
        setEmail(res.data.email);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeSubmitModal();
    const response = await axios.put(`/users/update/${id}`, {
      firstname,
      lastname,
      email
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    });
    toast.success("User edited successfully");
    setUser(response.data);
    navigate("/user-account-details");
  };

  const deleteUser = (id) => {
    closeDeleteUserModal();
    setLoading(true);
    axios
      .delete(`/users/${id}`)
      .then(() => {
        setLoading(false);
        toast.success("User deleted");
        setIsLoggedIn(false);
        setIsAdmin(false);
        setId(null);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('isAdmin', 'false');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('auth');
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const openSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const openDeleteUserModal = () => {
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
  };

  return (
    <>
      <div className='container-xxl'>
        <h2 className='m-5'>{user?.title}</h2>
        <Row className="align-items-stretch">
          <Col className='mb-5'>
            <Card>
              <Card.Body>
                <Card.Title>User Details</Card.Title>
                <Form>
                  <Form.Group controlId="firstname">
                    <Form.Label>Firstname</Form.Label>
                    <Form.Control type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="lastname" className='mt-2'>
                    <Form.Label>Lastname</Form.Label>
                    <Form.Control type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="email" className='mt-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>
                  <button className='mt-4' type="button" onClick={openSubmitModal}>Save</button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className='mb-5'>
            <Link to="/user-account-details">
              <button>Back to Account Details</button>
            </Link>
          </Col>
          <Col>
            <button onClick={openDeleteUserModal}>Close Account</button>
          </Col>
        </Row>
      </div>
      <ReactModal
        isOpen={isSubmitModalOpen}
        onRequestClose={closeSubmitModal}
        contentLabel="Submit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Save Changes</h2>
        <p>Are you sure you want to save the changes?</p>
        <button onClick={handleSubmit}>Yes, Save Changes</button>
        <button onClick={closeSubmitModal}>Cancel</button>
      </ReactModal>

      <ReactModal
        isOpen={isDeleteUserModalOpen}
        onRequestClose={closeDeleteUserModal}
        contentLabel="Delete User Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Delete User</h2>
        <p>Are you sure you want to delete this user?</p>
        <button onClick={() => deleteUser(id)}>Yes, Delete User</button>
        <button onClick={closeDeleteUserModal}>Cancel</button>
      </ReactModal>
    </>
  );
};

export default UserEditDetails;
