import React from 'react'
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import axios from '../api/axios';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const REGISTER_URL = '/auth/register';
const REGISTER_ADMIN_URL = '/auth/register-admin';

const AddUser = () => {

  const firstnameRef = useRef();
  const errRef = useRef();

  const [firstname, setFirstname] = useState('');
  const [validFirstname, setValidFirstname] = useState(false);
  const [firstnameFocus, setFirstnameFocus] = useState(false);

  const [lastname, setLastname] = useState('');
  const [validLastname, setValidLastname] = useState(false);
  const [lastnameFocus, setLastnameFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() =>  {
      firstnameRef.current.focus();
  }, [])

  useEffect(() => {
      const result = USER_REGEX.test(firstname);
      setValidFirstname(result);
  }, [firstname])

  useEffect(() => {
      const result = USER_REGEX.test(lastname);
      setValidLastname(result);
  }, [lastname])

  useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      setValidEmail(result);
  }, [email])

  useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      setValidPwd(result);
      const match = pwd === matchPwd;
      setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
  }, [firstname, lastname, pwd, matchPwd])

  const handleSubmit = async (e) => {
      e.preventDefault();
      const url = isAdmin ? REGISTER_ADMIN_URL : REGISTER_URL;
      const v1 = USER_REGEX.test(firstname);
      const v2 = USER_REGEX.test(lastname);
      const v3 = EMAIL_REGEX.test(email);
      const v4 = PWD_REGEX.test(pwd);
      if(!v1 || !v2 || !v3 || !v4){
          setErrMsg("Invalid Entry");
          return;
      }
      try{
          const response = await axios.post(url, 
          { 
              firstname,
              lastname,
              email,
              password: pwd
          });
          console.log(response.data);
          toast.success("User Added!")
          setSuccess(true);
      }catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred";
            toast.error(errorMessage);
      }
  }


  return (
    <>
        {success ? (
            <section className="success-page">
                <h1>Success!</h1>
                <p>
                    User Created: {email}
                </p>
                <Link to="/admin-users"><button>Back to Users</button></Link>
            </section>
        ) : (
          <section className="register-form">
            <p ref={errRef} className={errMsg ? "errmsg" : 
            "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Register User</h1>
          <form onSubmit={handleSubmit}>
              <label htmlFor="firstname">
                  Firstname:
                  <span className={validFirstname ? "valid" : "hide"}>
                      <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validFirstname || !firstname ? "hide" : "invalid"}>
                      <FontAwesomeIcon icon={faTimes} />
                  </span>
              </label>
              <input
                  type="text"
                  id="firstname"
                  ref={firstnameRef}
                  autoComplete="off"
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  aria-invalid={validFirstname ? "false" : "true"}
                  aria-describedby="firstname-note"
                  onFocus={() => setFirstnameFocus(true)}
                  onBlur={() => setFirstnameFocus(false)}
              />
              <p id="firstname-note" className={firstnameFocus && firstname && !validFirstname ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />{" "}
                  3 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores,<br /> hyphens allowed.
              </p>
      
              <label htmlFor="lastname">
                  Lastname:
                  <span className={validLastname ? "valid" : "hide"}>
                      <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validLastname || !lastname ? "hide" : "invalid"}>
                      <FontAwesomeIcon icon={faTimes} />
                  </span>
              </label>
              <input
                  type="text"
                  id="lastname"
                  autoComplete="off"
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  aria-invalid={validLastname ? "false" : "true"}
                  aria-describedby="lastname-note"
                  onFocus={() => setLastnameFocus(true)}
                  onBlur={() => setLastnameFocus(false)}
              />
              <p id="lastname-note" className={lastnameFocus && lastname && !validLastname ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                  3 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores,<br /> hyphens allowed.
              </p>
              <label htmlFor="email">
                  Email:
                  <span className={validEmail ? "valid" : "hide"}>
                      <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validEmail || !email ? "hide" : "invalid"}>
                      <FontAwesomeIcon icon={faTimes} />
                  </span>
              </label>
              <input
                  type="text"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="email-note"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
              />
              <p id="email-note" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                  Enter a valid email address.
              </p>
              <label htmlFor="password">Password:
                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                8 to 24 characters.<br />
                Must include uppercase and lowercase<br/> letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_pwd">
                Confirm Password:
                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} /> {" "}
                Must match the first password input field.
            </p>
            <div className="checkbox">
            <p>
              Admin?
            </p>
            <label>
            <input
              type="radio"
              name="admin"
              value="true"
              onChange={(e) => setIsAdmin(e.target.value === "true")}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="admin"
              value="false"
              onChange={(e) => setIsAdmin(e.target.value === "true")}
              defaultChecked
            />
            No
          </label>
          </div>
          <button disabled={!validFirstname || !validLastname || !validEmail || !validPwd || !validMatch ? true : false}>Sign Up</button>
          </form>
          </section>
          )}
          </>
    )
}

export default AddUser