export default (allowedFields, rawObj) =>
  Object.keys(rawObj)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = rawObj[key];
      return obj;
    }, {});
