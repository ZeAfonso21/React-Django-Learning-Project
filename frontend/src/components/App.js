import React from "react";
//import { render } from "react-dom";
import ReactDOM from 'react-dom/client';
import HomePage from "./HomePage";

export default function App() {
        //console.log("hello")
        return(
        <div>
                <HomePage />
        </div>
        );  
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
