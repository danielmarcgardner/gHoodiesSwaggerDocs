'use strict'

function getCohorts(req, res) {
  	let knex = require('../../knex.js');

  knex('cohorts').select('id', 'gnum')
    .then((justCohort) => {
        return res.status(200).json(justCohort)
    })
    .catch((err) => {
        console.error(err);
        return res.status(500)
      })
      .finally(function() {
        knex.destroy()
      })
}

function getStudentsByCohort(req, res){
  let gnum = Number.parseInt(req.swagger.params.gnum.value);

if (!gnum) {
    res.set('Content-Type', 'text/plain');
    res.body = 'Bad Request';
    return res.sendStatus(400);
}
  	let knex = require('../../knex.js');

knex('students')
  .join('cohorts', 'cohorts.id', '=', 'students.cohort_id')
  .select('name', 'fulfilled', 'size').where('cohort_id', gnum)
    .then((cohortStudents) => {
        return res.status(200).json(cohortStudents);
    })
    .catch((err) => {
        console.error(err);
        return res.status(500);
    })
    .finally(function() {
        knex.destroy();
    });
}

module.exports = {
  getCohorts: getCohorts,
  getStudentsByCohort: getStudentsByCohort
}
