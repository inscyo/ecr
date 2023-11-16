export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const convertObjectToArray = (dataObject) => {
  const dataArray = []

  for (const key in dataObject) {
    if (dataObject.hasOwnProperty(key)) {
      dataArray.push(dataObject[key])
    }
  }

  return dataArray
}

export const convertArrayToObjectList = (array) => {
  const objectList = {}

  array.forEach((item, index) => {
    const key = index.toString()
    objectList[key] = item
  })

  return objectList
}

export const areArraysEqualByIndexValue = (array1, array2) => {
  const concatenated1 = array1.map((value, index) => index + value).join('')
  const concatenated2 = array2.map((value, index) => index + value).join('')
  const sorted1 = concatenated1.split('').sort().join('')
  const sorted2 = concatenated2.split('').sort().join('')
  return sorted1 === sorted2
}
