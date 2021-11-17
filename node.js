const express = require('express');
// const PORT = process.env.PORT || 3000;
const PORT = 3000;
const node = express();
const cors = require('cors')
/** @member {Object} */

const mongoose = require('mongoose');

node.use(express.json());
node.use(cors());

const { Schema } = mongoose;

const todoSchema = new Schema({
    _id: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
    },
    date: {
        type: Date,
    }
});

const Todo = mongoose.model('todos', todoSchema);
const uri = 'mongodb+srv://oksana:1o2k3s@cluster0.tbaku.mongodb.net/todos?retryWrites=true&w=majority';

mongoose.connect(uri, () => console.log('Connected to DB!'));

//ROUTES
node.get('/todos', async (req, res) => {
    try{
        const todos = await Todo.find();
        res.send( {todos: todos});
    } catch (err){
        res.send({message: err});
    }
});

//CREATE
node.post('/todos', async function (req, res) {
    const todo = new Todo({
        _id: new Date(),
        description: req.body.description,
        completed: false,
        date: new Date(),
    });
    try {
        const savedTodo = await todo.save();
        res.send(savedTodo);
    } catch (err) {
        res.send({message: err});
    }
});

//SPECIFIC TODO
node.get('/todos/:_id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params._id);
        res.send(todo);
    }catch(err) {
        res.send({message: err});
    }
})

//UPDATE TODO
node.patch(`/todos/:_id`, async (req, res) => {
    try {
        const updatedTodo = await Todo.updateOne({ _id: req.params._id },
            { $set: { description: req.body.description, completed: req.body.completed } }
        );
        res.send(updatedTodo);
    }catch (err){
        res.send({message: err});
    }
});

// DELETE TODO
node.delete('/todos/:_id', async (req, res) => {
    try{
        const removedTodo = await Todo.deleteOne({ _id: req.params._id });
        res.send(removedTodo);
    }catch (err){
        res.send({message: err});
    }
});

node.listen(PORT, () => {
    console.log('Server has been started..');
});




