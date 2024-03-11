import { createAsyncThunk } from "@reduxjs/toolkit";
import { HostName } from "../../utils/HostName";

const signUpUser = createAsyncThunk("user/signup", async (body) => {
    const { fullName, email, number, password } = body;

    let content;
    if (!email) {
        content = {
            number,
            fullName,
            password
        }
    }
    if (!number) {
        content = {
            email,
            fullName,
            password
        }
    }
    const res = await fetch(`${HostName}/users/signup`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
    });

    const data = await res.json();
    if (data) {
        console.log(data);
        return data;
    }
})

export { signUpUser };