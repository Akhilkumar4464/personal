import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

const ChannelProgressChart = ({ labels, subscriberData, viewData, videoData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = React.useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Subscribers',
            data: subscriberData,
            borderColor: '#4f46e5', // Indigo-600
            backgroundColor: 'rgba(79, 70, 229, 0.3)',
            fill: true,
            stepped: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#4338ca',
            borderWidth: 3,
          },
          {
            label: 'Views',
            data: viewData,
            borderColor: '#10b981', // Emerald-500
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
            fill: true,
            stepped: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#059669',
            borderWidth: 3,
          },
          {
            label: 'Videos',
            data: videoData,
            borderColor: '#d97706', // Amber-600
            backgroundColor: 'rgba(217, 119, 6, 0.3)',
            fill: true,
            stepped: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#b45309',
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad',
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#f3f4f6',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          title: {
            display: true,
            text: 'Channel Progress Over Time',
            color: '#f3f4f6',
            font: {
              size: 22,
              weight: 'bold',
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            titleFont: {
              size: 16,
              weight: 'bold',
            },
            bodyFont: {
              size: 14,
            },
            cornerRadius: 6,
            padding: 10,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#cbd5e1',
              font: {
                size: 14,
              },
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.3)',
            },
          },
          y: {
            ticks: {
              color: '#cbd5e1',
              font: {
                size: 14,
              },
            },
            grid: {
              color: 'rgba(100, 116, 139, 0.3)',
            },
            beginAtZero: true,
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, subscriberData, viewData, videoData]);

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-lg mt-10 mx-4 sm:mx-0">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChannelProgressChart;
