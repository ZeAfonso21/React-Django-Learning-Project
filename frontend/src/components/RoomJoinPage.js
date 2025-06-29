import React, { useState } from "react";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function RoomJoinPage () {
        const [roomCode, setRoomCode] = useState("");
        const [error, setError] = useState("");
        const navigate = useNavigate();

        const handleTextFieldChange = (e) => {
                setRoomCode(e.target.value);
        };
        const roomButtonPressed = () => {
                const requestOptions = {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                                code: roomCode
                        })
                };
                fetch("/api/join-room", requestOptions)
                .then( async (response) => {
                        if (response.ok) {
                                navigate(`/room/${roomCode}`);
                        } else {
                                const errorData = await response.json();
                                setError(errorData["Bad Request"])
                        }
                })
                .catch((err) => console.log(err));
        };
        return (
                <Grid container spacing={1}>
                        <Grid size={{xs:12}} align="center">
                                <Typography variant="h4" component="h4">
                                        Join a Room
                                </Typography>
                        </Grid>

                        <Grid size={{xs:12}} align="center">
                                <TextField onChange={handleTextFieldChange} error={error} label="Code" placeholder="Enter a Room Code" value={roomCode} helperText={error} variant="outlined"></TextField>
                        </Grid>
                        <Grid size={{xs:12}} align="center">
                                <Button variant="contained" color="primary" onClick={roomButtonPressed}>Enter Room</Button>
                        </Grid>

                        <Grid size={{xs:12}} align="center">
                                <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
                        </Grid>
                </Grid>
        );
}

export default RoomJoinPage;