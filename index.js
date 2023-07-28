const express = require('express');

const server = express();
server.use(express.json());

const courses = [ 'NodeJs', 'JS', 'React Native' ];

function validCourseId(req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({ error: "ID is a mandatory field."});
  }
  if (!courses[req.params.id]) {
    return res.status(404).json({ error: `Course not found (ID: #${req.params.id}).`});
  }
  req.courseName = courses[req.params.id];
  return next();
}

function validCourseName(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Name is a mandatory field."});
  }
  return next();
}

// Global Middleware
server.use((req, res, next) => {
  console.log(`Request received - URL: ${req.url} - ${req.method}`);

  return next();
});

// Query params => ?name=John&age=20
server.get('/courses', (req, res) => {
  return res.json(courses);
});

// Route params => /courses/1
server.get('/courses/:id', validCourseId, (req, res) => {
  return res.json({result: `Getting record #${req.courseName}` });
});

// Request body => { name: "NodeJs", type: "back end" } 
server.post('/courses', validCourseName, (req, res) => {
  const { name } = req.body;
  courses.push(name);
  return res.json(courses);
});

server.put('/courses/:id', validCourseId, validCourseName, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  courses[id] = name;
  return res.json(courses);
});

server.delete('/courses/:id', validCourseId, (req, res) => {
  const { id } = req.params;
  courses.splice(id, 1);
  return res.json(courses);
});


server.listen(3000);

