import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import recent_icon from "../../../image/24hours.png";

export const PipelineStatusChart = () => {
  const [series, setSeries] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://archs4.org/api/pipeline/recent');
        const data = await response.json();
        
        const reversedData = data.status.reverse();
        const successData = reversedData.map(item => item[0]);
        const failureData = reversedData.map(item => item[1]);
                
        const currentTime = new Date();

        // Create labels based on the current time
        const labels = data.status.map((_, index) => {
            // Create a new Date object based on the current time minus the index
            const timeWithOffset = new Date(currentTime.getTime() - (24-index) * 1000 * 60 * 60); // substracting index seconds
            // Format the time as desired (HH:MM:SS)
            const formattedTime = timeWithOffset.toTimeString().split(' ')[0]; // Extracting HH:MM:SS part
            return `${formattedTime} T-${24-index}`; // Label format
        });

        setSeries([
          { 
            data: successData, 
            label: 'Success', 
            color: '#02B2AF',
            stack: 'total',
          },
          { 
            data: failureData, 
            label: 'Failure', 
            color: '#2E96FF',
            stack: 'total',
          }
        ]);
        
        setXLabels(labels);
        
      } catch (error) {
        console.error('Error fetching pipeline data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
     <img
        src={recent_icon}
        alt="Task outcomes in the last 24 hours"
        style={{
          width: "50px",
          height: "auto",
          position: "absolute",
          bottom: "20px", // Correcting from marginBottom to positioning
          right: "18px", // Adjust vertical and horizontal positioning if needed
          zIndex: 4
        }}
      />
    <BarChart
      height={120}
      width={350}
      series={series}
      xAxis={[{
        scaleType: 'band',
        data: xLabels,
        categoryGapRatio: 0.0,
        barGapRatio: 0.0,
        tickLabelStyle: { display: 'none' }, // Hide x-axis labels
      }]}
      yAxis={[{ 
        disableLine: true, 
        disableTicks: true,
        tickLabelStyle: { display: 'none' }, // Hide y-axis labels
      }]}
      slotProps={{
        legend: { hidden: true }, // Hide legend for compact view
      }}
      grid={{ vertical: false, horizontal: false }} // Remove grid lines
      margin={{ top: 0, bottom: 0, left: 10, right: 10 }}
    />
    </>
  );
};
