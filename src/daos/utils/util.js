const getSelectQuery = (fields) =>
  JSON.parse(`{${fields.map((element) => `"${element}":1`).join(',')}}`);

const findAll = async ({
  model,

  filters = {},
  limit = Number.MAX_SAFE_INTEGER,
  pageNum = 1,
  attributes,

  isRaw = false,
  relation,
  hasGetPagination = true,
}) => {
  const options = { limit, offset: (pageNum - 1) * limit };

  options.where = filters;
  if (attributes) options.attributes = attributes;
  if (relation) options.include = relation;

  const items = await model.findAll(options);

  const result = {};
  if (hasGetPagination) {
    const totalItem = await model.count({ where: filters });
    result.pagination = getPagination({
      totalItem,
      limit,
      page: pageNum,
    });
  }

  if (isRaw) return { ...result, items };
  return { ...result, items: items.map((item) => item.get()) };
};

const getPagination = ({ totalItem, page, limit }) => {
  return {
    page,
    limit,
    totalCount: totalItem,
    totalPage: Math.ceil(totalItem / limit),
  };
};

module.exports = { getSelectQuery, findAll, getPagination };
