export default (obj) =>
  Object.entries(obj).reduce((coercedObj, [key, value]) => {
    coercedObj[key] = value.toString();

    return coercedObj;
  }, {});
