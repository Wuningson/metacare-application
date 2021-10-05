require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const db = require('./src/config/database');
const routes = require('./src/routes/index');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api', routes);

db.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });

const port = process.env.PORT || 3000;

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((err) => console.log(`Error:\n${err}`));
