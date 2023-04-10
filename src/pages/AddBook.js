import React, { useState } from 'react';
import axios from '../api/axios';
import { Card, Col, Row, Form } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';

const AddBook = () => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [quantityAvailable, setQuantityAvailable] = useState('');
    const [isbn, setIsbn] = useState('');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const navigate = useNavigate();

    const rating=0;
    const ratingCount=0;
    const ratingTotal=0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitModalOpen(true);
  };

  const confirmSubmit = async () => {
    await axios.post(`/books`, {
      title,
      author,
      genre,
      publicationYear,
      quantityAvailable,
      isbn,
      rating,
      ratingCount,
      ratingTotal
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
    });
    toast.success("Book saved");
    navigate("/admin-books");
    setIsSubmitModalOpen(false);
  };
  
  const closeSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };
  
  return (
    <>
    <div className='container-xxl'>
      <h2 className='m-5'>Add Book</h2>
      <Row className="align-items-stretch">
        <Col className='mb-5'>
          <Card>
            <Card.Body>
              <Card.Title>Book Details</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="genre">
              <Form.Label>Genre</Form.Label>
              <Form.Control type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="publicationYear">
              <Form.Label>Publication Year</Form.Label>
              <Form.Control type="text" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="quantityAvailable">
              <Form.Label>Quantity Available</Form.Label>
              <Form.Control type="text" value={quantityAvailable} onChange={(e) => setQuantityAvailable(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="isbn">
              <Form.Label>ISBN</Form.Label>
              <Form.Control type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            </Form.Group>
            <button className='mt-4' type="submit">Save</button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  <Row>
    <Col className='mb-5'>
    <Link to="/admin-books">
    <button>Back to Books</button>
    </Link>
    </Col>
  </Row>
</div>
<div className="btn-container">
  <Row>
  </Row>
</div>
<ReactModal
    isOpen={isSubmitModalOpen}
    onRequestClose={closeSubmitModal}
    contentLabel="Submit confirmation"
    className="Modal"
    overlayClassName="Overlay"
  >
    <h2>Are you sure you want to save this book?</h2>
    <button onClick={confirmSubmit}>Yes</button>
    <button onClick={closeSubmitModal}>No</button>
  </ReactModal>
</>
);
};

export default AddBook;