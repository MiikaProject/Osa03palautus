const mongoose = require('mongoose')


if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2]
let nimi =process.argv[3]
let numero = process.argv[4]


const url = `mongodb://puhelinluettelo:${password}@ds223015.mlab.com:23015/puhelinluettelodb`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name : nimi,
    number : numero
    
})


if(nimi === undefined){
    Person.find({}).then(result =>{
        console.log('puhelinluettelo:');  
        result.forEach(person =>{
            console.log(`${person.name} ${person.number}`);
            
        })
        mongoose.connection.close()
    })
    
} else {
    person.save().then(response =>{
        console.log(`lisätään ${nimi} ${numero} luetteloon`);
        mongoose. connection.close()
        
    })
}

