import React, {useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { BrowserRouter as Router , Routes, Route, Link, Navigate} from "react-router-dom"

function RenderHomePage (props) {
        if (!props.code){
                return (
                        
                        <Grid container spacing={3}>
                                <Grid size={{xs:12}} align="center">
                                        <Typography variant="h3" component={"h3"}>
                                                House Party!
                                        </Typography>
                                </Grid>

                                <Grid size={{xs:12}} align="center">
                                        <ButtonGroup disableElevation variant="contained" color="primary">
                                                <Button color="primary" to="/join" component={Link}>Join a Room</Button>
                                                <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
                                        </ButtonGroup>
                                </Grid>
                        </Grid>
                );
        } else {
                return <Navigate to={`/room/${props.code}`} replace={true}/>
                // return <p>{props.code}</p>;
        }
}
function HomePage() {

        const[roomCode, setRoomCode] = useState(null);

        const clearRoomCode = () => {
                setRoomCode(null);
        };

        useEffect( async () =>{
                fetch("/api/user-in-room")
                .then((response) => response.json())
                .then((data) => {
                        setRoomCode(data.code)
                })
        }, []);
        return(
                <Router>
                        <Routes>
                                <Route path="/" element={<RenderHomePage code={roomCode} />} />
                                <Route path="/join" element={<RoomJoinPage />}/>
                                <Route path="/create" element={<CreateRoomPage />}/>
                                <Route path="/room/:roomCode" element={<Room leaveRoomCallBack={clearRoomCode} />} />
                        </Routes>
                </Router>
        );
}

export default HomePage;
