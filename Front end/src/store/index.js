import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userSlice";
import { flightReducer } from "./slices/flightsSlice";

export const store = configureStore({
  reducer: {
    flights: flightReducer,
    users: userReducer,
  },
});

export * from "./thunks/signUpUser";
export * from "./thunks/loginUser";
export * from "./thunks/fetchAllFlights";
export * from "./thunks/fetchFlight";
export * from "./thunks/bookSeats";
export * from "./thunks/fetchUserDetails";
export * from "./thunks/searchFlights";