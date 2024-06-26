import React, { useState, useEffect } from "react";
import { getWhatSellsTogether, getItemName } from "../../../../network/api";

const WhatSellsTogether = ({ start_date, end_date }) => {
    const [whatSellsTogether, setWhatSellsTogether] = useState([]);

    useEffect(() => {
        const fetchWhatSellsTogether = async () => {
            try {
                const data = await getWhatSellsTogether(start_date, end_date);
                setWhatSellsTogether(data);
            } catch (error) {
                console.error("Error fetching sales report:", error);
            }
        };

        // Fetch ingredient usage data when component mounts
        fetchWhatSellsTogether();
    }, [start_date, end_date]); // Include start_date and end_date in the dependency array to fetch data when they change
    return (
        <div>
            <h2>What Sells Together</h2>
            <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <table
                    style={{
                        borderCollapse: "collapse",
                        border: "1px solid black",
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Menu Item 1
                            </th>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Menu Item 2
                            </th>
                            <th
                                style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                }}
                            >
                                Count
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{ maxHeight: "80vh", overflowY: "auto", maxWidth: "100wh" }}>
                        {whatSellsTogether.map((sale, index) => (
                            <tr key={index} style={{ border: "1px solid black" }}>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {sale[0]}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {sale[1]}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                    }}
                                >
                                    {sale[2]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WhatSellsTogether;
