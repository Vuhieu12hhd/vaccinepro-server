const path = require('path');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const reqHandler = require('./middlewares/reqHandler');
const resHandler = require('./middlewares/resHandler');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const { PORT } = require('./configs');
const { sendMail } = require('./services/notification');

require('./services/init');
require('./models');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(reqHandler);

require('./routes')(app);

app.use(resHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
