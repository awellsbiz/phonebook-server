const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1> It is all beginning </h1>')
})

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find( person => person.id === id)
    if (person) {
        res.send(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req,res) => {
    const currentDate = new Date()
    const numberOfPeople = persons.length
    res.send(`<h1>The info page </h1> <p> You have ${numberOfPeople} people in the phone book </br> ${currentDate} </p>`)
})

app.delete('/api/persons/:id', (req,res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

function generateId(){
    const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
    return maxId + 1
}
app.use(morgan('tiny'))
app.post('/api/persons', (req,res) => {
    const body = req.body
    const checkForDuplicate = persons.find(person => person.name === body.name || person.number === body.number)
    if (!body.name || !body.number){
        return res.status(400).json({
            error: "Name or number Number missing"
        })
    } else if (checkForDuplicate) {
        return res.status(400).json({
            error: "Number or Name Duplicate"
        })
    }
    const newPerson = {
        id: generateId(), 
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)

    
})
const PORT = 3000
app.listen(PORT)