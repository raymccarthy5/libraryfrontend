import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Card, Col, Row, Form, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUser = () => {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [firstname, setFirstame] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoading(true);
        axios
          .get(`/users/id/${id}`)
          .then((res) => {
            setUser(res?.data);
            setFirstame(res?.data.firstname);
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


  const handleSubmit = async () => {
    setLoading(true);
    const response = await axios.put(`/users/update/${id}`, {
      firstname,
      lastname,
      email
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    });
    setLoading(false);
    toast.success("User edited successfully");
    setUser(response.data);
    navigate("/admin-users");
  };
  
  const deleteUser = async (id) => {
    setLoading(true);
    axios
      .delete(`/users/${id}`)
      .then(() => {
        setLoading(false);
        toast.success("User deleted");
        navigate("/admin-users");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleConfirmSubmit = () => {
    handleCloseSubmitModal();
    handleSubmit();
  };
  
  const handleConfirmDelete = () => {
    handleCloseDeleteModal();
    deleteUser(id);
  };
  

  const handleShowSubmitModal = () => setShowSubmitModal(true);
  const handleCloseSubmitModal = () => setShowSubmitModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);


  return (
    <>
    <div className='container-xxl'>
      <h2 className='m-5'>{user?.title}</h2>
      <Row className="align-items-stretch">
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstname">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control type="text" value={firstname} onChange={(e) => setFirstame(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="lastname" className='mt-2'>
                  <Form.Label>Lastname</Form.Label>
                  <Form.Control type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="email" className='mt-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <button className="mt-4" type="button" onClick={handleShowSubmitModal}>Save</button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  <Row>
    <Col className='mb-5'>
    <Link to="/admin-users">
    <button>Back to Users</button>
    </Link>
    </Col>
    <Col>
    <button onClick={handleShowDeleteModal}>Delete User</button>
    </Col>
  </Row>
</div>
<div className="btn-container">
  <Row>
  </Row>
</div>
<Modal show={showSubmitModal} onHide={handleCloseSubmitModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Save</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to save the changes?</Modal.Body>
  <Modal.Footer>
  <button onClick={handleConfirmSubmit}>
      Save Changes
    </button>
    <button onClick={handleCloseSubmitModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>

<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
  <Modal.Footer>
    <button onClick={handleConfirmDelete}>
      Delete User
    </button>
    <button onClick={handleCloseDeleteModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>
</>
);
};

export default EditUser;