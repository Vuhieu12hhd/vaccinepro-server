const { Op } = require('sequelize');
const User = require('../models/user');
const { findAll } = require('./utils/util');

const findUsers = async (
  { limit, pageNum, searchKey, active, isEmailVerified, role },
  attributes,
  includePassword,
) => {
  const filters = {};
  if (searchKey) {
    filters[Op.or] = {
      name: {
        [Op.like]: `%${searchKey}%`,
      },
      email: {
        [Op.like]: `%${searchKey}%`,
      },
    };
  }
  if (active) filters.active = active;
  if (isEmailVerified) filters.isEmailVerified = isEmailVerified;
  if (role) {
    if (typeof role === 'string') {
      filters.role = role;
    } else if (typeof role === 'object') {
      filters.role = {
        [Op.in]: role,
      };
    }
  }

  if (!attributes && !includePassword) {
    attributes = { exclude: ['password'] };
  }

  const result = await findAll({
    model: User,
    filters,
    limit,
    pageNum,
    attributes,
  });

  return result;
};

const findUser = async (condition, includePassword) => {
  let user = null;

  if (typeof condition === 'number') {
    user = await User.findByPk(condition);
  } else if (typeof condition === 'object' && condition != null) {
    user = await User.findOne({ where: condition });
  }

  if (user) {
    user = user.get();
    if (!includePassword) delete user.password;
  }

  return user;
};

const createUser = async (data) => {
  const user = await User.create(data);
  return user?.get();
};

const updateUser = async (userId, data) => {
  await User.update(data, {
    where: { id: userId },
  });
};

const deleteUser = async (userId) => {
  await User.destroy({
    where: { id: userId },
  });
};

module.exports = { findUsers, findUser, createUser, updateUser, deleteUser };
