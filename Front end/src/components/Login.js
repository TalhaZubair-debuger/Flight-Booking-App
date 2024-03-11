import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserDetails, loginInUser } from "../store";
import { setMessage } from "../store/slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

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

  // Handling Signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Data Validation
    const numericRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!(password.length >= 5)) {
      dispatch(setMessage("Password must be minimum 5 characters"));
      return;
    }

    // Form Data Creation
    let body;
    if (numericRegex.test(loginValue)) {
      if (loginValue.length > 10 && loginValue.length < 13) {
        body = {
          number: loginValue,
          password,
        };
      } else {
        dispatch(setMessage("Number must be minimum 11 digits"));
        return;
      }
    } else if (emailRegex.test(loginValue)) {
      body = {
        email: loginValue,
        password,
      };
    } else {
      dispatch(setMessage("Wrong number or email is entered!"));
      return;
    }

    // Request Signin
    const res = await dispatch(loginInUser(body));

    // Handling payload and response according to it
    if (res.payload && res.payload.token) {
      console.log(res.payload);
      const token = res.payload.token;
      sessionStorage.setItem("jwtToken", `Bearer ${token}`);
      navigate("/");
      dispatch(fetchUserDetails());
      if (message !== "") {
        dispatch(setMessage(""));
      }
    } else {
      console.log(res.payload.message)
      dispatch(
        setMessage(
          res.payload.message
            ? res.payload.message
            : "Error signing in, try again later"
        )
      );
    }
  };

  const setMessageNull = () => {
    dispatch(setMessage(""));
  };

  return (
    <div className="container">
      {message !== "" ? (
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-login-form" type="submit">
            Login
          </button>
        </form>
        <div className="signup-link">
          No account?
          <Link to={"/signup"}>SignUp here</Link>
        </div>
      </div>
      <Link to={"/"} className="guestmode">
        Use in Guest Mode
      </Link>
    </div>
  );
};

export default Login;
