class ApiUtils {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  filter() {
    // 1) remove unfiltered fields
    const unfileteredParams = ['page', 'limit', 'fields', 'sort'];
    const queryObj = { ...this.query };
    unfileteredParams.forEach((p) => delete queryObj[p]);

    // 2) also add "$" for mongo operators
    for (let key in queryObj) {
      if (typeof queryObj[key] === 'object' && queryObj[key] !== null) {
        const subObj = queryObj[key];
        const newSubObj = {};
        for (let subKey in subObj) {
          let operators = ['lt', 'lte', 'gt', 'gte'];
          if (operators.includes(subKey)) {
            newSubObj[`$${subKey}`] = Number(subObj[subKey]);
          } else {
            newSubObj[subKey] = subObj[subKey];
          }
        }
        queryObj[key] = newSubObj;
      }
    }
    this.mongooseQuery = this.mongooseQuery.find(queryObj);
    return this;
  }

  sort() {
    const sortBy = (this.query.sort || '-createdAt').split(',').join(' ');
    this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    return this;
  }

  select() {
    const fields = (this.query.fields || '-__v').split(',').join(' ');
    this.mongooseQuery = this.mongooseQuery.select(fields);
    return this;
  }

  paginate() {
    const pageNo = this.query.page ? Number(this.query.page) : 1;
    const limit = this.query.limit ? Number(this.query.limit) : 100;
    const skipResults = (pageNo - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skipResults).limit(limit);
    return this;
  }
}

module.exports = ApiUtils;
