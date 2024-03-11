import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setEmail, setFullName } from "../store/slices/userSlice";
import { fetchUserDetails } from "../store";
import CustomModal from "./CustomModal";

const Header = () => {
  const { fullName, message } = useSelector((state) => state.users);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  //Managing to fetch fullname on window reload
  useEffect(() => {
    if (jwtToken && fullName === "") {
      dispatch(fetchUserDetails());
    }
    // eslint-disable-next-line
  }, [jwtToken, fullName]);

  // Handle Sign out
  const handleSignOut = () => {
    sessionStorage.clear(); //session delete
    dispatch(setFullName(""));
    dispatch(setEmail(""));
    navigate("/login");
  };

  // Handling login
  const handleLogin = () => {
    navigate("/login");
  };

  // Alert modal handler
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (message !== "" && !isModalOpen && currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
      console.log("YES ITS RUNNING =>", message);
      setModalOpen(true);
    }
    // eslint-disable-next-line
  }, [message]);

  return (
    <header className="header-nav-container">
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={message}
      />
      <Link to={"/"} className="header-2">
        Contegris Virtual Airways
      </Link>

      {jwtToken ? (
        <div className="header-user">
          <div className="header-row">
            <FontAwesomeIcon
              icon={faUserAlt}
              style={{ color: "white", fontSize: "20px", padding: "0 10px" }}
            />
            {fullName ? fullName : "User"}
          </div>
          <button onClick={handleSignOut} className="header-btn">
            SignOut
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="header-btn">
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
