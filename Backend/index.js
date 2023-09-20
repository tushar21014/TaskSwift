const connectToMongo = require('./db');
connectToMongo(); 
const express = require('express')
var cors = require('cors')
const cookieParser = require('cookie-parser');


const app = express()
app.use(cookieParser());

const port = 5004

app.use(express.urlencoded({extended:false}))
app.use(cors({
  origin: 'http://localhost:3000', // The URL of your frontend
  credentials: true, // Allow credentials (cookies)
}));

app.use(express.json())
app.use('/api/auth', require("./Routes/auth"))
app.use('/api/mentor', require("./Routes/mentor"))
app.use('/api/director', require("./Routes/director"))
app.use('/api/intern', require("./Routes/intern"))
app.use('/api/superuser', require("./Routes/superuser"))
// app.use('/api/user', require("./Routes/user"))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
