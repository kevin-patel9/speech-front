import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getTotalExpenseApi } from "../../API/TransactionApi";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // For displaying percentages
import { UserAuthContext } from "../../App";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

    const options = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 40,
                    boxHeight: 40,
                },
            },
            datalabels: {
                formatter: (value, context) => {
                    let total = 0;
                    const dataArr = context?.chart?.data?.datasets[0]?.data;
                    dataArr.map(data => {
                        total += data;
                    });
                    const percentage = ((value / total) * 100).toFixed(1) + '%';
                    return percentage; // Show percent inside the chart
                },
                color: '000',
            },
        },
        cutout: '49%', // Controls the thickness of the donut
    };

    return (
        <div className="bg-white p-1 rounded-lg shadow-lg">
            <p>This Month</p>
            {chartData?.labels ? (
                <Doughnut data={chartData} options={options} />
            ) : (
                <p className="text-center">Loading...</p>
            )}
            {chartData?.labels?.length === 0 && <div className="text-center">No Data Available to show</div>}
        </div>
    );
};

export default DoughnutChart;