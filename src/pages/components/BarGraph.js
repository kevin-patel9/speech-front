import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getWeekExpenseApi } from "../../API/TransactionApi";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
Filler,
} from "chart.js";
import { UserAuthContext } from "../../App";

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const BarGraphChart = ({ refresh }) => {
    const [chartData, setChartData] = useState({});
    const { isLoggedIn } = useContext(UserAuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await getWeekExpenseApi();
                    const weekExpenses = response?.weekExpenses || [];

                    const labels = [];
                    const categoriesData = {};

                    weekExpenses.forEach(day => {
                        labels.push(day.date);

                        day.categories.forEach(category => {
                            if (!categoriesData[category.category]) {
                                categoriesData[category.category] = new Array(weekExpenses.length).fill(0);
                            }

                            // find the date index
                            const index = labels.indexOf(day.date);

                            // sum according to category
                            categoriesData[category.category][index] += category.totalAmount;
                        });
                    });

                    const datasets = Object.keys(categoriesData).map((category, idx) => ({
                        label: category,
                        data: categoriesData[category],
                        backgroundColor: idx % 2 === 0 ? 'rgba(0, 228, 0, 0.7)' : 'rgba(255, 204, 0, 0.7)',
                        stack: 'Stack',
                    }));

                    setChartData({
                        labels,
                        datasets,
                    });
                } catch (error) {
                    console.log("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [refresh]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            {chartData?.labels ? (
            <Bar 
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Weekly Expenses by Category',
                        },
                    legend: {
                        display: false,
                    },
                }
            }}
            />
            ) : (
                <p className="text-center">Loading...</p>
            )}
            {chartData?.labels?.length === 0 && <div className="text-center">No Data Available to show</div>}
        </div>
    );
};

export default BarGraphChart;