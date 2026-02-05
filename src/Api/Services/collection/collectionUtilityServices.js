export function validateLanguage(rows) {
  const tmpArr = []
  const usedLanguageCode = []
  rows.forEach((lang, index) => {
    if (lang.language == null || lang.language === '')
      tmpArr[index] = { language: "Required" }
    else if (usedLanguageCode.includes(lang.language)) {
      tmpArr[index] = { language: 'Should be unique' }
    }
    else
      usedLanguageCode.push(lang.language)
    if (lang.label == null || lang.label === '') {
      if (tmpArr[index] == null)
        tmpArr[index] = { label: "Required" }
      else
        tmpArr[index].label = "Required"
    }
  })
  return tmpArr
}

export function getEditLocalRows(local_obj) {
  if (!local_obj)
    return []
  const retArr = []
  retArr.push({ language: 'en', label: local_obj.en })
  Object.keys(local_obj).sort().forEach(key => {
    if (key !== 'en')
      retArr.push(({ language: key, label: local_obj[key] }))
  })
  return retArr
}

export function getEditEnglishName(local_obj, fieldName) {
  if (!local_obj && !fieldName)
    return ""
  if (local_obj && local_obj.en)
    return local_obj.en
  return fieldName
}

export function getEditFieldProps(field_settings) {
  const tmpArr = []
  if (field_settings.is_mandatory)
    tmpArr.push("required")
  if (field_settings.is_unique)
    tmpArr.push("unique")
  if (field_settings.is_private)
    tmpArr.push("private")
  return tmpArr
}

export function getLocationObject(arr) {
  let tmpObj = {}
  arr.forEach(item => {
    tmpObj = {
      ...tmpObj,
      [item.language]: item.label
    }
  })
  return tmpObj
}

export function getCollectionLabel(collectionName, localizedTexts, selectedLanguage) {
  if (localizedTexts == null || Object.keys(localizedTexts).length == 0)
    return collectionName
  if (localizedTexts[selectedLanguage])
    return localizedTexts[selectedLanguage]
  else if (localizedTexts.en)
    return localizedTexts.en
  else
    return collectionName
}

export function getDefaultBooleanValue(defValue) {
  switch (defValue) {
    case 'true':
    case 'True':
    case true:
      return 'true'
    case 'false':
    case 'False':
    case false:
      return 'false'
    default:
      return ''
  }
}

export function getListValuesByLanguage(localizedValues, selectedLanguage) {
  if (localizedValues == null)
    return []
  if (typeof localizedValues === 'string')
    return localizedValues.split("\n")
  if (localizedValues[selectedLanguage])
    return localizedValues[selectedLanguage].split("\n")
  else if (localizedValues.en)
    return localizedValues.en.split("\n")
  else
    return []
}

export function getMediaTypesForFileInput(mediaType) {
  switch (mediaType) {
    case 'images':
      return "image/*"
    case 'videos':
      return "video/*"
    case 'audio':
      return "audio/*"
    case 'files':
      return ".pdf,.doc,.xls,.ppt,.csv,.json"
    default:
      return "*"
  }
}

export const getFieldValueFromResObj = (resObj, pathStack) => {
  if (pathStack.length === 0)
    return resObj
  if (resObj == null && pathStack.length > 0)
    return "__SKIP__FIELD___"
  const currPath = pathStack.shift()
  const matchRes = currPath.match(/\[(.*)\]/)
  if (matchRes) {
    const indexes = matchRes.pop().split("][")
    pathStack.unshift(...indexes)
    return getFieldValueFromResObj(resObj[currPath.substring(0, currPath.indexOf('['))], pathStack)
  }
  else {
    if (isNaN(currPath))
      return getFieldValueFromResObj(resObj[currPath.replaceAll("'", "")], pathStack)
    else
      return getFieldValueFromResObj(resObj[parseInt(currPath)], pathStack)
  }
}

export const stringObjectParser = (string) => {
  try {
    if (typeof string != 'string')
      return string
    return JSON.parse(string)
  }
  catch (err) {
    console.log("error while parsing this string to JSON", string)
    console.log(err)
    if (string.charAt(0) === '[')
      return []
    else
      return {}
  }
}

export const validateDataLoss = (newPayload, oldPayload) => {
  if (Array.isArray(oldPayload)) {
    if (!Array.isArray(newPayload))
      return false
    if (oldPayload.length === 0)
      return true
    if (newPayload.length === 0)
      return true
    if (typeof newPayload[0] !== typeof oldPayload[0])
      return false
    if (typeof oldPayload[0] !== "object")
      return true
    return validateDataLoss(newPayload[0], oldPayload[0])
  }

  for (const oldKey in oldPayload) {
    if (oldPayload[oldKey] == null || oldPayload[oldKey] === "")
      continue
    if (!(oldKey in newPayload))
      return false
    if (typeof oldPayload[oldKey] !== typeof newPayload[oldKey])
      return false
    if (newPayload[oldKey] == null || newPayload[oldKey] === "")
      return false
    if (typeof oldPayload[oldKey] === "object") {
      const childStatus = validateDataLoss(newPayload[oldKey], oldPayload[oldKey])
      if (!childStatus)
        return false
    }
  }
  return true
}