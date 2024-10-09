import axios from "axios";
import data from "../data/config.json";

const baseURL = process.env.REACT_APP_BASE_API_URL;

// Small file upload URL
const FILE_UPLOAD_URL = baseURL + "/file/upload";

// Chunk file upload URLs
const urlStart = baseURL + "/file/startmultipart";
const urlSign = baseURL + "/file/signmultipart";
const urlComplete = baseURL + "/file/completemultipart";

// Must be greater than 10MB
const LARGE_FILE_SIZE = data.my_files_page.upload_files.large_size;

// Must be greater than 5MB (error if not)
const CHUNK_SIZE = data.my_files_page.upload_files.chunk_size;

export const uploadFile = async (id, file, onProgress, onError) => {
  if (file.size <= LARGE_FILE_SIZE || CHUNK_SIZE < 5 * (1024 * 1024)) {
    uploadSmallFile(id, file, onProgress, onError);
  } else {
    uploadLargeFile(id, file, onProgress, onError);
  }
};

async function uploadSmallFile(id, file, onProgress, onError) {
  try {
    let formData = new FormData();

    const request = {
      filename: file.name,
      size: file.size,
    };

    // Call /file/upload
    // Return a signed URL to upload the file
    // and AWS credentials
    const response = await callAxios(FILE_UPLOAD_URL, request);
    onProgress(id, "Uploading", 0, null);
    const data = response.data.url.fields;
    // Add AWS credentials to formData
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Add file to formData
    formData.append("file", file);

    // Upload the file to the signed URL returned by /file/upload
    // formData contains file and AWS credentials

    await callAxios(response.data.url.url, formData, (progress, controller) => {
      onProgress(id, "Uploading", progress, [controller]);
    });

    onProgress(id, "Complete", 100, null);
  } catch (e) {
    onError(id, e);
  }
}

async function compute_checksum(file){
  const reader = new FileReader();
  reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
          // Use the Web Crypto API to calculate the SHA-256 hash
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

          // Convert the hash to a hex string
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

          // Display the SHA-256 hash
          return hashHex;
      } catch (err) {
          console.error('Hashing failed:', err);
          return ""
      }
  };
}

// Upload large files
// 3 endpoints:
// 1. /file/startmultipart: https://lymecommons.org/rest#/file/post_file_startmultipart
// 2. /file/signmultipart: One call for each chunk
//     https://lymecommons.org/rest#/file/post_file_signmultipart
// 3. /file/completemultipart: https://lymecommons.org/rest#/file/post_file_completemultipart
async function uploadLargeFile(id, file, onProgress, onError) {
  try {
    // Create an array from 1...n depending of number of chunks to upload
    const numberOfChunks = file.size / CHUNK_SIZE;
    const chunks = Array.from(
      { length: numberOfChunks },
      (_, index) => index + 1
    ); // [1, 2, ...n]
    // Start: /file/startmultipart
    // Create entry about the file in the Database
    // Returns file identification necessary to upload the chunks
    const startMultipartRequest = {
      filename: file.name,
      size: file.size,
    };
    const startMultipartResponse = await callAxios(
      urlStart,
      startMultipartRequest
    );
    onProgress(id, "Uploading", 0, null);
    const uploadProgressByChunks = [];
    const uploadChunksControllers = [];
    const onChunkProgress = (chunkUploadProgress, chunkNumber, controller) => {
      uploadProgressByChunks[chunkNumber - 1] = chunkUploadProgress;
      let total = 0;
      for (const entry of uploadProgressByChunks) {
        total += entry || 0;
      }
      uploadChunksControllers[chunkNumber - 1] = controller;
      // TODO: throtle this function
      onProgress(
        id,
        "Uploading",
        (total / file.size) * 100,
        uploadChunksControllers
      );
    };
    // Upload each chunk /file/signmultipart
    const eTags = await processChunks(
      file,
      chunks,
      startMultipartResponse,
      onChunkProgress
    );

    // /file/completemultipart all individual parts belonging
    // to upload ID are stiched together to build the final file in S3
    const completeMultipartRequest = {
      filename: startMultipartResponse.data.uuid + "/" + file.name,
      upload_id: startMultipartResponse.data.upload_id,
      parts: eTags,
    };

    await callAxios(urlComplete, completeMultipartRequest);
    onProgress(id, "Complete", 100, null);
  } catch (e) {
    onError(id, e);
  }
}

// Process (upload) all file chunks in a boucle
// All upload must finish before stitch all file parts
// That's why we call promiseAll (wait all promises finish)
// Returns a eTags array
async function processChunks(file, chunks, response, onChunkProgress) {
  // Upload each chunk /file/signmultipart
  const eTags = await promiseAll(
    chunks.map(
      (chunk) => () =>
        uploadChunk(
          chunk,
          response.data.upload_id,
          response.data.uuid,
          file,
          CHUNK_SIZE,
          onChunkProgress
        )
    ),
    4
  );

  return eTags;
}

// Executed for each chunk
// Returns a ETag: Information about uploaded chunk
// necessary to identify it when calling the /file/completemultipart endpoint
async function uploadChunk(chunk, uid, uuid, file, chunkSize, onChunkProgress) {
  const req = {
    filename: uuid + "/" + file.name,
    upload_id: uid,
    part_number: chunk,
  };
  // Call /file/signmultipart
  const response = await callAxios(urlSign, req);
  const partFile = {
    file: file.slice(
      (chunk - 1) * chunkSize,
      Math.min(file.size, chunk * chunkSize)
    ),
  };

  // Tests showed only 'content-type': null works
  const headers = {
    "content-type": null,
  };

  // Use PUT, no POST to upload each chunk
  // Here onUploadProgress is important to track the uploading
  // progress for each chunk
  const controller = new AbortController();
  const resp = await axios.put(response.data.url, partFile.file, {
    headers,
    signal: controller.signal,
    onUploadProgress: ({ event }) => {
      onChunkProgress(event.loaded, chunk, controller);
    },
  });

  const etag = await resp.headers.get("etag").replaceAll('"', "");
  return { ETag: etag, PartNumber: chunk };
}

// Copied from Alex
// To manage the uploadChunk and continue code execution
// only after all uploads are finished (Promise.all)
async function promiseAll(queue, concurrency) {
  let index = 0;
  const results = [];

  // Run a pseudo-thread
  const execThread = async () => {
    while (index < queue.length) {
      const curIndex = index++;
      // Use of `curIndex` is important because `index` may change after await is resolved
      results[curIndex] = await queue[curIndex]();
    }
  };

  // Start threads
  const threads = [];
  for (let thread = 0; thread < concurrency; thread++) {
    threads.push(execThread());
  }
  await Promise.all(threads);
  return results;
}

// Execute a POST request with Axios
// URL and payload passed as parameters
// Use onUploadProgress to track uploading progress
async function callAxios(url, req, onUploadProgress) {
  const controller = new AbortController();
  return await axios.post(url, req, {
    signal: controller.signal,
    onUploadProgress: onUploadProgress
      ? ({ event }) => {
          onUploadProgress((event.loaded / event.total) * 100, controller);
        }
      : undefined,
  });
}
