import React, { useState } from "react";
import { LinearProgress, Tooltip } from "@mui/material";
import { faFileExport, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const ExpressionDownload = ({queryKey, species, samples }) => {
  const [progress, setProgress] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false); // New state to track building status
  const [hasFailed, setHasFailed] = useState(false); 

  const checkProgress = async (taskId) => {
    try {
      const response = await fetch(`https://maayanlab.cloud/sigpy/data/samples/status/${taskId}`);
      const data = await response.json();
      if (data.status === "SUCCESS") {
        setDownloadUrl(`https://maayanlab.cloud/sigpy/data/samples/download/${taskId}`);
        setIsBuilding(false);
        setHasFailed(false);
      } else if (data.status === "FAILURE") {
        console.error("Error in processing");
        setHasFailed(true);
        setIsBuilding(false);
      } else if (data.status === "PENDING") {
        setIsBuilding(true);
        setTimeout(() => checkProgress(taskId), 5000);
      } else {
        setProgress(data.progress);
        setTimeout(() => checkProgress(taskId), 5000);
      }
    } catch (error) {
      console.error("Error while checking progress:", error);
      setIsBuilding(false); // Reset building status on error
      setHasFailed(true);
    }
  };
  
  const writeLog = async () => {
    try {
      const response = await fetch('https://archs4.org/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "category": "metadownload", "entry": queryKey }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error writing log:', error);
    }
  };

  const startDownload = () => {
    writeLog();
    setDownloadUrl(null);
    setIsBuilding(false);
    setProgress(null)
  };

  const downloadExpression = async () => {
    try {
      setIsBuilding(true); // Indicate that the building process has started
      setProgress(0); // Immediately set progress to 0% when the process starts
      const gsmSamples = Array.from(samples).map(sample => `GSM${sample}`);
      const response = await fetch(`https://maayanlab.cloud/sigpy/data/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ species, gsm_ids: gsmSamples })
      });
      const result = await response.json();
      checkProgress(result.task_id);
    } catch (error) {
      console.error("Error initiating download:", error);
      setIsBuilding(false); // Reset building status on error
    }
  };

  const safeProgress = progress !== null && progress !== undefined ? progress : 0;
  const safeValueBuffer = Math.min(safeProgress + 5, 100);

  return (
    <div>
      {downloadUrl ? (
        <>
        <style>
        {`
          @keyframes bounceRight {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(0);
            }
            40% {
              transform: translateX(10px);
            }
            60% {
              transform: translateX(5px);
            }
          }

          .bouncing-icon {
            animation: bounceRight 2s infinite;
          }
        `}
      </style>
      
       <a href={downloadUrl} class="nodecor" target="_blank" rel="noopener noreferrer" onClick={startDownload}>
       <div class="downloadexp">
        <span style={{marginLeft: '8px'}}>Ready</span>
       <FontAwesomeIcon
         className="bouncing-icon"
         style={{ color: "black", marginLeft: '8px' }}
         icon={faFileExport}
       />
       </div>
     </a>
     
     </>
      ) : (
        <div>
          {isBuilding ? (
            <Tooltip title="Building expression matrix for download. If more than 5000 samples were selected only the fist 5000 samples will be packaged." arrow>
            <span style={{ fontSize: "small" }}>Building ...</span>
            </Tooltip>
          ) : hasFailed ? (
            <span style={{ color: "red" }}>
              Failed to build.
            </span>
          ) : (
            <Tooltip title="Build expression matrix for download. Packaging is limited to 5000 samples." arrow>
            <a href="#" onClick={(e) => { e.preventDefault(); downloadExpression(); }}><FontAwesomeIcon icon={faDownload} style={{color: "black"}}/></a>
            </Tooltip>
          )}
          {progress !== null && (
             <LinearProgress
                sx={{ marginRight: '20px' }}
                variant="buffer"
                value={safeProgress}
                valueBuffer={safeValueBuffer}
            />
          )}
        </div>
      )}
    </div>
  );
};