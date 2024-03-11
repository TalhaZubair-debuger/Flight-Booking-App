import { createSlice } from "@reduxjs/toolkit";
import { signUpUser } from "../thunks/signUpUser";
import { loginInUser } from "../thunks/loginUser";
import { fetchUserDetails } from "../thunks/fetchUserDetails";

const initialState = {
    fullName: "",
    email: "",
    number: 0,
    password: "",
    isLoading: false,
    error: "",
    message: "",
    data: ""
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setFullName: (state, action) => {
            state.fullName = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setNumber: (state, action) => {
            state.number = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(signUpUser.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            console.log(action.payload.message);
            state.message = action.payload.message;
            state.isLoading = false;
        })
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        builder.addCase(loginInUser.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(loginInUser.fulfilled, (state, action) => {
            state.message = "";
            state.data = action.payload;
            state.isLoading = false;
        })
        builder.addCase(loginInUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        builder.addCase(fetchUserDetails.pending, (state, action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchUserDetails.fulfilled, (state, action)=>{
            state.email = action.payload ? action.payload.user ? action.payload.user.email : "" : "";
            state.fullName = action.payload ? action.payload.user ? action.payload.user.fullName : "" : "";
            state.isLoading = false;
            console.log(action.payload.message)
            if (action.payload.message){
                state.message = action.payload.message ? action.payload.message : "";
            }
        })
        builder.addCase(fetchUserDetails.rejected, (state, action)=>{
            state.error = action.error;
            state.isLoading = false;
        })
    }
})

export const userReducer = userSlice.reducer;

export const {setMessage, setData, setFullName, setEmail} = userSlice.actions;