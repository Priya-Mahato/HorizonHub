import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
    let [city, setCity] = useState("");
    let [error, setError] = useState(false);

    // Load API URL and Key from environment variables
    const API_URL = import.meta.env.VITE_API_URL;
    const API_KEY = import.meta.env.VITE_API_KEY;

    console.log("API_URL:", API_URL, "API_KEY:", API_KEY); // Debugging API Key & URL

    const getWeatherInfo = async () => {
        try {
            let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            let jsonResponse = await response.json();

            if (!response.ok) {
                console.error("API Error:", jsonResponse);
                throw new Error(jsonResponse.message || "Unknown API error");
            }

            // Extract timezone offset (in seconds)
            const timezoneOffset = jsonResponse.timezone;

            // Function to format time correctly in AM/PM format
            const formatTimeAMPM = (timestamp) => {
                return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "UTC", // Adjusts based on timezone offset
                });
            };

            // Function to convert wind speed from m/s to km/h
            const convertMpsToKmph = (mps) => (mps * 3.6).toFixed(2);

            let result = {
                city: jsonResponse.name,
                temp: jsonResponse.main.temp,
                humidity: jsonResponse.main.humidity,
                feelsLike: jsonResponse.main.feels_like,
                weather: jsonResponse.weather[0].description,
                sunrise: formatTimeAMPM(jsonResponse.sys.sunrise),
                sunset: formatTimeAMPM(jsonResponse.sys.sunset),
                windSpeed: convertMpsToKmph(jsonResponse.wind.speed), // Fixed conversion
            };

            console.log(result);
            return result;
        } catch (err) {
            throw err;
        }
    };

    const handleChange = (evt) => {
        setCity(evt.target.value);
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setCity("");
        try {
            let newInfo = await getWeatherInfo();
            updateInfo(newInfo);
            setError(false); // Fix: Hide error message after successful search
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="SearchBox">
            <form onSubmit={handleSubmit}>
                <TextField
                    id="city"
                    label="City Name"
                    variant="outlined"
                    required
                    value={city}
                    onChange={handleChange}
                />
                <br />
                <br />
                <Button variant="contained" type="submit">
                    Search
                </Button>
                {error && <p style={{ color: "red" }}>Location not available in our API! Refresh to remove msg.</p>}
            </form>
        </div>
    );
}
