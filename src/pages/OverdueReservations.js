import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import formatDate from '../utils/formatDate';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';


const OverdueBooks = () => {

  const [loading, setLoading] = useState(false);
  const [overdueReservations, setOverdueReservations] = useState([]);
  const [overduePickups, setOverduePickups] = useState([]);
  const [purged, setPurged] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/reservations/overdue-checkins')
      .then((res) => {
        setOverdueReservations(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('/reservations/overdue-pickups')
      .then((res) => {
        setOverduePickups(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
        setLoading(false);
      });
  }, [purged]);

  const purgeNonPickedUpReservations = async () => {
    try{
      setPurged(false);
      axios.get('/reservations/purge-non-picked-up');
        setPurged(true);
        toast.success('Overdue Pick-ups Purged');
      }
      catch(err) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred";
        toast.error(errorMessage);
      }
  };

  const handleTabClick = (index) => {
    setTabIndex(index);
  };

  const handleClosePurgeModal = () => setShowPurgeModal(false);
  const handleShowPurgeModal = () => setShowPurgeModal(true);
  const handleConfirmPurge = async () => {
    await purgeNonPickedUpReservations();
    handleClosePurgeModal();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>

    <Tabs selectedIndex={tabIndex} onSelect={handleTabClick}>
      <TabList>
        <Tab>Overdue Returns</Tab>
        <Tab>Overdue Pick-ups</Tab>
      </TabList>

    <TabPanel>
    <div className="container-xxl mt-2">
    <h2 className='m-5'>Overdue Returns</h2>
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
          {overdueReservations && overdueReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.user.email}</td>
              <td>{formatDate(reservation.reservedAt)}</td>
              <td>{formatDate(reservation.pickUpBy)}</td>
              <td>{formatDate(reservation.checkedOutAt)}</td>
              <td>{formatDate(reservation.dueDate)}</td>
              <td>{reservation.returned ? "Yes" : "No"}</td>
              <td>
                <Link to={`/edit-reservation/${reservation.id}`}>
                  <button>Manage</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </TabPanel>
    <TabPanel>
    <div className="container-xxl mt-2">
    <h2 className='m-5'>Overdue Pick-ups</h2>
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
          {overduePickups && overduePickups.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.user.email}</td>
              <td>{formatDate(reservation.reservedAt)}</td>
              <td>{formatDate(reservation.pickUpBy)}</td>
              <td>{formatDate(reservation.checkedOutAt)}</td>
              <td>{formatDate(reservation.dueDate)}</td>
              <td>{reservation.returned ? "Yes" : "No"}</td>
              <td>
                <Link to={`/edit-reservation/${reservation.id}`}>
                  <button>Manage</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='m-5' onClick={handleShowPurgeModal}>Purge non pick-ups</button>
    </div>
    </TabPanel>
    </Tabs>
    <Modal show={showPurgeModal} onHide={handleClosePurgeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Purge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to purge all non-picked-up reservations?
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleConfirmPurge}>
          Purge Non-Picked-Up Reservations
        </button>
        <button onClick={handleClosePurgeModal}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default OverdueBooks;
