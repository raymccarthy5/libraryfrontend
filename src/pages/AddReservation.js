import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Card, Col, Row, Form } from "react-bootstrap";
import { Link } from 'react-router-dom';
import formatDate from '../components/formatDate';
import { toast } from 'react-toastify';
import ReactModal from "react-modal";

const AddReservation = () => {

  const [book, setBook] = useState();
  const [loading, setLoading] = useState();
  const [userId, setUserId] = useState();
  const [success, setSuccess] = useState(false);
  const [reservation, setReservation] = useState();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { bookId } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/books/${bookId}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [bookId]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/reservations', {
        userId,
        bookId,
      });
      console.log(response);
      setReservation(response.data);
      setSuccess(true);
      toast.success("Reservation confirmed!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    handleSubmit();
    closeConfirmModal();
  };

  if (loading) {
    return <p>Loading...</p>;
  };

  return (
    <>
      {success ? (
        <section className="success-page">
          <h1>Reservation #{reservation?.id} Confirmed!</h1>
          <Card className='mb-5'>
            <Card.Body>
              <Card.Title>Reservation Details</Card.Title>
              <Card.Text>
                <p>{reservation?.book.title}</p>
                <p>Reserved for: {reservation?.user.email} </p>
                <p>Reserved At: {formatDate(reservation?.reservedAt)}</p>
                <p>Pick Up By: {formatDate(reservation?.pickUpBy)}</p>
                <p>Checked Out At: {reservation?.checkedOutAt ? formatDate(reservation?.checkedOutAt) : 'N/A'}</p>
                <p>Return Date: {formatDate(reservation?.dueDate)}</p>
                <p>Returned: {reservation.checkedOutAt ? (reservation?.returned ? 'Yes' : 'No') : 'N/A'}</p>
              </Card.Text>
              <button>Extend</button>
              <button>Cancel</button>
              <button>Checkin</button>
              <button>Checkout</button>
            </Card.Body>
          </Card>
          <Link to="/admin-reservations">
            <button>Back to Reservations</button>
          </Link>
        </section>
      ) : (
        <div className='container-xxl'>
          <h2 className='m-5'>Reserve Book - {book?.title}</h2>
          <div>
            <Row>
              <Col className='mb-5'>
                <Card>
                  <Card.Body>
                    <Card.Title>Enter User ID</Card.Title>
                    <Card.Text>
                      <Form>
                        <Form.Group controlId="user-id">
                          <Form.Label>User ID</Form.Label>
                          <Form.Control type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                        </Form.Group>
                        <button className='mt-4' type="button" onClick={openConfirmModal}>Submit</button>
                      </Form>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Link to="/admin-reservations">
              <button className='mb-5'>Back to Reservations</button>
            </Link>
            <Link to="/admin-books">
              <button className='mb-5'>Back to Books</button>
            </Link>
          </div>
        </div>
      )}
  
      <ReactModal 
        isOpen={isConfirmModalOpen} 
        onRequestClose={closeConfirmModal} 
        contentLabel="Reservation confirmation" 
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Are you sure?</h2>
        <p>Please confirm to reserve this book for the user with ID: {userId}</p>
        <button onClick={handleConfirmSubmit}>Yes, confirm</button>
        <button onClick={closeConfirmModal}>Cancel</button>
      </ReactModal>
    </>
  );

  }

  export default AddReservation;