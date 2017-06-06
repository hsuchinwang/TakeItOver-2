
function underscoreTocamelcase(str) {
  return str.replace(/-(.)/g, (match, content) => content.toUpperCase());
}

export function formatData(data) {
  const result = {};
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;
    const newKey = underscoreTocamelcase(key);
    if (data[key] instanceof Object) {
      result[newKey] = formatData(data[key]);
    } else {
      result[newKey] = data[key];
    }
  }
  return result;
}
