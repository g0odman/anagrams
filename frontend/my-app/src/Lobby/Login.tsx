import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import React, { useState } from "react";
import "./Login.css";

export default function Login() {
    const [userName, setUserName] = useState("");

    function validateForm() {
        return userName.length > 0;
    }
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setUserName(event.target.value)
    }
    function handleSubmit(event: React.SyntheticEvent) {
        console.log("Logging into " + userName);
        event.preventDefault();
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <InputLabel htmlFor="my-input">User Name</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" onChange={handleChange} />
                    <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>

                <Button type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </form>
        </div>
    );
}