/**
 * Represents a component for displaying a line chart of total orders over time.
 * @param {Object} props - The props object containing the start date, end date, and smoothing option.
 * @param {Date} props.start_date - The start date for the period of analysis.
 * @param {Date} props.end_date - The end date for the period of analysis.
 * @param {string} props.smoothingOption - The option for smoothing the data (e.g., "Savitzky-Golay Filter", "LOWESS").
 * @returns {JSX.Element} The JSX element representing the total orders line chart component.
 */
const TotalOrdersGraph = ({ start_date, end_date, smoothingOption }) => {
    /**
     * State hook for storing the order data for the line chart.
     * @type {Object}
     */
    const [orderData, setOrderData] = useState({ labels: [], datasets: [] });

    /**
     * Effect hook for fetching order data from the server and updating the chart.
     * @function
     * @param {Date} start_date - The start date for the period of analysis.
     * @param {Date} end_date - The end date for the period of analysis.
     * @param {string} smoothingOption - The option for smoothing the data.
     */
    useEffect(() => {
        /**
         * Fetches order data from the server and updates the chart.
         * @async
         * @function
         * @returns {Promise<void>} A promise that resolves when data is fetched successfully.
         */
        const fetchData = async () => {
            try {
                // Fetch orders data from the server
                const orders = await getOrders(start_date, end_date);
                const ordersPerDay = {};

                // Process the fetched orders data
                orders.forEach((order) => {
                    const orderDate = order[3].split(",")[1].trim();
                    if (!ordersPerDay[orderDate]) {
                        ordersPerDay[orderDate] = 0;
                    }
                    ordersPerDay[orderDate]++;
                });

                // Extract order dates and counts
                const orderDates = Object.keys(ordersPerDay);
                const orderCounts = Object.values(ordersPerDay);

                let yData;

                // Apply smoothing based on the selected option
                switch (smoothingOption) {
                    case "Savitzky-Golay Filter":
                        yData = sgg(orderCounts, 1, {
                            windowSize:
                                Math.floor(orderCounts.length / 20) % 2 === 0
                                    ? Math.floor(orderCounts.length / 20) + 1
                                    : Math.floor(orderCounts.length / 20),
                            derivative: 0,
                            polynomial: 3,
                        });
                        break;
                    case "LOWESS":
                        yData = lowess(
                            Array.from(
                                { length: orderCounts.length },
                                (_, i) => i + 1
                            ),
                            orderCounts,
                            { f: 0.1, nsteps: 10 }
                        ).y;
                        break;
                    default:
                        yData = orderCounts;
                        break;
                }

                // Construct the data object for the line chart
                const newOrderData = {
                    labels: orderDates,
                    datasets: [
                        {
                            label: "Number of Orders",
                            data: yData,
                            fill: false,
                            borderColor: "rgb(75, 192, 192)",
                        },
                    ],
                };

                // Update the state with the new data
                setOrderData(newOrderData);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchData();
    }, [start_date, end_date, smoothingOption]);

    // Render the line chart component
    return (
        <div>
            <div className="chart-container">
                <h3>Orders Line Chart</h3>
                <Line
                    data={orderData}
                    options={{
                        scales: {
                            x: {
                                // Note the change from 'xAxes' to 'x'
                                ticks: {
                                    autoSkip: true,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    maxTicksLimit: 5,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TotalOrdersGraph;
