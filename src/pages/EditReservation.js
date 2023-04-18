import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Card, Col, Row, Modal } from "react-bootstrap";
import { useNavigate, useParams, Link } from 'react-router-dom';
import formatDate from '../components/formatDate';
import { toast } from 'react-toastify';


const EditReservation = () => {

  const [reservation, setReservation] = useState({});
  const [loading, setLoading] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
      setLoading(true);
      axios
        .get(`/reservations/${id}`)
        .then((res) => {
          setReservation(res.data);
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

  const extendReservation = async () => {
    try{
      const response = await axios.put(`/reservations/${id}/extend`);
      setReservation(response.data);
      toast.success("Reservation return date extended by 7 days")
    }catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  const cancelReservation = async () => {
    try {
      await axios.delete(`/reservations/cancel/${id}`);
      toast.success("Reservation cancelled")
      navigate("/admin-reservations");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const checkinReservation = async () => {
    try{
      const response = await axios.put(`/reservations/checkin/${id}`);
      setReservation(response.data);
      toast.success("Reservation checked in")
    }catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  const checkoutReservation = async () => {
    try{
      const response = await axios.put(`/reservations/checkout/${id}`);
      setReservation(response.data);
      toast.success("Reservation checked out")
    }catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  const handleShowExtendModal = () => setShowExtendModal(true);
  const handleCloseExtendModal = () => setShowExtendModal(false);
  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);
  const handleShowCheckinModal = () => setShowCheckinModal(true);
  const handleCloseCheckinModal = () => setShowCheckinModal(false);
  const handleShowCheckoutModal = () => setShowCheckoutModal(true);
  const handleCloseCheckoutModal = () => setShowCheckoutModal(false);

  const handleConfirmExtend = async () => {
    handleCloseExtendModal();
    await extendReservation();
  };
  
  const handleConfirmCancel = async () => {
    handleCloseCancelModal();
    await cancelReservation();
  };
  
  const handleConfirmCheckin = async () => {
    handleCloseCheckinModal();
    await checkinReservation();
  };
  
  const handleConfirmCheckout = async () => {
    handleCloseCheckoutModal();
    await checkoutReservation();
  };
  

  return (
    <>
    <div className='container-xxl'>
      <h2 className='m-5'>Reservation #{reservation?.id}</h2>
      <Row className="align-items-stretch">
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>Book Details</Card.Title>
              <Card.Text>
                <p>Title: {reservation?.book?.title}</p>
                <p>Author: {reservation?.book?.author}</p>
                <p>Genre: {reservation?.book?.genre}</p>
                <p>Publication Year: {reservation?.book?.publicationYear}</p>
                <p>Quantity Available: {reservation?.book?.quantityAvailable}</p>
                <p>Rating: {reservation?.book?.rating}</p>
                <p>Rating Count: {reservation?.book?.ratingCount}</p>
                <p>Rating Total: {reservation?.book?.ratingTotal}</p>
                <p>ISBN: {reservation?.book?.isbn || 'N/A'}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Card.Text>
                <div>
                <p>First Name: {reservation?.user?.firstname}</p>
                <p>Last Name: {reservation?.user?.lastname}</p>
                <p>Email: {reservation?.user?.email}</p>
                <p>Role: {reservation?.user?.role}</p>
                <p>Fine: €{reservation?.user?.fine}</p>
                <p>Enabled: {reservation?.user?.enabled ? 'Yes' : 'No'}</p>
                <p>Account Non-Expired: {reservation?.user?.accountNonExpired ? 'Yes' : 'No'}</p>
                <p>Credentials Non-Expired: {reservation?.user?.credentialsNonExpired ? 'Yes' : 'No'}</p>
                <p>Account Non-Locked: {reservation?.user?.accountNonLocked ? 'Yes' : 'No'}</p>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className='mb-5'>
            <Card.Body>
              <Card.Title>Reservation Details</Card.Title>
              
              
              <Card.Text>
                <p>Reserved At: {formatDate(reservation?.reservedAt)}</p>
                <p>Pick Up By: {formatDate(reservation?.pickUpBy)}</p>
                <p>Checked Out At: {reservation?.checkedOutAt ? formatDate(reservation?.checkedOutAt) : 'N/A'}</p>
                <p>Return Date: {formatDate(reservation?.dueDate)}</p>
                <p>Returned: {reservation?.checkedOutAt? (reservation?.returned ? 'Yes' : 'No') : 'N/A'}</p>
              </Card.Text>
                { reservation.checkedOutAt ? (
                <button onClick={() => handleShowExtendModal(reservation.id)}>Extend</button>) : <button
                disabled={!reservation.checkedOutAt}
                className={!reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >Extend</button>
                }
                { !reservation.checkedOutAt ? (
                <button onClick={() => handleShowCancelModal(reservation.id)}>Cancel</button>) : <button
                disabled={reservation.checkedOutAt}
                className={reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >Cancel</button>
                }
                { reservation.checkedOutAt ? (
                <button onClick={() => handleShowCheckinModal(reservation.id)}>Check-in</button>) : <button
                disabled={!reservation.checkedOutAt}
                className={!reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >Check-in</button>
                }
                { !reservation.checkedOutAt ? (
                <button onClick={() => handleShowCheckoutModal(reservation.id)}>Check-out</button>) : <button
                disabled={reservation.checkedOutAt}
                className={reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >Check-out</button>
                }
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Link to="/admin-reservations">
          <button className='mb-5'>Back to Reservations</button>
      </Link>
    </div>
    <Modal show={showExtendModal} onHide={handleCloseExtendModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Extend</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to extend this reservation?</Modal.Body>
  <Modal.Footer>
    <button onClick={handleConfirmExtend}>
      Extend Reservation
    </button>
    <button onClick={handleCloseExtendModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>

<Modal show={showCancelModal} onHide={handleCloseCancelModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Cancel</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to cancel this reservation?</Modal.Body>
  <Modal.Footer>
  <button onClick={handleConfirmCancel}>
      Cancel Reservation
    </button>
    <button onClick={handleCloseCancelModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>

<Modal show={showCheckinModal} onHide={handleCloseCheckinModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Checkin</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to check in this reservation?</Modal.Body>
  <Modal.Footer>
    <button onClick={handleConfirmCheckin}>
      Checkin Reservation
    </button>
    <button onClick={handleCloseCheckinModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>

<Modal show={showCheckoutModal} onHide={handleCloseCheckoutModal}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Checkout</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to check out this reservation?</Modal.Body>
  <Modal.Footer>
    <button onClick={handleConfirmCheckout}>
      Checkout Reservation
    </button>
    <button onClick={handleCloseCheckoutModal}>
      Cancel
    </button>
  </Modal.Footer>
</Modal>

    </>
  );
};


export default EditReservation

