import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { uploadFile } from "../../api/upload";
import useInterval from "../../hooks/useInternval";

export const FileUploadContext = createContext({
  uploadingFiles: [],
  totalPercentage: null, // null means that no uploads are in progress
  expectedRemaingTime: null,
  uploadFiles: () => {},
  removeFile: () => {},
  cancelAll: () => {},
  closeModal: () => {},
  cancelFile: () => {},
  uploadComplete: null,
});

export const FileUploadContextProvider = ({ children }) => {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(0);
  const onProgress = useCallback((id, status, progress, controllers) => {
    setUploadingFiles((prevState) =>
      prevState.map((entry) =>
        id === entry.id
          ? {
              ...entry,
              upload: {
                ...entry.upload,
                controllers,
                status,
                progress,
              },
            }
          : entry
      )
    );
  }, []);

  const onError = useCallback((id, e) => {
    setUploadingFiles((prevState) =>
      prevState.map((entry) =>
        id === entry.id
          ? {
              ...entry,
              upload: {
                ...entry.upload,
                status: e.name === "CanceledError" ? "Canceled" : "Failed",
                controllers: null,
                error: e.message ?? "Failed to upload",
                progress: 0,
              },
            }
          : entry
      )
    );
  }, []);

  const uploadFiles = useCallback(
    (filesToUpload) => {
      const newFiles = filesToUpload.map((originalFile) => ({
        file: originalFile,
        id: nanoid(),
        upload: {
          error: null,
          progress: 0,
          totalSize: originalFile.size,
          settled: false,
          status: "Pending", // Pending | Uploading | Complete | Failed | Canceled
        },
      }));

      setUploadingFiles((prevState) => [...newFiles, ...prevState]);
      for (const { file, id } of newFiles) {
        uploadFile(id, file, onProgress, onError);
      }
    },
    [onProgress, onError]
  );

  const removeFile = (id) => {
    setUploadingFiles((prevState) =>
      prevState.filter((entry) => entry.id !== id)
    );
  };

  const cancelAll = () => {
    for (const entry of uploadingFiles) {
      if (entry.upload.status === "Uploading") {
        entry.upload.controllers?.forEach((controller) => controller?.abort());
      }
    }
  };

  const cancelFile = (id) => {
    const entry = uploadingFiles.find((uploadEntry) => uploadEntry.id === id);
    if(entry){
      entry.upload.controllers?.forEach((controller) => controller?.abort());
    }
  };

  const closeModal = () => {
    setUploadingFiles([]);
  };

  // these amounts are in bytes
  let totalUploaded = 0;
  let totalUploadSize = 0;
  const unsettledFiles = uploadingFiles.filter(
    (entry) => entry.upload.settled === false
  );
  for (const {
    upload: { progress, totalSize },
  } of unsettledFiles) {
    totalUploaded += (progress / 100) * totalSize;
    totalUploadSize += totalSize;
  }
  const totalPercentage =
    totalUploadSize === 0 ? null : (totalUploaded / totalUploadSize) * 100;

  useEffect(() => {
    if (totalPercentage > 98) {
      // sets all uploads as settled, this will reset the total percentage back to 0
      setUploadingFiles((prevState) =>
        prevState.map((entry) => ({
          ...entry,
          upload: {
            ...entry.upload,
            settled: true,
          },
        }))
      );
      console.log("upload complete")
      setUploadComplete((prev) => prev + 1); 
    }
  }, [totalPercentage]);

  const uploadSpeedDataRef = useRef([]); // array of last 10 recorded upload speed to calculate moving average
  const averageUploadSpeedRef = useRef(0); // last average upload speed in bytes per second
  const prevUploadedTotalRef = useRef(0); // last uploaded total in bytes

  useInterval(() => {
    const uploadSpeedData = uploadSpeedDataRef.current;
    // add current upload speed data point
    uploadSpeedData.push(totalUploaded - prevUploadedTotalRef.current);
    // if array is over max length, remove the oldest data point
    if (uploadSpeedData.length > 10) {
      uploadSpeedData.shift();
    }
    // calculate moving average upload speed
    let averageSpeed =
      uploadSpeedData.reduce(
        (prevCount, currentValue) => prevCount + currentValue,
        0
      ) / uploadSpeedData.length;
    // set last updated total to current
    prevUploadedTotalRef.current = totalUploaded;
    averageUploadSpeedRef.current = averageSpeed;
  }, 1000);

  // expected remaining upload time in seconds
  const remainingUploadSize = totalUploadSize - totalUploaded;
  const expectedRemaingTime =
    remainingUploadSize === 0
      ? null
      : remainingUploadSize / averageUploadSpeedRef.current;

  const value = {
    uploadingFiles,
    totalPercentage,
    expectedRemaingTime,
    uploadFiles,
    removeFile,
    cancelAll,
    closeModal,
    cancelFile,
    uploadComplete,
  };

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadContext = () => {
  return useContext(FileUploadContext);
};
