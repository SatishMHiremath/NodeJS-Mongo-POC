const Joi = require('joi');
const express = require('express');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/subscribe';

MongoClient.connect(url, function (err, database) {
    var db=database.db('subscribe');
    var cursor1=db.collection('users').find();
    
    cursor1.each(function(err, doc) {
        
                console.log(doc);
        
            });

    db.collection('users').insertOne({
        name: 'Ramesh M Hiremath',
        age: 34,
        status: 'A',
        groups: [ 'Editor', 'Manager' ]
    });
    
    db.collection('users').updateOne({
        "name": "Sindhu NM"
    }, {
        $set: {
            "name": "TESTER TEMP"
        }
    });

    db.collection('users').deleteOne(
        
        {
            "name": "TESTER TEMP"
        }
    );

    cursor1.each(function(err, doc) {
        
                console.log(doc);
        
    });

});

app.use(express.json());

const courses = [
    {id: 1, name:'Java'},
    {id: 2, name:'JavaSCRIPT'},
    {id: 3, name:'Nodejs'},
    
];

app.get('/api/courses',(req, res) => {
    res.send(courses);
});


app.delete('/api/courses/:id',(req, res) => {
    const course = courses.find(c => c.id===parseInt(req.params.id));
    if(!course) 
    res.status(404).send('The course with given id not found')
    
    const index = courses.indexOf(course);
    courses.splice(index,1);
    
    res.send(course);
    
});

app.put('/api/courses/:id',(req, res) => {
    
    const course = courses.find(c => c.id===parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with given id not found')
    }else {
        res.send(course);
    }
    
    // const result = validateCourse(req.body);
    const {error} = validateCourse(req.body);
     if(error) {
         res.status(400).send(error.details[0].message);
         return;
     }

    course.name = req.body.name; 
    res.send(course);
});


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
     }; 
     return Joi.validate(course, schema);
    
}

app.post('/api/courses',(req, res) => {
    const schema = {
       name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    if(!req.body.name || req.body.name.length<3) {
        res.status(400).send('Name is required and should be minimum 3 characters');
        return;
    }
    const course = {
        id: courses.length+1,
        name:req.body.name
    }
    courses.push(course);
    res.send(course);
});


app.get('/api/courses/:id',(req, res) => {
    const course = courses.find(c => c.id===parseInt(req.params.id));
    if(!course) {
        res.status(404).send('The course with given id not found')
    }else {
        res.send(course);
    }
});


app.get('/',(req, res) => {
    res.send('Hello World...!!!');
});

app.get('/api/courses',(req, res) => {
    res.send([1,2,3]);
});

app.get('/api/courses/:id',(req, res) => {
    res.send(req.params.id);
});

app.get('/api/posts/:year/:month/:id',(req, res) => {
    res.send(req.params);
});

app.get('/api/posts/:year/:month',(req, res) => {
    res.send(req.query);
});

// app.post();
// app.put();
// app.delete();
const port = process.env.PORT || 3000;
app.listen(port,() =>  console.log(`Listening to port : ${port}`) )