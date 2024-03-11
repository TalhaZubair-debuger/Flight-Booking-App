import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const bookSeats = createAsyncThunk("seats/book", async (flightIds) => {

    const jwtToken = sessionStorage.getItem("jwtToken");

    console.log("Array data => ",flightIds);

    const res = await fetch(`${HostName}/flights/book-seat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${jwtToken}`
        },
        body: JSON.stringify(flightIds),
    });

    const data = await res.json();
    if (data) {
        console.log(data);
        return data;
    }
})

export { bookSeats };