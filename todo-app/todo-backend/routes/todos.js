const express = require('express');
const { Todo } = require('../mongo');
const { set } = require('mongoose');
const router = express.Router();
const {getAsync, setAsync} = require('../redis/index')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const redisCache = await getAsync("added_todos")
  if (redisCache) {
    setAsync("added_todos", parseInt(redisCache) + 1)
  }
  else{
    setAsync("added_todos", 1)
  }
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  if (!req.todo) return res.sendStatus(404)
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (!req.todo) return res.sendStatus(404)
  const updateTodo = {
    text: req.body.text,
    done: req.body.done
  }
  const todo = await req.todo.updateOne(req.params.id, updateTodo)
  if (!todo) return res.sendStatus(500)
  res.send(updateTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
