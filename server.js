var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var Schema = mongoose.Schema; // probably unnecesary
app.use(bodyParser.json()); //DO NOT FORGET THIS STEP!!!
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
mongoose.connect('mongodb://localhost/1955API');

var PeopleSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1}
},{timestamps: true});

mongoose.model('People', PeopleSchema);

var People = mongoose.model('People');

app.get('/', function(req,res){
    People.find({}, function(err,people){
        if(err){
            console.log('problem', err);
        }
        else {
            res.json({message: "Success", data: people});
        }
    })
})
app.get('/:name', function(req, res){
    name = req.params.name;
    People.findOne({name: name}, function(err, people){
        if(err){
            console.log('problem', err);
        }
        else {
            res.json({message: "Success", data: people});
        }
    })
})
app.get('/new/:name', function(req,res){
    name = req.params.name;
    var people = new People({name: name});
    people.save(function(err){
        if(err){
            console.log('could not add', err);
        }
        else {
            People.findOne({name: name}, function(err, people){
                console.log(people)
                if(err){
                    console.log('problem')
                    console.log(err);
                }
                else {
                    res.json({message: "Success", data: people});
                }
            })
        }
    })
})
app.get('/remove/:name', function(req,res){
    name = req.params.name;
    console.log(name);
    People.remove({name: name}, function(err){
        if(err){
            console.log('problem', err);
        }
        else {
            res.redirect('/');
        }
    })
})

app.listen(8000, function(){
    console.log("listening on port 8000");
})