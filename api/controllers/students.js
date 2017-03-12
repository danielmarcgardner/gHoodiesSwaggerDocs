'use strict';

const bodyParser = require('body-parser');

module.exports = {
	getStudents: getStudents,
	getStudent: getStudent,
	addStudent: addStudent,
	updateStudent: updateStudent,
  getStudentByName: getStudentByName
};

function addStudent(req, res) {
	let knex = require('../../knex.js');
	let name = req.body.firstName + " " + req.body.lastName
	if (!name ||  !req.body.email || !req.body.size || !req.body.cohort_id) {
			res.set('Content-Type', 'text/plain');
			res.body = 'Bad Request';
			return res.sendStatus(400);
	}
	let newStudent = {
			name: name,
			email: req.body.email,
			size: req.body.size,
			cohort_id: req.body.cohort_id
	}
	console.log('hello');
	knex('students').insert(newStudent, '*')
			.then((inserted) => {
					res.status(200).send(inserted)
					})
			.catch((err) => {
					knex.destroy();
					console.error(err);
					res.status(500);
			});
}

function getStudent(req, res){
	let knex = require('../../knex.js');
	let id = Number.parseInt(req.swagger.params.id.value);

	if (!id) {
			res.set('Content-Type', 'text/plain');
			res.body = 'Bad Request';
			return res.sendStatus(400);
	}

	knex('students')
			.where('id', id)
			.then((student) => {
					return res.status(200).json(student);
			})
			.catch((err) => {
					console.error(err);
					return res.status(500);
			})
			.finally(function() {
					knex.destroy();
			});
}

function getStudents(req, res) {
	let knex = require('../../knex.js');

	knex('students')
			.orderBy('name', 'asc')
			.then((students) => {
					return res.status(200).json(students);
			})
			.catch((err) => {
					console.error(err);
					return res.status(500);
			})
			.finally(function() {
					knex.destroy();
			});
}

function updateStudent(req,res) {
  let idStudent = Number.parseInt(req.swagger.params.id.value);
  if (!idStudent) {
      res.set('Content-Type', 'text/plain');
      res.body = 'Bad Request';
      return res.sendStatus(400);
  }

  let name = req.body.firstName + " " + req.body.lastName
  const knex = require('../../knex.js');
  let id = Number(req.body.id);

  let updated = {
    cohort_id: Number(req.body.cohort_id),
    size: req.body.size,
    id: idStudent,
    created_at: req.body.created_at,
    fulfilled: false,
    name: name,
    email: req.body.email,
    updated_at: knex.fn.now()
  }

  knex('students')
      .where('id', idStudent)
      .update(updated, '*')
      .then((data) => {
          res.status(200).send(data)
      })
      .catch((err) => {
        console.error(err.stack);
        return res.sendStatus(500);
      })

      .finally(function() {
        knex.destroy()
      })
    }

  function getStudentByName(req, res){
    let namewithspace = req.swagger.params.name.value

    function remover(named) {
      let remove = named.split('%20')
      let unname = remove.join(' ')
      return unname
    }

  let name = remover(namewithspace)

  if (!name) {
      res.set('Content-Type', 'text/plain');
      res.body = 'Bad Request';
      return res.sendStatus(400);
  }

  	let knex = require('../../knex.js');

  knex('students')
      .where('name', name)
      .then((student) => {
          return res.status(200).json(student);
      })
      .catch((err) => {
          console.error(err);
          return res.status(500);
      })
      .finally(function() {
          knex.destroy();
      });
    }
