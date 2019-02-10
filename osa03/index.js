if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan('tiny'))







app.get('/', (req, res) => {
  res.send('<h1>Hello! </h1>')
})

app.get('/api/persons', (req, res,next) => {


  Person.find({}).then(personsdb => {
    res.json(personsdb.map(person => person.toJSON()))
  })
    .catch(error => next(error))
})



app.get('/api/persons/:id', (req, res, next) => {

  Person.findById(req.params.id).then(person => {
    console.log(person)

    res.json(person.toJSON())
  })
    .catch(error => next(error))


})


app.get('/info', (req, res, next) => {

  Person.find({})
    .then(persondb => {
      const lkm = persondb.map(person => person).length
      const aika = new Date()
      res.send(`<p>Puhelinluettelossa ${lkm} henkilön tiedot </p> <p> \n ${aika}</p> `)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

})


app.post('/api/persons', (req, res, next) => {

  var body = req.body
  console.log(body)
  if (body.name === '') {

    return (res.status(400).json({
      error: 'name missing'
    }))
  }

  const person = new Person({
    name: body.name,
    number: body.number

  })

  person.save().then(personSaved => {
    res.json(personSaved.toJSON())
  })
    .catch(error => next(error))




})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  console.log('put reitti')

  const person = {
    name: body.name,
    number: body.number
  }
  console.log(person)


  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(updatedPerson)

      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
