import { useRef, useState, useEffect, useContext } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { toast } from "react-toastify";
import ReactModal from "react-modal";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ChangePassword = () => {
    const errRef = useRef();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


    const { id } = useContext(AuthContext);


    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd])

    const handleSubmit = async (e) => {
        closeConfirmModal();
        const v4 = PWD_REGEX.test(pwd);
        if(!v4){
            setErrMsg("Invalid Entry");
            return;
        }
        try{
            const response = await axios.post("/auth/update-password", 
            { 
                id: id,
                password: pwd
            });
            console.log(response.data);
            setSuccess(true);
        }catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An error occurred";
            toast.error(errorMessage);
            errRef.current.focus();
        }
    }

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };
    
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    return (
        <>
        {success ? (
            <>
            <section className="success-page">
                <h1>Success!</h1>
                <p>
                    Password Updated!
                </p>
            </section>
            <Link to="/user-account-details">
            <button className="m-5">Back to Account Details</button>
            </Link>
            </>
        ) : (
            <>
        <section className="register-form">
            <p ref={errRef} className={errMsg ? "errmsg" : 
            "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Change Password</h1>
            <form onSubmit={(e) => { e.preventDefault(); openConfirmModal(); }}>

                <label htmlFor="password">
                            Password:
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

                <button disabled={!validPwd || !validMatch ? true : false}>Submit</button>

            </form>
            
        </section>
        <ReactModal
            isOpen={isConfirmModalOpen}
            onRequestClose={closeConfirmModal}
            contentLabel="Confirm Modal"
            className="Modal"
            overlayClassName="Overlay"
            >
            <h2>Confirm Change Password</h2>
            <p>Are you sure you want to change your password?</p>
            <div className="ModalButtons">
                <button onClick={handleSubmit}>Yes, Change Password</button>
                <button onClick={closeConfirmModal}>Cancel</button>
            </div>
        </ReactModal>

        <Link to="/user-account-details">
        <button className="m-5">Back to Account Details</button>
        </Link>
        </>
        )}
        </>
    )
}

export default ChangePassword