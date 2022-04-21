const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  const user = users.find((user) => user.username == username)

  if (!user) {
    return response.status(404).json({error: "User does not exists!"})
  }

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  if (!name || !username) {
    return response.status(400).json({error: "Name or username not provided!"})
  }

  const userAlreadyExists = users.some((user) => user.username == username)

  if (userAlreadyExists) {
    return response.status(400).json({error: "User already exists."})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const todos = user.todos

  return response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { user } = request

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { title, deadline } = request.body
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo) {
    return response.status(404).json({error: "Todo does not exists!"})
  }

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.status(201).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo) {
    return response.status(404).json({error: "Todo does not exists!"})
  }

  todo.done = true

  response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;