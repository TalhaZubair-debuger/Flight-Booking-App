import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFlights, searchFlights } from "../store";
import CustomTable from "./CustomTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faList,
  faRotateRight,
  faSearch,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import CustomGrid from "./CustomGrid";
import {
  setPageIncrement,
  setPageDecrement,
  setSearchTerm,
  setPageToOne,
  setSearchedFlights,
} from "../store/slices/flightsSlice";
import CustomModal from "./CustomModal";

const Home = () => {
  const [run, setRun] = useState(false);
  const [flightsView, setFlightsView] = useState("Table");
  const [isModalOpen, setModalOpen] = useState(false);
  const [flightNames, setFlightNames] = useState("");
  const [planeTypes, setPlaneTypes] = useState("");
  const [flightStops, setFlightStops] = useState("");

  const dispatch = useDispatch();
  const { flights, page, searchTerm } = useSelector((state) => state.flights);

  // Getting All flights for page 1
  const getAllFlights = async () => {
    const params = {
      page: 1,
      limit: 5,
    };
    dispatch(fetchAllFlights(params));
  };

  // Alert modal handler
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Grid and Table View Togglers
  const handleOpenGrid = () => {
    setFlightsView("Grid");
  };
  const handleOpenTable = () => {
    setFlightsView("Table");
  };

  // Pagination

  // next page handler
  const fetchNextPage = async () => {
    if (flights.length / 5 > page) {
      dispatch(setPageIncrement());
    } else {
      const params = {
        page: page + 1,
        limit: 5,
      };
      try {
        dispatch(setPageIncrement());
        const res = await dispatch(fetchAllFlights(params));
        if (res.payload.flights.length > 0) {
          console.log("OK!");
        } else {
          dispatch(setPageDecrement());
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    }
  };

  // Previous page handler
  const fetchPreviousPage = () => {
    dispatch(setPageDecrement());
  };

  // Search term handler
  const handleSearch = () => {
    const body = {
      flightNames,
      planeTypes,
      flightStops,
    };
    if (flightNames !== "" || planeTypes !== "" || flightStops !== "") {
      dispatch(searchFlights(body));
      dispatch(setSearchTerm(true));
    } else {
      dispatch(setSearchTerm(false));
    }
  };

  const reloadFlightContent = () => {
    dispatch(setPageToOne());
    getAllFlights();
    dispatch(setSearchedFlights([]));
    dispatch(setSearchTerm(false));
  };

  useEffect(() => {
    if (!run && page === 1) {
      getAllFlights();
      setRun(true);
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <div>
      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        message={"No more data available!"}
      />
      <div className="banner">
        <h1>Welcome to Contegris Virtual Airways</h1>
        <p>Find what flight you are looking for with our powerful search!</p>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Flight Names"
            value={flightNames}
            onChange={(e) => setFlightNames(e.target.value)}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Search Plane Types"
            value={planeTypes}
            onChange={(e) => setPlaneTypes(e.target.value)}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Search Flight Stops, Destinations"
            value={flightStops}
            onChange={(e) => setFlightStops(e.target.value)}
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon
              icon={faSearch}
              style={{ color: "black", fontSize: "15px" }}
            />
          </button>
        </div>
      </div>

      <div className="home-container">
        <div className="pagination">
          <div className="width-100-pos-left" onClick={reloadFlightContent}>
            <FontAwesomeIcon
              icon={faRotateRight}
              style={{ color: "black", fontSize: "15px" }}
            />
          </div>
          <div className="right-w-50">
            Toggle View
            {flightsView === "Table" && (
              <div onClick={handleOpenGrid} className="grid-table-toggle">
                <FontAwesomeIcon
                  icon={faThLarge}
                  style={{ color: "black", fontSize: "15px" }}
                />
              </div>
            )}
            {flightsView === "Grid" && (
              <div onClick={handleOpenTable} className="grid-table-toggle">
                <FontAwesomeIcon
                  icon={faList}
                  style={{ color: "black", fontSize: "15px" }}
                />
              </div>
            )}
            {searchTerm ? (
              <></>
            ) : (
              <>
                <div className="page-number">page {page}</div>
                {page === 1 ? (
                  <></>
                ) : (
                  <button
                    onClick={fetchPreviousPage}
                    className="pagination-btns"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      style={{ color: "black", fontSize: "10px" }}
                    />
                  </button>
                )}
                <button onClick={fetchNextPage} className="pagination-btns">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{ color: "black", fontSize: "10px" }}
                  />
                </button>
              </>
            )}
          </div>
        </div>
        {flightsView === "Table" ? <CustomTable /> : <CustomGrid />}
      </div>
    </div>
  );
};

export default Home;
