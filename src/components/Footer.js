import React from 'react'
import { Link } from 'react-router-dom'
import { BsYoutube, BsInstagram, BsFacebook, BsTwitter } from 'react-icons/bs'

const Footer = () => {
  return (
    <>
        <footer className='py-4'>
        <div className='container-xxl'>
                <div className='row align-items-center'>
                    <div className='col-5'>
                        <div className='footer-top-data d-flex gap-30 align-items-center text-white'>
                            <img src="images/newsletter.png" alt="newsletter" />
                            <h2>Sign Up for Newsletter!</h2>
                        </div>
                    </div>
                    <div className='col-7'>
                    <div className="input-group">
                            <input type="text" 
                            className="form-control py-1" 
                            placeholder="Your email address..." 
                            aria-label="Your email address..." 
                            aria-describedby="basic-addon2"
                            />
                            <span className="input-group-text p-2" id="basic-addon2">
                                Subscribe
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <footer className='py-4'>
            <div className='container-xxl'>
                <div className='row'>
                    <div className='col-4'>
                        <h4 className='text-white mb-4'>Contact Us</h4>
                        <div className='text-white'>
                            <address>TU Dublin
                            <br /> Tallaght
                            <br /> Ireland
                            <br /> +620 0000
                            <br /> email@example.com
                            </address>
                        </div>
                        <div className='social_icons d-flex align-items-center gap-30'>
                            <a className='text-white' href='http://www.facebook.com'><BsFacebook className='fs-4' /></a>
                            <a className='text-white' href='http://www.instagram.com'><BsInstagram className='fs-4' /></a>
                            <a className='text-white' href='http://www.twitter.com'><BsTwitter className='fs-4' /></a>
                            <a className='text-white' href='http://www.youtube.com'><BsYoutube className='fs-4' /></a>
                        </div>
                    </div>
                    <div className='col-3'>
                        <h4 className='text-white mb-4'>Information</h4>
                        <div className='footer-links d-flex flex-column'>
                            <Link className='text-white py-2 mb-1'>Privacy Policy</Link>
                            <Link className='text-white py-2 mb-1'>Refund Policy</Link>
                            <Link className='text-white py-2 mb-1'>Shipping Policy</Link>
                            <Link className='text-white py-2 mb-1'>Terms of Service</Link>
                        </div>
                    </div>
                    <div className='col-3'>
                        <h4 className='text-white mb-4'>Account</h4>
                        <div className='footer-links d-flex flex-column'>
                            <Link to="/about" className='text-white py-2 mb-1'>About Us</Link>
                            <Link className='text-white py-2 mb-1'>FAQ</Link>
                            <Link to="/contact" className='text-white py-2 mb-1'>Contact</Link>
                            <Link className='text-white py-2 mb-1'>Search</Link>
                        </div>
                    </div>
                    <div className='col-2'>
                        <h4 className='text-white mb-4'>Quick Links</h4>
                        <div className='footer-links d-flex flex-column'>
                            <Link className='text-white py-2 mb-1'>Most Popular</Link>
                            <Link className='text-white py-2 mb-1'>Top Rated</Link>
                            <Link className='text-white py-2 mb-1'>Recommended for You!</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <footer className='py-4'>
            <div className='container-xxl'>
                <div className='row'>
                    <div className='col-12'>
                        <p className='text-center mb-0 text-white'>&copy; {new Date().getFullYear()}; Raymond McCarthy</p>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer