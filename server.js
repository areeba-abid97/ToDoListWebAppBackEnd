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

// // login on platform
// app.post('/login', (req, res) => {
//     const {username, password} = req.body;
//     console.log(username, password);

//     User.findOne({
//         username,
//         password
//     }).then((user) => {
//         res.json({
//             "username": user.username,
//             "todos": user.todos
//         })
//     }).catch((error) => {
//         res.json({
//             "error": error
//         })
//     });
// });

// // signup on platform
// app.post('/signup', async (req, res) => {
//     const {username, password} = req.body;
//     console.log(username, password);
//     const user = new User({
//         username,
//         password
//     })
//     try{
//         await user.save()
//     }catch(error){
//         res.json({
//             error
//         })
//     }
//     res.json({
//         "test": "Success"
//     })
// });

// // get todos by user id
// app.get('/todos/:id', async (req, res) => {
//     const id = req.params.id;
//     User.findById({
//         "_id": id 
//     }).then((user) => {
//         res.json({
//             "todos": user.todos
//         })
//     }).catch((error) => {
//         res.json({
//             "error": error
//         })
//     });
// });

// // Add todos
// app.post('/todo', async (req, res) => {
//     const { id, content, isDone } = req.body;
//     User.findById({
//         "_id": id 
//     }).then(async (user) => {
//         try{
//             user.todos.push({
//                 content,
//                 isDone
//             })
//             await user.save();
//             res.json({
//                 "todos": user.todos
//             })
//         }catch(error){
//             console.log('adsasdasds2')
//             res.json({
//                 error
//             })
//         }
//     }).catch((error) => {
//         console.log('adsasdasds3')
//         res.json({
//             error
//         })
//     });
// });

// // get single todo
// app.get('/todo/:userId/:todoId', (req, res) => {
//     const { userId, todoId } = req.params;
//     User.findOne({ 
//         "_id": userId 
//     }).then((user) => {
//         user.todos.map((todo) => {
//             console.log(todo._id)
//             console.log(todoId)
//         });
//         todo = user.todos.filter((todo) => todo._id.toString() === todoId)
//         res.json({
//             todo
//         })
//     }).catch((error) => {
//         res.json({
//             error
//         })
//     });
// });


// // update single todo
// app.put('/todo/:userId/:todoId', (req, res) => {
//     const { userId, todoId } = req.params;
//     const { content, isDone } = req.body;
//     User.findOne({ 
//         "_id": userId 
//     }).then(async (user) => {
//         user.todos.map((todo) => {
//             if (todo._id.toString() === todoId) {
//                 todo.content = content
//                 todo.isDone = isDone
//             }
//         });
//         await user.save();
//         res.json({
//             "todos": user.todos
//         })
//     }).catch((error) => {
//         res.json({
//             error
//         })
//     });
// });

function writeDataRegister(userList, request) {
    let user = {
        username: request.username,
        password: request.password
    };
    userList.push(user);
    userList = JSON.stringify(userList);
    fs.writeFile('appFiles/users.json', userList, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
    return user;
  }

  app.post('/api/users/register', (req, res) => {
    let request = req.body;
    let userList = [];
    let result = {};
    fs.readFile('appFiles/users.json', 'utf8', (err, data) => {
      if (err) {
        userList = [];
        request = writeDataRegister(userList, request);
        result = {
          message: 'Success: User registered successfully',
          result: 'success'
        };
      } else if (data) {
        userList = JSON.parse(data);
        userList.forEach(function (u) {
          if (u.email === request.email || u.username === request.username) {
            result = {
              message: 'Error: Email already exists',
              result: 'error'
            };
            console.log(result);
          } else {
            request = writeData(userList, request);
            result = {
              message: 'Success: User registered successfully',
              result: 'success'
            };
          }
        });
      }
      return res.status('200').json(result);
    });
  });

////////////////////////
function writeData(taskList, request, username) {
    const task = {};
    if (request !== null) {
      taskList.push(request);
    }
    taskList = JSON.stringify(taskList);
    const dir = 'appFiles/' + username;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir + '/tasks.json', taskList, (err) => {
      if (err) {
        throw err;
      }
    });
    return task;
  }

  function setHeader(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
    return res;
  }

  app.post('/api/entity/task', (req, res) => {
    res = setHeader(res);
    let request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile('appFiles/' + request.username + '/tasks.json', 'utf8', (err, data) => {
      if (err) {
        taskList = [];
        request = writeData(taskList, request, request.username);
        result = {
          message: 'Success: Task added successfully',
          result: 'success'
        };
      } else {
        if (data === '' || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
        }
        request = writeData(taskList, request, request.username);
        result = {
          message: 'Success: Task added successfully',
          result: 'success'
        };
      }
      return res.status('200').json(result);
    });
  });


  app.get('/api/entity/task/:id', (req, res) => {
    res = setHeader(res);
    const id = req.params.id;
    let taskList = [];
    let result = {};
    fs.readFile('appFiles/' + id + '/tasks.json', 'utf8', (err, data) => {
      if (err) {
        taskList = [];
        result = {
          message: 'Error: No Task found for the user',
          result: 'error'
        };
      } else if (data) {
        if (data === '' || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
        }
        if (taskList !== undefined && taskList !== null && taskList.length > 0 && taskList[0].username === id) {
          result = {
            message: 'Success: User task retrieved successfully',
            result: 'success',
            value: taskList
          };

        }
      }
      return res.status('200').json(result);
    });
  });


  app.post('/api/entity/delete/task', (req, res) => {
    res = setHeader(res);
    const id = req.body.username;
    const request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile('appFiles/' + id + '/tasks.json', 'utf8', (err, data) => {
      if (err) {
        result = {
          message: 'Error: No Task found for the user',
          result: 'error'
        };
      } else {
        if (data === '' || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
          if (taskList !== undefined && taskList !== null && taskList.length > 0) {
            taskList.forEach(function (task) {
              if (task.id === request.id) {
                taskList.splice(taskList.indexOf(task), 1);
              }
            });
            writeData(taskList, null, request.username);
          }
        }
        result = {
          message: 'Success: User task removed successfully',
          result: 'success',
        };
        return res.status('200').json(result);
      }
    });
  });

  app.put('/api/entity/task', (req, res) => {
    res = setHeader(res);
    const id = req.body.username;
    const request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile('appFiles/' + id + '/tasks.json', 'utf8', (err, data) => {
      if (err) {
        result = {
          message: 'Error: No Task found for the user',
          result: 'error'
        };
      } else {
        if (data === '' || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
          if (taskList !== undefined && taskList !== null && taskList.length > 0) {
            taskList.forEach(function (task) {
              if (task.id === request.id) {
                taskList[taskList.indexOf(task)] = request;
              }
            });
            writeData(taskList, null, request.username);
          }
        }
        result = {
          message: 'Success: User task updated successfully',
          result: 'success',
        };
        return res.status('200').json(result);
      }
    });
  });

///////////////////
  function setHeaderBookMark(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
    return res;
  }

  function writeDataBookMark(bookList, request, username) {
    const bookmark = request;
    if (request !== null) {
      bookList.push(bookmark);
    }
    bookList = JSON.stringify(bookList);
    const dir = 'appFiles/' + username;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir + '/bookmarks.json', bookList, (err) => {
      if (err) throw err;
    });
    return bookmark;
  }

  app.post('/api/entity/bookmark', (req, res) => {
    res = setHeaderBookMark(res);
    let request = req.body;
    let bookList = [];
    let result = {};
    fs.readFile('appFiles/' + request.username + '/bookmarks.json', 'utf8', (err, data) => {
      if (err) {
        bookList = [];
        request = writeDataBookMark(bookList, request, request.username);
        result = {
          message: 'Success: Bookmark added successfully',
          result: 'success'
        };
      } else {
        if (data === '' || data === undefined || data === null) {
          bookList = [];
        } else {
          bookList = JSON.parse(data);
        }
        request = writeDataBookMark(bookList, request, request.username);
        result = {
          message: 'Success: Bookmark added successfully',
          result: 'success'
        };
      }
      return res.status('200').json(result);
    });
  });

  app.get('/api/entity/bookmark/:id', (req, res) => {
    res = setHeaderBookMark(res);
    const id = req.params.id;
    let bookList = [];
    let result = {};
    fs.readFile('appFiles/' + id + '/bookmarks.json', 'utf8', (err, data) => {
      if (err) {

        bookList = [];
        result = {
          message: 'Error: No Bookmark found for the user',
          result: 'error'
        };
      } else if (data) {
        if (data === '' || data === undefined || data === null) {
          bookList = [];
        } else {
          bookList = JSON.parse(data);
        }
        if (bookList !== undefined && bookList !== null && bookList.length > 0 && bookList[0].username === id) {
          result = {
            message: 'Success: User bookmark retrieved successfully',
            result: 'success',
            value: bookList
          };
        }
      }
      return res.status('200').json(result);
    });
  });

  app.post('/api/entity/delete/bookmark', (req, res) => {
    res = setHeaderBookMark(res);
    const id = req.body.username;
    let request = req.body;
    let bookList = [];
    let result = {};
    fs.readFile('appFiles/' + id + '/bookmarks.json', 'utf8', (err, data) => {
      if (err) {
        bookList = [];
        result = {
          message: 'Error: No Bookmark found for the user',
          result: 'error'
        };
      } else if (data) {
        if (data === '' || data === undefined || data === null) {
          bookList = [];
        } else {
          bookList = JSON.parse(data);
        }
        if (bookList.length > 0) {
          bookList.forEach(function (book) {
            if (book.id === request.id) {
              bookList.splice(bookList.indexOf(book), 1);
            }
          });
          writeDataBookMark(bookList, null, request.username);
          result = {
            message: 'Success: User bookmark removed successfully',
            result: 'success',
          };
        }
      }
      return res.status('200').json(result);
    });
  });