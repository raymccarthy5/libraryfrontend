import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GenreBarChart from '../components/GenreBarChart';
import ReservationsLineChart from '../components/ReservationsLineChart';
import ReservationsByBookPieChart from '../components/ReservationsByBookPieChart';
import BooksInventory from '../components/BooksInventoryBarChart';

const AdminStats = () => {
  return (
    <div>
      <h1 className="m-5">Library Statistics</h1>
      <Container>
        <Row className="mb-5">
          <Col sm={12} md={6}>
            <h2>Books Inventory</h2>
            <div style={{ minHeight: '420px' }}>
              <BooksInventory />
            </div>
          </Col>
          <Col sm={12} md={6}>
            <h2>Books Inventory by Genre</h2>
            <div style={{ minHeight: '420px' }}>
              <GenreBarChart />
            </div>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col sm={12} md={6} lg={6}>
            <h2>Reservations Over Weeks</h2>
            <div style={{ minHeight: '320px' }}>
              <ReservationsLineChart />
            </div>
          </Col>
          <Col sm={12} md={6} lg={6}>
            <h2>Reservations By Book</h2>
            <div style={{ minHeight: '420px' }}>
              <ReservationsByBookPieChart />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminStats;

