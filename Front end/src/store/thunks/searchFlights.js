import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const searchFlights = createAsyncThunk("flights/search", async (body) => {
  const res = await fetch(`${HostName}/flights/search-flights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log("Data from search flights =>", data);
  if (data) {
    return data;
  }
});

export { searchFlights };
