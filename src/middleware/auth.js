const queryRow = require('../db/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'config/.env' });

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await queryRow('SELECT * FROM user WHERE id = ?', decoded.id);
    const checkToken = await queryRow(
      'SELECT * FROM token WHERE id_user = ? AND token = ?',
      [user.id, token]
    );

    if (!user || !checkToken) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send({ message: 'Please authentication !!!' });
  }
};

module.exports = auth;
