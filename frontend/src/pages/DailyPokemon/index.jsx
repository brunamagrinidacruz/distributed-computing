import React from "react";
import Navbar from "../../components/Navbar";

import './style.scss';

export default function DailyPokemon() {

    return (
        <div>
            <Navbar />
            <div className="dailyPokemon">
            <h1>Congratulations, you've won a new daily pokemon!</h1>

            </div>
                        
        </div>
    )
}