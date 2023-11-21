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