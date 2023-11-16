export function setSessionStorage(key, value, expirationTimeInMinutes = 1440) {
  const currentTime = new Date().getTime()
  const expirationTime = currentTime + expirationTimeInMinutes * 60 * 1000 // Calculate expiration time in milliseconds
  const data = {
    value: value,
    expiration: expirationTime
  }
  sessionStorage.setItem(key, JSON.stringify(data))
}

// Get data from sessionStorage and check if it has expired
export function getSessionStorage(key) {
  const storedData = sessionStorage.getItem(key)
  if (storedData) {
    const data = JSON.parse(storedData)
    const currentTime = new Date().getTime()

    // Check if data has expired
    if (currentTime < data.expiration) {
      return data.value
    } else {
      // Data has expired, remove it from sessionStorage
      sessionStorage.removeItem(key)
      return null
    }
  }
  return null // Key not found or data has expired
}
