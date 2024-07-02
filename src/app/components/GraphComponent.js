// GraphComponent.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const GraphComponent = ({ data }) => {
  if (!data || !data.labels || !data.datasets) {
    return null; // Render nothing if data is not properly defined
  }

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor,
      backgroundColor: dataset.backgroundColor,
    })),
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default GraphComponent;
