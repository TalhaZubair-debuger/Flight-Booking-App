import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";

const CustomGrid = () => {
  const [currentPageFlights, setCurrentPageFlights] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const { flights, page, searchTerm, searchedFlights } = useSelector(
    (state) => state.flights
  );
  const navigate = useNavigate();

  // handle navigate to individual flight
  const handleNavigateToFlight = (flightId) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      setModalOpen(true);
      return;
    }
    navigate(`/flight/${flightId}`);
  };

  // Filter data to display on a single page based on page number
  const displayPageData = async () => {
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5 - 1;
    console.log(startIndex, " and ", endIndex);

    const pageFlights = flights.slice(startIndex, endIndex + 1);

    let filteredFlights = pageFlights;

    if (searchTerm) {
      setCurrentPageFlights(searchedFlights);
      return;
    }

    if (filteredFlights.length > 0) {
      console.log("Filtered flights:", filteredFlights);
      setCurrentPageFlights(filteredFlights);
    } else {
      console.log("No matching flights on the current page.");
      setCurrentPageFlights([]);
    }
  };

  // handling alert modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    displayPageData();
    // eslint-disable-next-line
  }, [flights, page, searchTerm]);

  return (
    <div className="custom-grid-container">
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={"Sign in to view flight details and book seats"}
      />
      {currentPageFlights ? (
        currentPageFlights.length > 0 ? (
          currentPageFlights.map((flight) => (
            <div
              key={flight._id}
              className="grid-item"
            >
              <div>
                <b>{flight.flightName}</b>
              </div>
              <div>
                <b>Plane Type:</b> {flight.planeType}
              </div>
              <div>
                <b>Flight Stops:</b>{" "}
                {flight.flightStops.reduce((accumulator, stop, index) => {
                  return (
                    accumulator +
                    stop +
                    (index < flight.flightStops.length - 1 ? "→" : "")
                  );
                }, "")}
              </div>

              {flight.vacantSeats > 0 ? (
                <button
                  onClick={() => handleNavigateToFlight(flight._id)}
                  className="btn-home-flights"
                >
                  Book Seat(s)
                </button>
              ) : (
                <div className="disabled-btn-home-grid">Booked</div>
              )}
            </div>
          ))
        ) : (
          <div>No Data</div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomGrid;
