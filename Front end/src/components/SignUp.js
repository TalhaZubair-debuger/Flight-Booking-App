import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../store";
import { setMessage } from "../store/slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomModal from "./CustomModal";

const SignUp = () => {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = useSelector((state) => state.users);

  useEffect(() => {
    if (sessionStorage.getItem("jwtToken")) {
      navigate("/");
    }
    return () => {
      dispatch(setMessage(""));
    };
    // eslint-disable-next-line
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //Sign up form handlng
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Data Validation
    const numericRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z ]+$/;

    if (!nameRegex.test(fullName)) {
      dispatch(setMessage("Name can't contain numbers or special characters"));
      return;
    }

    if (!(password.length >= 5)) {
      dispatch(setMessage("Password must be minimum 5 characters"));
      return;
    }

    //Form Data Handling
    let body;
    if (numericRegex.test(loginValue)) {
      if (loginValue.length > 10 && loginValue.length < 13) {
        body = {
          number: loginValue,
          fullName,
          password,
        };
      } else {
        dispatch(setMessage("Number must be minimum 11 digits"));
        return;
      }
    } else if (emailRegex.test(loginValue)) {
      body = {
        email: loginValue,
        fullName,
        password,
      };
    } else {
      dispatch(setMessage("Wrong number or email is entered!"));
      return;
    }

    // Performing Sign Up request
    const res = await dispatch(signUpUser(body));
    console.log(res);

    if (res.payload && res.payload.userId) {
      setFullName("");
      setLoginValue("");
      setPassword("");
      setModalOpen(true);
      if (message !== "") {
        dispatch(setMessage(""));
      }
    }
  };

  const setMessageNull = () => {
    dispatch(setMessage(""));
  };
  return (
    <div className="container">
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={"User Created!"}
      />
      {message !== "" && message !== "User Created!" ? (
        <div className="error-msg-signup-login">
          <div className="Xmark" onClick={setMessageNull}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{ color: "black", fontSize: "25px" }}
            />
          </div>
          <div className="message">{message}</div>
        </div>
      ) : (
        <></>
      )}
      <div className="login-container">
        <h2>SignUp</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="login">Email or Phone Number:</label>
            <input
              type="text"
              id="login"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="minimum 5 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-login-form" type="submit">
            SignUp
          </button>
        </form>
        <div className="signup-link">
          Already have an account?
          <Link to={"/login"}>Login here</Link>
        </div>
      </div>
      <Link to={"/"} className="guestmode">
        Use in Guest Mode
      </Link>
    </div>
  );
};

export default SignUp;
