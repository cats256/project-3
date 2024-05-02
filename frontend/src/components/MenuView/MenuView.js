/**
 * Represents a component for displaying menu items and weather information.
 * Displays a grid of menu items with images and prices, along with weather information.
 * @module MenuView
 */

import { CircularProgress, Pagination } from "@mui/material";
import { Clock } from "digital-clock-react";
import * as React from "react";
import { useEffect, useState } from "react";
import ReactWeather from "react-open-weather";

import "./MenuView.css";

/**
 * A React component for displaying menu items and weather information.
 * @param {Object} props - The component properties.
 * @param {Object} props.weatherData - Weather data to be displayed.
 * @param {boolean} props.isWeatherLoading - Flag indicating whether weather data is being loaded.
 * @param {string} props.weatherErrorMessage - Error message in case of weather data loading failure.
 * @param {Object} props.translatedMenuItems - Translated menu items to be displayed.
 * @returns {JSX.Element} The rendered component.
 */
const MenuView = ({
    weatherData,
    isWeatherLoading,
    weatherErrorMessage,
    translatedMenuItems,
}) => {
    // State hook for managing the currently displayed page
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Interval for automatic page change every 5 seconds
        const timerId = setInterval(() => {
            setPage((prevPage) =>
                (prevPage + 1) % 8 === 0 ? 1 : prevPage + 1
            );
        }, 5000);

        // Clear interval on component unmount
        return () => {
            clearInterval(timerId);
        };
    }, []);

    // Render loading spinner if translatedMenuItems is not available yet
    if (!translatedMenuItems) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    // Generate grid items for menu items
    const gridItems = Object.keys(translatedMenuItems).flatMap((type) => [
        ...translatedMenuItems[type].map((item, index) => (
            <div key={type + index} className="grid-item">
                <img
                    src={"/square_image.jpg"}
                    alt={item.translatedName + " Image"}
                />
                <div
                    style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        textAlign: "center",
                    }}
                >
                    {item.translatedName.toUpperCase()} - ${item.price}
                </div>
            </div>
        )),
    ]);

    // Generate empty grid items to fill the grid
    const emptyItems = Array.from(
        { length: 48 - gridItems.length },
        (_, index) => (
            <div key={`empty-${index}`} className="grid-item">
                &nbsp;
            </div>
        )
    );

    gridItems.push(...emptyItems);

    return (
        <div
            style={{
                height: "100vh",
                padding: "32px 32px 0px 32px",
                fontFamily:
                    'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* Render weather information or menu items based on page */}
            {page === 1 ? (
                <div
                    style={{
                        height: "80%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ReactWeather
                        isLoading={isWeatherLoading}
                        errorMessage={weatherErrorMessage}
                        data={weatherData}
                        lang="en"
                        locationLabel="College Station, TX"
                        unitsLabels={{ temperature: "F", windSpeed: "mph" }}
                        showForecast
                    />
                </div>
            ) : (
                <div style={{ height: "80%" }} className="grid-container">
                    {gridItems.slice((page - 2) * 8, (page - 1) * 8)}
                </div>
            )}
            {/* Render pagination and clock */}
            <div
                style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                }}
            >
                <div style={{ height: "80px", width: "200px" }}></div>
                <Pagination
                    count={7}
                    variant="outlined"
                    color="primary"
                    hidePrevButton
                    hideNextButton
                    page={page}
                />
                <Clock isMode24H size="small" />
            </div>
        </div>
    );
};

export { MenuView };
