import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const fetchAllFlights = createAsyncThunk("flights/all", async (params) => {
  const { page, limit } = params;
  const res = await fetch(
    `${HostName}/flights/all-flights?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  console.log("Data from fetch all flights =>", data);
  if (data) {
    return data;
  }
});

export { fetchAllFlights };
