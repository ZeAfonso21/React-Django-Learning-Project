import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { Link } from "react-router-dom"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Collapse, Alert} from "@mui/material";

function CreateRoomPage ({
        votesToSkip_prop = 2,
        guestCanPause_prop = true,
        update_prop = false,
        roomCode_prop = null,
}) {
        const [guestCanPause, setGuestCanPause] = useState(guestCanPause_prop);
        const [votesToSkip, setVotesToSkip] = useState(votesToSkip_prop);
        const [errorMsg, setErrorMsg] = useState("");
        const [successMsg, setSuccessMsg] = useState("");
        const navigate = useNavigate();

        const handleVotesChanged = (e) => {
                setVotesToSkip(e.target.value)
        };

        const handleGuestCanPauseChange = (e) => {
                setGuestCanPause(e.target.value === "true" ? true: false)
        };

        const handleRoomButtonPressed = () => {
                // console.log(`GuestCanPause: ${guestCanPause}, VotesToSkip: ${votesToSkip}`)
                const requestOptions = {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                                votes_to_skip: votesToSkip,
                                guest_can_pause: guestCanPause
                        })
                };
                fetch("/api/create-room", requestOptions)
                .then((response) => response.json())
                .then((data) => navigate(`/room/${data.code}`) );
        };

        const handleUpdateButtonPressed = () => {
                const requestOptions = {
                        method: "PATCH",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                                votes_to_skip: votesToSkip,
                                guest_can_pause: guestCanPause,
                                code: roomCode_prop
                        })
                };
                fetch("/api/update-room", requestOptions)
                .then((response) => {
                        if (response.ok){
                                setSuccessMsg("Room Updated Successfully!");
                        } else{
                                setErrorMsg("Error Updating the Room...");
                        }
                });
        };

        const renderCreateButtons = () => {
                return (
                        <Grid container spacing={1}>
                                <Grid size={{ xs: 12}} align="center">
                                        <Button color="secondary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
                                </Grid>

                                <Grid size={{ xs: 12}} align="center">
                                        <Button color="primary" variant="contained" to="/" component={Link}>Back</Button>
                                </Grid>
                        </Grid>
                );
        };

        const renderUpdateButtons = () => {
                return(
                        <Grid size={{ xs: 12}} align="center">
                                <Button color="secondary" variant="contained" onClick={handleUpdateButtonPressed}>Update Room</Button>
                        </Grid>
                );

        };


        const title = update_prop ? "Update Room" : "Create Room";

        return (
                <Grid container spacing={1} justifyContent="center" alignItems="center">

                        <Grid size={{ xs: 12}} align="center">
                                <Collapse in={errorMsg != "" || successMsg != ""}>
                                {successMsg != "" ? (<Alert severity="success" onClose={() => setSuccessMsg("")} >{successMsg}</Alert>): 
                                (<Alert severity="error" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>) }
                                </Collapse>
                        </Grid>

                        <Grid size={{ xs: 12}} align="center">
                                <Typography variant="h4" component="h4">
                                        {title}
                                </Typography>
                        </Grid>

                        <Grid size={{ xs: 12}} align="center">
                                <FormControl component="fieldset">
                                        <FormHelperText>
                                                <div align="center">
                                                        Guest Control of Playback State
                                                </div>
                                        </FormHelperText>
                                        <RadioGroup row defaultValue={guestCanPause_prop.toString()} onChange={handleGuestCanPauseChange}>
                                                <FormControlLabel value="true" control={<Radio color="primary"/>} label="Play/Pause" labelPlacement="bottom" />
                                                <FormControlLabel value="false" control={<Radio color="secondary"/>} label="No Control" labelPlacement="bottom"/>
                                        </RadioGroup>
                                </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12}} align="center">
                                <FormControl>
                                        <TextField required type="number" defaultValue={votesToSkip} inputProps={{
                                                min: 1,
                                                style: {textAlign: "center"}
                                        }} onChange={handleVotesChanged}/>
                                        <FormHelperText>
                                                <div align="center">Votes Required to Skip Song</div>
                                        </FormHelperText>
                                </FormControl>
                        </Grid>
                        
                        {update_prop ? renderUpdateButtons(): renderCreateButtons()}

                </Grid>
        );
}

export default CreateRoomPage;