const Sequelize = require('sequelize');

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
} = require('../configs');

logger.info(
  `Database config: ${JSON.stringify({
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
  })}`,
);
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  logging: false,
  host: DATABASE_HOST,
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully');
  })
  .catch((error) => {
    logger.error(`Unable to connect to the database: error: ${error}`);
    process.exit();
  });

module.exports = sequelize;
