const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');

const User = require('./models/user');


// mongoose.set("useFindAndModify", false);

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to db!");
        app.listen(process.env.PORT, () => console.log(`Server Up and running on port ${process.env.PORT}`));
    }
);

app.get('/', (req, res) => {
    return res.status(200).json({
        "message": "All Good!!!"
    })
});

// login on platform
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    User.findOne({
        username,
        password
    }).then((user) => {
        return res.status(200).json({
            "id": user._id.toString(),
            "username": user.username,
            "todos": user.todos
        })
    }).catch((error) => {
        return res.status(500).json({
            "error": error
        })
    });
});

// signup on platform
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const user = new User({
        username,
        password
    })
    try {
        await user.save()
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
    return res.status(200).json({
        "message": "user signup successful"
    })
});

//logout on platform
router.get('/logout', function (req, res) {
    console.log('User Id', req.user._id);
    User.findByIdAndRemove(req.user._id, function (err) {
      if (err) res.send(err);
      res.json({ message: 'User Deleted!' });
    })
});

// get todos by user id
app.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
    User.findById({
        "_id": id
    }).then((user) => {
        return res.status(200).json({
            "todos": user.todos
        })
    }).catch((error) => {
        return res.status(500).json({
            "error": error
        })
    });
});

// Add todos
app.post('/todo', async (req, res) => {
    const { id, content, isDone } = req.body;
    User.findById({
        "_id": id
    }).then(async (user) => {
        try {
            user.todos.push({
                content,
                isDone
            })
            await user.save();
            return res.status(200).json({
                "todos": user.todos
            })
        } catch (error) {
            console.log('adsasdasds2')
            return res.status(500).json({
                error
            })
        }
    }).catch((error) => {
        console.log('adsasdasds3')
        return res.status(500).json({
            error
        })
    });
});

// get single todo
app.get('/todo/:userId/:todoId', (req, res) => {
    const { userId, todoId } = req.params;
    User.findOne({
        "_id": userId
    }).then((user) => {
        user.todos.map((todo) => {
            console.log(todo._id)
            console.log(todoId)
        });
        todo = user.todos.filter((todo) => todo._id.toString() === todoId)
        return res.status(200).json({
            todo
        })
    }).catch((error) => {
        return res.status(500).json({
            error
        })
    });
});


// update single todo
app.put('/todo/:userId/:todoId', (req, res) => {
    const { userId, todoId } = req.params;
    const { content, isDone } = req.body;
    User.findOne({
        "_id": userId
    }).then(async (user) => {
        user.todos.map((todo) => {
            if (todo._id.toString() === todoId) {
                todo.content = content
                todo.isDone = isDone
            }
        });
        await user.save();
        return res.status(200).json({
            "todos": user.todos
        })
    }).catch((error) => {
        return res.status(500).json({
            error
        })
    });
});


// delete single todo
app.delete('/todo/:userId/:todoId', (req, res) => {
    const { userId, todoId } = req.params;
    const { content, isDone } = req.body;
    User.findOne({
        "_id": userId
    }).then(async (user) => {
        user.todos = user.todos.filter((todo) => (todo._id !== todoId));
        await user.save();
        return res.status(200).json({
            "todos": user.todos
        })
    }).catch((error) => {
        return res.status(500).json({
            error
        })
    });
});
