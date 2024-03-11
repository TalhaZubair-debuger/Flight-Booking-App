import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const fetchUserDetails = createAsyncThunk("user/fetch", async () => {
  const jwtToken = sessionStorage.getItem("jwtToken");
  if (!jwtToken){
    console.log("no jwtToken to fetch user");
    return {error: "no jwtToken to fetch user"};
  }
  const res = await fetch(
    `${HostName}/users/get-user`,
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

export { fetchUserDetails };
