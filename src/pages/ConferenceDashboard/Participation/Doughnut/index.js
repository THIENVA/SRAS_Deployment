import React, { useState } from 'react'

import { ArcElement, Chart as ChartJS, Colors, Legend, Title, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Title, Tooltip, Legend, Colors)
const DoughnutChart = ({ data, text, position = 'right', cutout, height, titlePadding }) => {
    const [chartData, setChartData] = useState({
        labels: data.map((data) => data.name),
        datasets: [
            {
                data: data.map((data) => data.number),
                rOffset: 4,
            },
        ],
    })
    return (
        <React.Fragment>
            <Doughnut
                height={height}
                // width={400}
                data={chartData}
                options={{
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return ' ' + context.parsed + '%'
                                },
                            },
                        },
                        datalabels: {
                            display: true,
                            align: 'bottom',
                            backgroundColor: '#ccc',
                            borderRadius: 3,
                            font: {
                                size: 18,
                            },
                        },
                        title: {
                            padding: titlePadding,
                            display: true,
                            text: text,
                            position: 'bottom',
                            font: { size: 16 },
                        },
                        legend: {
                            position: position,
                            textDirection: 'ltr',
                            labels: {
                                usePointStyle: true,
                            },
                        },
                    },
                    cutout: cutout,
                    responsive: true,
                    maintainAspectRatio: false,
                }}
            />
        </React.Fragment>
    )
}

export default DoughnutChart
