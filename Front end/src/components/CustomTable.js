import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomModal from "./CustomModal";

const CustomTable = () => {
  const [currentPageFlights, setCurrentPageFlights] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const { flights, page, searchTerm, searchedFlights } = useSelector(
    (state) => state.flights
  );
  const navigate = useNavigate();

  // Handling navigation to individual flights
  const handleNavigateToFlight = (flightId) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      setModalOpen(true);
      return;
    }
    navigate(`/flight/${flightId}`);
  };

  // handling alert modal
  const handleCloseModal = () => {
    setModalOpen(false);
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

  useEffect(() => {
    displayPageData();
    // eslint-disable-next-line
  }, [flights, page, searchTerm, searchedFlights]);

  return (
    <>
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={"Sign in to view flight details and book seats"}
      />
      <table>
        <thead className="table-header-top">
          <tr>
            <th>Flight Name</th>
            <th>Plane Type</th>
            <th>Flight Time</th>
            <th>Flight Stops</th>
            <th>Vacant Seats</th>
            <th>Destination</th>
            <th>Book</th>
          </tr>
        </thead>
        <tbody>
          {currentPageFlights ? (
            currentPageFlights.length > 0 ? (
              currentPageFlights.map((flight) => (
                <tr key={flight._id}>
                  <td>{flight.flightName}</td>
                  <td>{flight.planeType}</td>
                  <td>{flight.flightTime}</td>
                  <td>
                    {flight.flightStops.reduce((accumulator, stop, index) => {
                      return (
                        accumulator +
                        stop +
                        (index < flight.flightStops.length - 1 ? "→" : "")
                      );
                    }, "")}
                  </td>
                  <td>{flight.vacantSeats}</td>
                  <td>{flight.destination}</td>
                  <td>
                    {flight.vacantSeats > 0 ? (
                      <button
                        onClick={() => handleNavigateToFlight(flight._id)}
                        className="btn-home-flights"
                      >
                        Book Seat(s)
                      </button>
                    ) : (
                      <>Booked</>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No Data</td>
              </tr>
            )
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CustomTable;
