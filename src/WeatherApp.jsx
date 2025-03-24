import "./WeatherApp.css";
import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import { useState } from "react";


export default function WeatherApp() {
    const [weatherInfo, setWeatherInfo] = useState({
        city: "Delhi",
        feelsLike: 28.34,
        temp: 25.05,
        sunrise: "05:06 AM",
        sunset: "06:00 PM",
        humidity: 47,
        weather: "haze",
        windSpeed: "3.32",
    });

    let updateInfo = (newInfo) => {
        setWeatherInfo(newInfo);
    }

    return (
        <div className="WeatherApp">
            <h2>HorizonHub</h2>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo}/>
        </div>
    );
}