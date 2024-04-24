import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Pie } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function PieChart() {
  const [chartData, setChartData] = useState({
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        label: "Users Gained ",
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        // borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="App">
      <Pie data={chartData} />
    </div>
  );
}
