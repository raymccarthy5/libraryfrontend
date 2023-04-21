import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { Card, Col, Row } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import formatDate from "../utils/formatDate";
import { Link } from 'react-router-dom';
import Stripe from "react-stripe-checkout";
import { toast } from 'react-toastify';
import ReactModal from "react-modal";

const UserAccountDetails = () => {

  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finePaid, setFinePaid] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const { id } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/id/${id}`)
      .then((res) => {
        setUser(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, finePaid]);

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
    try {
      await axios.delete(`/reservations/cancel/${reservationId}`);
      toast.success("Reservation cancelled")
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleConfirmCancelReservation = () => {
    cancelReservation(selectedReservationId);
    closeConfirmModal();
  };

  const openConfirmModal = (reservationId) => {
    setSelectedReservationId(reservationId);
    setIsConfirmModalOpen(true);
  };
  
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };  

  async function handleToken(token) {
    console.log(token);
    await axios.post("/payment/charge", "", { 
        headers: {
        token: token.id,
        amount: user?.fine,
        userId: user?.id
        },
    }).then(() => {
        toast.success("Payment Success");
        setFinePaid(true);
      }).catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const disabledStyle = {
    opacity: 0.6,
    pointerEvents: 'none',
  };

  return (
    <>
    <div className='container-xxl'>
      <h1 className='m-5'>Account Details</h1>
      <Row className="align-items-stretch">
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Card.Text>
                <div className='mb-4 mt-4'>
                <p>Account ID: {user?.id}</p>
                <p>First Name: {user?.firstname}</p>
                <p>Last Name: {user?.lastname}</p>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
                { user?.fine > 0 ? 
                <p style={{ color: "red" }}>Fine Owed: €{user?.fine}</p> : <p>Fine Owed: €{user?.fine}</p>
                }
                <p>Enabled: {user?.enabled ? 'Yes' : 'No'}</p>
                <p>Account Non-Expired: {user?.accountNonExpired ? 'Yes' : 'No'}</p>
                <p>Credentials Non-Expired: {user?.credentialsNonExpired ? 'Yes' : 'No'}</p>
                <p>Account Non-Locked: {user?.accountNonLocked ? 'Yes' : 'No'}</p>
                </div>
              </Card.Text>
              <Link to="/user-edit-details"><button>Edit Details</button></Link>
              <Link to="/change-password"><button>Change Password</button></Link>
              <Stripe
                stripeKey="pk_test_51Hs4PpDNHqlXLssuLBb1e6Diq8zmEWDewsbZ6VhDX1k1S0UNJpiZPnYPKt7mKdqqllq5QatcKnhax4ExJkoDLXvE002V3T0UDu"
                token={handleToken}
                label="Pay Your Fine"
                disabled={!user?.fine}
                style={!user?.fine ? disabledStyle : {}}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
              <td>ID: {reservation.id}</td>
              <td>{reservation.user.email}</td>
              <td>{formatDate(reservation.reservedAt)}</td>
              <td>{formatDate(reservation.pickUpBy)}</td>
              <td>{formatDate(reservation.checkedOutAt)}</td>
              <td>{formatDate(reservation.dueDate)}</td>
              <td>{reservation.returned ? "Yes" : "No"}</td>           
              <td>
              { !reservation.checkedOutAt ? (
                <button onClick={() => openConfirmModal(reservation.id)}>Cancel</button>) : <button
                disabled={reservation.checkedOutAt}
                className={reservation.checkedOutAt ? "btn btn-secondary" : "button"}
                >
                {reservation.checkedOutAt ? "Checked Out": "Cancel"}
                </button>
                }
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
      isOpen={isConfirmModalOpen}
      onRequestClose={closeConfirmModal}
      contentLabel="Confirm Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Confirm Cancel Reservation</h2>
      <p>Are you sure you want to cancel this reservation?</p>
      <button onClick={handleConfirmCancelReservation}>Yes, Cancel Reservation</button>
      <button onClick={closeConfirmModal}>No, Keep Reservation</button>
    </ReactModal>
    </>
  );
}

export default UserAccountDetails