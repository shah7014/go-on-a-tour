const excludeUnFilterFields = (query) => {
  const queryObj = { ...query };
  const exclduedFields = ['page', 'sort', 'limit', 'fields'];
  exclduedFields.forEach((el) => delete queryObj[el]);
  return queryObj;
};

const convertQueryOperators = (query) => {
  const queryObj = { ...query };

  for (let key in queryObj) {
    if (typeof queryObj[key] === 'object' && queryObj[key] !== null) {
      const subObj = queryObj[key];
      const newSubObj = {};

      for (let subKey in subObj) {
        if (['lt', 'lte', 'gt', 'gte'].includes(subKey)) {
          newSubObj[`$${subKey}`] = Number(subObj[subKey]);
        } else {
          newSubObj[subKey] = subObj[subKey];
        }
      }

      queryObj[key] = newSubObj;
    }
  }

  return queryObj;
};

// in API url query params, sort by is passed as a comma sepearted values
// for mongoose, we want them to be space sepearted values
const getAsSpaceSepearted = (sortCriteria) => {
  return sortCriteria.split(',').join(' ');
};

module.exports = {
  excludeUnFilterFields,
  convertQueryOperators,
  getAsSpaceSepearted,
};
