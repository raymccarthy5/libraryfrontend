import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { Card, Col, Row } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import formatDate from "../components/formatDate";
import { toast } from 'react-toastify';
import ReactModal from "react-modal";
import StarRating from '../components/StarRating';

const UserReservations = () => {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancelReservationModalOpen, setIsCancelReservationModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [isRateBookModalOpen, setIsRateBookModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);

  const { id } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/reservations/userId/${id}`)
      .then((res) => {
        setReservations(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const cancelReservation = async (reservationId) => {
    closeCancelReservationModal();
    try {
      await axios.delete(`/reservations/cancel/${reservationId}`);
      toast.success("Reservation Cancelled!");
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const openCancelReservationModal = (reservationId) => {
    setSelectedReservationId(reservationId);
    setIsCancelReservationModalOpen(true);
  };
  
  const closeCancelReservationModal = () => {
    setIsCancelReservationModalOpen(false);
  };

  const rateBook = async (bookId, userId) => {
    if (currentRating > 0) {
      try {
        await axios.post(`/rate/book/${bookId}`, { userId, rating: currentRating });
        toast.success("Book Rated!");
        closeRateBookModal();
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
      }
    }
  };   

  const openRateBookModal = (bookId) => {
    setSelectedBookId(bookId);
    setIsRateBookModalOpen(true);
  };
  
  const closeRateBookModal = () => {
    setIsRateBookModalOpen(false);
  };
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className='container-xxl'>
      <h1 className='m-5'>Your Reservations</h1>
      <Row>
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>Reservations</Card.Title>
              <Card.Text>
              <table>
              <thead>
                  <tr>
                  <th>ID</th>
                  <th>Title</th>
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
              <td>ID: {reservation.id}</td>
              <td>{reservation.book.title}</td>
              <td>{formatDate(reservation.reservedAt)}</td>
              <td>{formatDate(reservation.pickUpBy)}</td>
              <td>{formatDate(reservation.checkedOutAt)}</td>
              <td>{formatDate(reservation.dueDate)}</td>
              <td>{reservation.returned ? "Yes" : "No"}</td>           
              <td>
              { !reservation.checkedOutAt ? (
                <button onClick={() => openCancelReservationModal(reservation.id)}>Cancel</button>) : <button
                disabled={reservation.checkedOutAt}
                className={reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >
                Cancel
                </button>
                }
                <button onClick={() => openRateBookModal(reservation.book.id)}>Rate</button>
              </td>
              </tr>
              ))}
              </tbody>
              </table>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    <ReactModal
      isOpen={isCancelReservationModalOpen}
      onRequestClose={closeCancelReservationModal}
      contentLabel="Cancel Reservation Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Confirm Cancel Reservation</h2>
      <p>Are you sure you want to cancel this reservation?</p>
      <button onClick={() => cancelReservation(selectedReservationId)}>Yes, Cancel Reservation</button>
      <button onClick={closeCancelReservationModal}>Cancel</button>
    </ReactModal>
    <ReactModal
      isOpen={isRateBookModalOpen}
      onRequestClose={closeRateBookModal}
      contentLabel="Rate Book Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Rate Book</h2>
      <StarRating
        rating={currentRating}
        onRatingChange={setCurrentRating}
        starDimension="20px"
        starSpacing="0px"
      />
      <button onClick={() => rateBook(selectedBookId, id)}>Submit Rating</button>
      <button onClick={closeRateBookModal}>Cancel</button>
    </ReactModal>
    </>
  );
}

export default UserReservations;