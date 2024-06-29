"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoDona = ({ cuentas }: GraficoDonaProps) => {
  const datos = {
    datasets: [
      {
        labels: ["Banco 1", "Banco 2", "Banco 3", "Banco 4", "Banco 5"],
        data: [1250, 2500, 3750, 5845, 9125],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
      },
    ],
  };
  return (
    <Doughnut
      data={datos}
      options={{ cutout: "80%", plugins: { legend: { display: false } } }}
    />
  );
};

export default GraficoDona;
