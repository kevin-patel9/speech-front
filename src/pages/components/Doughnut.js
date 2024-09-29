import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getTotalExpenseApi } from "../../API/TransactionApi";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from 'chart.js';
import { UserAuthContext } from "../../App";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ refresh }) => {
    const [chartData, setChartData] = useState({});
    const { isLoggedIn } = useContext(UserAuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await getTotalExpenseApi();
                    const data = response?.totalExpenses || [];

                    const labels = [];
                    const amounts = [];

                    data.forEach(expense => {
                    const category = expense.categoryName;
                    const totalAmount = expense.totalAmount;

                    if (!labels.includes(category)) {
                        labels.push(category);
                        amounts.push(totalAmount);
                    }
                    });

                    // Set the chart data
                    setChartData({
                    labels: labels,
                    datasets: [
                        {
                        label: 'Total Expenses',
                        data: amounts,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                        },
                    ],
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [refresh]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>This Month</p>
            {chartData?.labels ? (
                <Doughnut data={chartData} />
                ) : (
            <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default DoughnutChart;