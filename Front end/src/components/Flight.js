import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookSeats, fetchFlight } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import CustomModal from "./CustomModal";
import Seat from "./Seat";

const Flight = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage]  = useState("");
  
  const { data, message } = useSelector((state) => state.flights);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  // Verify session and fetch flight and seats data
  useEffect(() => {
    if (!sessionStorage.getItem("jwtToken")) {
      navigate("/login")
    }
    dispatch(fetchFlight(id));
    // eslint-disable-next-line
  }, []);


  // Alert modal handler
  const handleCloseModal = () => {
    setAlertMessage("");
    setModalOpen(false);
  };

  // Adding seat Ids to array
  const handleAddSeatsToBooking = (seatId) => {
    console.log("Ok! =>", seatId);
    const seatExist = selectedSeats.filter((seat) => seat === seatId);
    console.log(seatExist);
    if (seatExist.length > 0) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Sending seat Ids array to finalize booking
  const handleSeatsBooking = async () => {
    if (selectedSeats.length > 0) {
      await dispatch(bookSeats(selectedSeats));
      dispatch(fetchFlight(id));
      setSelectedSeats([]);
      setAlertMessage(message || "Seat(s) booked");
      setModalOpen(true);
    } else {
      setAlertMessage("Please select seat first!")
      setModalOpen(true);
    }
  };

  return (
    <div className="container">
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={alertMessage}
      />
      <div className="flight-info-container">
        <div className="heading-flight">
          {data ? (data.flight ? data.flight.flightName : null) : null}
        </div>
        <div className="flight-details">
          <div className="flight-detail-item">
            <b>Plane Type:</b>{" "}
            {data ? (data.flight ? data.flight.planeType : null) : null}
          </div>
          <div className="flight-detail-item">
            <b>Flight Time:</b>{" "}
            {data ? (data.flight ? data.flight.flightTime : null) : null}
          </div>
          <div className="flight-detail-item">
            <b>Total Seats:</b>{" "}
            {data ? (data.flight ? data.flight.totalSeats : null) : null}
          </div>
          <div className="flight-detail-item">
            <b>Vacant Seats:</b>{" "}
            {data ? (data.flight ? data.flight.vacantSeats : null) : null}
          </div>
          <div className="flight-detail-item">
            <b>Flight Stops:</b>{" "}
            {data ? data.flight ? data.flight.flightStops.reduce((accumulator, stop, index) => {
              return (
                accumulator +
                stop +
                (index < data.flight.flightStops.length - 1 ? "→" : "")
              );
            }, "") : null : null}
          </div>
          <div className="flight-detail-item">
            <b>Destination:</b>{" "}
            {data ? (data.flight ? data.flight.destination : null) : null}
          </div>
        </div>
      </div>

      <div className="seats-container">
        <div className="heading-flight">Flight Seats</div>

        <div className="seats-info">
          <div className="vancant-seats">
            <div className="whitebgc"> o </div>
            <div>Vacant Seats</div>
          </div>

          <div className="vancant-seats">
            <div className="orangebgc"> o </div>
            <div>Occupied Seats</div>
          </div>

          <div className="vancant-seats">
            <div className="bluebgc"> o </div>
            <div>Selected Seats</div>
          </div>
        </div>

        <div className="seats">
          <div className="economy">
            <div className="header-seats">Economy</div>
            <div className="row">
              {data
                ? data.seats
                  ? data.seats.map((seat) =>
                    seat.seatType === "Economy" ? (
                      <Seat key={seat._id} seat={seat} handleAddSeatsToBooking={handleAddSeatsToBooking} selectedSeats={selectedSeats}/>
                    ) : null
                  )
                  : null
                : null}
            </div>
          </div>
          <div className="business">
            <div className="header-seats">Business</div>
            <div className="row">
              {data
                ? data.seats
                  ? data.seats.map((seat) =>
                    seat.seatType === "Business" ? (
                      <Seat key={seat._id} seat={seat} handleAddSeatsToBooking={handleAddSeatsToBooking} selectedSeats={selectedSeats}/>
                    ) : null
                  )
                  : null
                : null}
            </div>
          </div>
        </div>

        <div className="booking-btn-span">
          <button
            onClick={handleSeatsBooking}
            className={`btn-book-seats ${selectedSeats.length === 0 ? "disableBtn" : "orange"
              }`}
          >
            Book Seat(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flight;
