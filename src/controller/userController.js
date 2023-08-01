const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config({ path: 'config/.env' });
// truy van
const queryRow = async (sql, data = undefined) => {
  const [row] = await db.query(sql, data);
  return row;
};

// tao token
const generateAuthToken = async function (user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
};

const userController = {
  insert: async (req, res) => {
    try {
      const sql = 'INSERT INTO user SET ?';
      const user = req.body;

      // check email is validator
      if (!validator.isEmail(user.email)) {
        res.status(400).send({ message: 'Invalid email format !!!' });
        return;
      }

      // check email exist
      const sql2 = 'SELECT * FROM user WHERE email = ?';
      const [user2] = await queryRow(sql2, user.email);
      if (user2) {
        // error client
        res.status(400).send({ message: 'This is email is already use!!!' });
        return;
      }

      // check password
      //  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
      // }
      // insert
      await queryRow(sql, [user]);
      // tao token
      const token = await generateAuthToken(user);
      // res
      //   .status(201)
      //   .send({ message: 'Insert successfully !!!!', token: token });
      res.status(201).send(user);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  },

  login: async (req, res) => {
    try {
      // check email exist
      const sql = 'SELECT * FROM user WHERE email = ?';
      const [user] = await queryRow(sql, req.body.email);
      if (!user) {
        res.status(400).send({ message: 'Email or Password is incorrect !!!' });
        return;
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        res.status(400).send({ message: 'Email or Password is incorrect !!!' });
        return;
      }

      res.status(201).send(user);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  },

  getDetails: async (req, res) => {
    try {
      const sql = 'SELECT * FROM user';
      const user = await queryRow(sql);

      // res.status(201).send(user);
      res
        .status(201)
        .send({ message: 'Insert successfully !!!!', token: 'tokenfake' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  get: async (req, res) => {
    try {
      const sql = 'SELECT * FROM user WHERE id = ?';
      const user = await queryRow(sql, [req.params.id]);
      if (!user.length) {
        throw new Error({ error: 'Khong tim thay user !!!' });
      }
      res.status(201).send(user);
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  update: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new Error({ error: 'Invalid updates!' });
    }

    try {
      const sql = 'UPDATE user SET ? WHERE id = ?';
      await queryRow(sql, [req.body, req.params.id]);
      res.status(201).send({ message: 'Update Successfully!!!' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  delete: async (req, res) => {
    try {
      const sql = 'DELETE FROM user WHERE id = ?';
      await queryRow(sql, [req.params.id]);
      res.status(201).send({ message: 'Delete Successfully!!!' });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
  },

  loginTest: (req, res) => {
    res.status(201).send(req.body);
  },
};

module.exports = userController;
