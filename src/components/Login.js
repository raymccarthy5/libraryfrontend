import { useRef, useState, useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import { toast } from 'react-toastify';

const LOGIN_URL = '/auth/authenticate';

const Login = () => {
  const { setIsLoggedIn, setIsAdmin, setId } = useContext(AuthContext);

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL,
        { email, password: pwd },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log(response?.data);

      const token = response?.data?.token;
      const role = response?.data.role;
      const id = response?.data.id;

      localStorage.setItem('isAdmin', role === 'ADMIN');
      setIsAdmin(role === 'ADMIN');
      localStorage.setItem('userId', id);
      setId(id);

      setEmail('');
      setPwd('');
      setIsLoggedIn(true);
      localStorage.setItem('auth', { email, pwd, token, role, id })
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('token', token);
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      toast.error(errorMessage);
      errRef.current.focus();
    }
  }


  return (
    <>
      <section className="auth-form">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button>Sign In</button>
        </form>
        <p>
          Need an Account?<br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </>
  )
}

export default Login
