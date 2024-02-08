const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line to import the path module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://girija:girija@to-do.z8wayub.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Todo = mongoose.model('Todo', { text: String });

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text });
  await todo.save();
  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await Todo.findByIdAndUpdate(id, { text });
  res.json({ success: true });
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findOneAndDelete({ _id: id });
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
