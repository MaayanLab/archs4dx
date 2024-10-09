function secondsToString(seconds) {
  var hour = Math.floor(seconds / 3600);
  hour = hour === 0 ? "" : hour + "h";
  var minute = Math.floor((seconds / 60) % 60);
  minute = minute === 0 ? "" : minute + "m";
  var second = seconds % 60;
  second = second === 0 ? "" + second : second + "s";
  return hour + " " + minute + " " + second;
}

export default secondsToString;
