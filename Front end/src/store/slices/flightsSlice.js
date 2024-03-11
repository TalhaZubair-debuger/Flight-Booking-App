import { createSlice } from "@reduxjs/toolkit";
import { fetchAllFlights } from "../thunks/fetchAllFlights";
import { fetchFlight } from "../thunks/fetchFlight";
import { bookSeats } from "../thunks/bookSeats";
import { searchFlights } from "../thunks/searchFlights";

const initialState = {
  flights: [],
  searchedFlights: [],
  isLoading: false,
  error: "",
  message: "",
  data: {},
  page: 1,
  limit: 5,
  searchTerm:false,
};

const flighsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setFlights: (state, action) => {
      state.flights.push(...action.payload);
    },
    setPageIncrement: (state, action) => {
      state.page = state.page + 1;
    },
    setPageToOne: (state, action) => {
      state.page = 1;
    },
    setPageDecrement: (state, action) => {
      state.page = state.page - 1;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchedFlights: (state, action) => {
      state.searchedFlights = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchAllFlights.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllFlights.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.page === 1) {
        state.flights = action.payload.flights;
      } else {
        state.flights.push(...action.payload.flights);
      }
    });
    builder.addCase(fetchAllFlights.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
      state.message = action.payload;
    });

    builder.addCase(fetchFlight.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFlight.fulfilled, (state, action) => {
      if (action.payload.message) {
        state.message = action.payload.message;
      }
      state.data = action.payload;
      state.isLoading = true;
    });
    builder.addCase(fetchFlight.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
      state.message = action.payload;
    });

    builder.addCase(bookSeats.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(bookSeats.fulfilled, (state, action) => {
      console.log(action.payload.message);
      state.message = action.payload.message;
      state.isLoading = false;
    });
    builder.addCase(bookSeats.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });

    builder.addCase(searchFlights.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(searchFlights.fulfilled, (state, action) => {
      console.log(action.payload.flights);
      state.searchedFlights = action.payload.flights;
      state.isLoading = false;
    });
    builder.addCase(searchFlights.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    })
  },
});

export const flightReducer = flighsSlice.reducer;

export const {
  setFlights,
  setPageIncrement,
  setPageDecrement,
  setLimit,
  setSearchTerm,
  setPageToOne,
  setSearchedFlights
} = flighsSlice.actions;
