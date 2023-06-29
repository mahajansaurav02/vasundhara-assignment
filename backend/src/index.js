const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000; 

app.use(express.json());

mongoose.connect("mongodb+srv://sauravmahajan2007:JHdE3bkexVCJtxIB@cluster0.fno6qas.mongodb.net/",
   {useNewUrlParser : true}
)
.then(()=>console.log("mongoDB Is connected"))
.catch((err)=>console.log(err))

app.use('/api/auth', require('./routes/auth')); 
app.use('/api/students', require('./routes/students')); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});