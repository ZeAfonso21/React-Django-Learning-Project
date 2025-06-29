import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room (props) {
        const {roomCode} = useParams();
        const [votesToSkip, setVotesToSkip] = useState(2);
        const [guestCanPause, setGuestCanPause] = useState(false);
        const [isHost, setIsHost] = useState(false);
        const [loaded, setLoaded] = useState(false);
        const [showSettings, setShowSettings] = useState(false);
        const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
        const [song, setSong] = useState({});
        const navigate = useNavigate();

        const authenticateSpotify = () => {
                fetch("/spotify/is-authenticated")
                .then((response) => response.json())
                .then((data) => {
                        setSpotifyAuthenticated(data.status);
                        if (!data.status){
                                fetch("/spotify/get-auth-url")
                                .then((response) => response.json())
                                .then((data) => {
                                        window.location.replace(data.url);
                                });
                        }
                });
        };

        const getRoomDetails = () => {
                console.log(roomCode);
                fetch("/api/get-room?code="+ roomCode)
                .then((response) => {
                        if(!response.ok){
                                props.leaveRoomCallBack();
                                navigate("/");
                        }
                        return response.json();
                })
                .then((data) => {
                        setVotesToSkip(data.votes_to_skip);
                        setGuestCanPause(data.guest_can_pause);
                        setIsHost(data.is_host);
                        setLoaded(true);
                        if (data.is_host) {
                                authenticateSpotify();
                        }
                });
                // const response = await fetch("/api/get-room?code=" + roomCode);
                // const data = await response.json(); 
                // console.log(data);
        };

        const getCurrentSong = () => {
                fetch("/spotify/current-song")
                .then((response) => {
                        if (!response.ok){
                                return {};
                        } else {
                                return response.json();
                        }

                })
                .then((data) => {
                        setSong(data);
                        //console.log(data);
                });
        };

        const leaveButtonPressed = () => {
                const requestOptions = {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                };
               fetch("/api/leave-room", requestOptions).then((_response) => {
                        navigate("/") 
               }) 
        };


        const updateShowSettings = (value) => {
                setShowSettings(value);
        };

        const renderSettingsButton = () => {
                return (
                        <Grid size={{xs:12}} align="center">
                                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>Settings</Button>
                        </Grid>
                );
        };

        const test = () => { console.log("test")};

        const renderSettings = () => {
                return(
                        <Grid container spacing={1}>
                                <Grid size={{xs:12}} align="center">
                                        <CreateRoomPage 
                                                update_prop={true} 
                                                votesToSkip_prop={votesToSkip} 
                                                guestCanPause_prop={guestCanPause} 
                                                roomCode_prop={roomCode} 
                                                />
                                </Grid>
                                <Grid size={{xs:12}} align="center">
                                        <Button color="secondary" variant="contained" onClick={ () =>{ 
                                                updateShowSettings(false);
                                                getRoomDetails();
                                        }} >Close Settings</Button>
                                </Grid>
                        </Grid>
                );
        }

        useEffect(() => {
                getRoomDetails();
              }, [roomCode]); 
        
        useEffect(() => {
                const interval = setInterval(getCurrentSong, 1000);

                return () => clearInterval(interval);
        }, []);

              let content;

              if (!loaded) {
                content = <p>Loading Room...</p>;
              } else if (!showSettings) {
                content = 
                <div>
                        <Grid container spacing={1} justifyContent={"center"}>
                                <Grid size={{xs:12}} align="center">
                                        <Typography variant="h4" component={"h4"}>
                                                CODE: {roomCode}
                                        </Typography>
                                </Grid>
                                <Grid size={{xs:12}}  align="center">
                                        <MusicPlayer song={song} /> 
                                </Grid>
                                {isHost ?  renderSettingsButton(): null}
                                <Grid size={{xs:12}} align="center">
                                        <Button color="primary" variant="contained" onClick={leaveButtonPressed} >Leave Room</Button>
                                </Grid>
                        </Grid>
                </div> 
                ;
              } else {
                content = renderSettings();
              }
        return (content);
}

export default Room;


