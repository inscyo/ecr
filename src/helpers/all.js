import { enc, AES } from 'crypto-js'

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key
    return { [newKey]: obj[key] }
  })
  return Object.assign({}, ...keyValues)
}

export const enumerateDevices = () => {
  return new Promise((resolve) => {
    navigator.mediaDevices.enumerateDevices().then((result) => {
      const camera = result.filter((e) => e.kind === 'videoinput')
      resolve(camera)
    })
  })
}

export const cryptoEncrypt = (string) => {
  try {
    return AES.encrypt(string, import.meta.env.VITE_KEY).toString()
  } catch (err) {
    throw new Error(err)
  }
}

export const cryptoDecrypt = (string) => {
  try {
    return AES.decrypt(string, import.meta.env.VITE_KEY).toString(
      enc.Utf8
    )
  } catch (err) {
    throw new Error(err)
  }
}

export const secondsFormat = (seconds) => {
  var hours = Math.floor(seconds / 3600)
  var minutes = Math.floor((seconds % 3600) / 60)
  var remainingSeconds = seconds % 60

  var formattedTime = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(remainingSeconds).padStart(2, '0')
  ].join(':')

  return formattedTime
}

export const convertMinutesToHoursMinutesSeconds = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const seconds = 0

  return `${hours.toString().padStart(2, '0')}:${remainingMinutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const isWebcamAvailable = async (callback) => {
  try {
    // Attempt to get webcam access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    // If we successfully obtained access, close the stream and return true
    stream.getTracks().forEach((track) => track.stop())
    return callback(true)
  } catch (error) {
    // If there was an error, it means the webcam is unavailable
    return callback(false, error)
  }
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatNumberWithCommas(number) {
  if(isNaN(number)) return true;
  const numericValue = Number(number);
  if (isNaN(numericValue)) {
    return 'Invalid Input';
  }
  return numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function truncateFilenameWithExtension(filename, maxLength) {
  if (filename.length <= maxLength) {
    return filename;
  }

  const extensionIndex = filename.lastIndexOf('.');
  const nameWithoutExtension = filename.substring(0, extensionIndex);
  const truncatedName = nameWithoutExtension.substring(0, maxLength - 3) + '...';
  const result = truncatedName + filename.substring(extensionIndex);

  return result;
}

export function formatFileSize(fileSizeInBytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let size = fileSizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return size.toFixed(2) + ' ' + units[unitIndex];
}
export const allowedExtensions = ['jpg', 'jpeg', 'webp', 'png', 'gif', 'bmp', 'tiff', 'doc', 'docx', 'pdf', 'txt', 'ppt', 'pptx', 'xls', 'xlsx']
export function validateFileExtension(filename) {
  const extensionMatch = /\.([a-z0-9]+)$/i.exec(filename);
  return extensionMatch && allowedExtensions.includes(extensionMatch[1].toLowerCase());
}
export function isNullOrEmpty(value) {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
  // This regular expression allows for numbers with or without spaces, parentheses, and hyphens
  const phoneRegex = /^0?\d{10}$/;
  return phoneRegex.test(phoneNumber);
}
export function isNullOrEmptyOrWhitespace(str) {
  console.log(str)
  return !str || str.trim() === '' || str == '--';
}

export default function truncateString(inputString, maxLength) {
  return inputString.length >= maxLength ? inputString.substring(0, maxLength - 3) + '..' : inputString;
}
export function isJSON(str) {
  try {
      JSON.parse(str);
      return true;
  } catch (e) {
      return false;
  }
}

export function getQueryStringParams() {
  const queryString = window.location.search.slice(1);
  const params = {};

  queryString.replace(/([^&=]+)=([^&]*)/g, (match, key, value) => {
    params[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ''));
  });

  return params;
}