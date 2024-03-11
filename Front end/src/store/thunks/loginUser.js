import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const loginInUser = createAsyncThunk("user/login", async (body) => {
    const { email, number, password } = body;

    let content;
    if (!email) {
        content = {
            number,
            password
        }
    }
    if (!number) {
        content = {
            email,
            password
        }
    }
    const res = await fetch(`${HostName}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
    });

    const data = await res.json();
    if (data) {
        return data;
    }
})

export { loginInUser };