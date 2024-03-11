import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const fetchFlight = createAsyncThunk("flight/one", async (flightId) => {
  const jwtToken = sessionStorage.getItem("jwtToken");
  const res = await fetch(
    `${HostName}/flights/get-flight/${flightId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${jwtToken}`
      },
    }
  );

  const data = await res.json();
  if (data) {
    return data;
  }
});

export { fetchFlight };
