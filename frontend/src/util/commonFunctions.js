export function allFiledsFilled(data){
  const leftFields = []
  const entries = Object.entries(data)
  for(const [field, value] of entries){
    if(value.length === 0) leftFields.push(field)
  }

  if(leftFields.length !== entries.length) {
    return false
  }

  return true
}
