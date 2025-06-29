import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Card, Typography, IconButton, LinearProgress} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';

function MusicPlayer ({song}) {

        let songProgress= (song.time / song.duration) * 100

        const pauseSong = () =>{
                const requestOptions = {
                        method: "PUT",
                        headers: {"Content-Type":"application/json"},
                }
                fetch("/spotify/pause-song", requestOptions);
        };

        const playSong = () =>{
                const requestOptions = {
                        method: "PUT",
                        headers: {"Content-Type":"application/json"},
                }
                fetch("/spotify/play-song", requestOptions);
        };

        const skipSong = () => {
                const requestOptions = {
                        method: "POST",
                        headers: {"Content-Type":"application/json"},
                }
                fetch("/spotify/skip-song", requestOptions);
        };

        return(
                <Card sx={{width: "100%"}}>
                        <Grid container alignItems={"center"}>
                                <Grid size={{xs:4}} align="center">
                                        <img src={song.image_url} height={"100%"} width={"100%"}></img>       
                                </Grid>
                                <Grid size={{xs:8}} align="center">
                                        <Typography component={"h5"} variant="h5"> {song.title}</Typography>
                                        <Typography color="textSecondary" variant="subtitle1"> {song.artist}</Typography>
                                        <div>
                                                <IconButton onClick={() => song.is_playing? pauseSong(): playSong()}>
                                                        {song.is_playing? <PauseIcon /> : <PlayArrowIcon />}
                                                </IconButton>
                                                <IconButton onClick={skipSong}>
                                                        <SkipNextIcon /> {song.votes} / {" "} {song.votes_required}
                                                </IconButton>
                                        </div>
                                </Grid>
                        </Grid>

                        <LinearProgress variant="determinate" value={songProgress} />
                </Card>
        );
}

export default MusicPlayer


