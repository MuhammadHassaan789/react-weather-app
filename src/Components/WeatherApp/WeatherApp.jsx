import React, { useState, useEffect } from 'react';
import './WeatherApp.css'

import search_icon from "../Assets/search.png"
import clear_icon from "../Assets/clear.png"
import cloud_icon from "../Assets/cloud.png"
import drizzle_icon from "../Assets/drizzle.png"
import humidity_icon from "../Assets/humidity.png"
import rain_icon from "../Assets/rain.png"
import snow_icon from "../Assets/snow.png"
import wind_icon from "../Assets/wind.png"

import clearbg_icon from "../Assets/clearr.jpg"
import cloudbg_icon from "../Assets/cloudss.jpg"
import rainbg_icon from "../Assets/rainn.jpg"
import drizzlebg_icon from "../Assets/drizzlee.jpg"
import snowbg_icon from "../Assets/snoww.jpg"

import icon_gif from '../Assets/WeatherIcons.gif';

const WeatherApp = () => {

    let api_key = "b9f438476b4dc10639b710f23d09c89c";

    const [wicon, setWicon] = useState(cloud_icon);
    const [bg, setBg] = useState(cloudbg_icon)
    const [location, setLocation] = useState(false)

    useEffect(() => {
        getLocation();
    }, []);

    function getLocation() {
        if (navigator.geolocation) {
            navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
                if (permissionStatus.state === 'denied') {
                    alert('Please allow location access.');
                    window.location.href = "app-settings:location";
                } else {
                    navigator.geolocation.getCurrentPosition(success, error);
                }
            });
        } else {
            alert('Geolocation is not supported in your browser.');
        }
    }

    const success = async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=Metric&appid=${api_key}`

        let response = await fetch(url);
        let data = await response.json();

        updateWeather(data);
    }

    const error = (error) => {
        console.error("Error getting location:", error);
    }

    const updateWeather = (data) => {
        const humidity = document.getElementsByClassName("humidity-percent")
        const wind = document.getElementsByClassName("wind-rate")
        const temperature = document.getElementsByClassName("weather-temp")
        const location = document.getElementsByClassName("weather-location")

        humidity[0].innerHTML = data.main.humidity + " %";
        wind[0].innerHTML = Math.floor(data.wind.speed) + " km/h";
        temperature[0].innerHTML = Math.floor(data.main.temp) + " °C";
        location[0].innerHTML = data.name;

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
            setWicon(clear_icon)
            setBg(clearbg_icon)
        }
        else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
            setWicon(cloud_icon)
            setBg(cloudbg_icon)
        }
        else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
            setWicon(drizzle_icon)
            setBg(drizzlebg_icon)
        }
        else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
            setWicon(drizzle_icon)
            setBg(drizzlebg_icon)
        }
        else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
            setWicon(rain_icon)
            setBg(rainbg_icon)
        }
        else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
            setWicon(rain_icon)
            setBg(rainbg_icon)
        }
        else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
            setWicon(snow_icon)
            setBg(snowbg_icon)
        }
        else {
            setWicon(clear_icon)
            setBg(clearbg_icon)
        }
    }

    const searchByCity = async (city) => {
        if (city === "") {
            return 0;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            updateWeather(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    const search = () => {
        const element = document.getElementsByClassName("cityInput");
        const city = element[0].value;
        searchByCity(city);
    }



    return (
        <div className='container' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
            <div style={{ backdropFilter: 'blur(5px)', height: '100%' }}>
                <div className="top-bar">
                    <input type="text" className='cityInput' placeholder='Search' />
                    <div className="search-icon" onClick={() => { search() }}>
                        <img src={search_icon} alt="" />
                    </div>
                </div>
                <div className="weather-image">
                    <img src={wicon} alt="" />
                </div>
                <div className="weather-temp">24°C</div>
                <div className="weather-location">London</div>
                <div className="data-container">
                    <div className="element">
                        <img src={humidity_icon} alt="" className="icon" />
                        <div className="data">
                            <div className="humidity-percent">64%</div>
                            <div className="text">Humidity</div>
                        </div>
                    </div>
                    <div className="element">
                        <img src={wind_icon} alt="" className="icon" />
                        <div className="data">
                            <div className="wind-rate">18 km/h</div>
                            <div className="text">Wind Speed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
