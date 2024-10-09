function getReadableFileSizeString(fileSize, initialByteUnit = "B") {
  let byteUnits = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const foundIndex = byteUnits.findIndex((unit) => unit === initialByteUnit);
  const exponent = foundIndex < 0 ? 0 : foundIndex + 1;
  let fileSizeInBytes = fileSize*Math.pow(1024, exponent);
  let i = -1;
  do {
    fileSizeInBytes /= 1024;
    i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
}

export default getReadableFileSizeString;
