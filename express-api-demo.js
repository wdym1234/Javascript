const Joi = require('@hapi/joi'); //this is a class 
const express = require('express'); 
const app = express(); 

app.use(express.json()); //adding middleware for using in request processing pipeline

//Dynamic PORT 
const port = process.env.PORT || 3000 //port is dynamically assigned by hosting envir (use envir variable)
app.listen(port, () => console.log(`Listening on Port ${port}....`)); 

const genres = [
    {id: 1, name: "action"},
    {id: 2, name: "horror"},
    {id: 3, name: "thriller"},
    {id: 4, name: "comedy"} 
];


//GET

//all genres
app.get('/api/genres', (req, res) => {
    res.send(genres); 
});

//specific genre (id from client)
app.get('/api/genres/:id', (req, res) => {
    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("genre not found"); 
    res.send(genre); 
}); 




//POST 
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body); //validate client data
    if(error) return res.status(400).send(error.details[0].message); //if not valid, send error to client

    //real world, access database to create a new record 
    const genre = {
        id: genres.length + 1, 
        name: req.body.name, 
    };
    genres.push(genre); 

    res.send(genre); //send new record back to client
})



//PUT
app.put('/api/genres/:id', (req, res) => {
    let genre = genres.find(g => g.id === parseInt(req.params.id)); //get genre
    if(!genre) return res.status(404).send("genre not found"); //if not exist, return message to client

    const { error } = validateGenre(req.body); //validate method, access error field in returned obj
    if(error) return res.status(400).send(error.details[0].message); //error mssage

   genre.name = req.body.name; //update record 
   res.send(genre); //send updated record to client
});



//DELETE


//Client req. validation 
function validateGenre (genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre); 

}