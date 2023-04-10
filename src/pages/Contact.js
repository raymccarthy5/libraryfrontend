import React from 'react';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <div className="row gap-30">
          <div className="col-lg-6">
            <h2>Address</h2>
            <p>TU Dublin</p>
            <p>Tallaght</p>
            <p>Dublin</p>
            <p>Ireland</p>
          </div>
          <div className="col-lg-6">
            <h2>Contact Information</h2>
            <p>Phone: +620 0000</p>
            <p>Email: email@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;