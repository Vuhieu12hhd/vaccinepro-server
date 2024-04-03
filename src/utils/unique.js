const getUnique = (dataSet = []) => {
  const uniqueElements = new Set(dataSet);
  return [...uniqueElements];
};

module.exports = getUnique;
