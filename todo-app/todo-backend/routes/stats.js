const express = require('express');
const router = express.Router();

const {getAsync, setAsync} = require('../redis/index')

/* GET todo total added from redis */
router.get('/', async (_, res) => {
  const addedTodoLookup = await getAsync("added_todos")
  res.send({"added_todos": parseInt(addedTodoLookup)});
});

module.exports = router;