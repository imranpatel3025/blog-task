
require('dotenv').config();

const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose');


const app = express();

app.use(cors());
app.use(express.json())

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, 'Title is Required feild...'],
        trim : true,
        minlenght : [5, 'Title must have 5 charactor..']
    },
    content : {
        type : String,
        required : [true, 'Content is required feild..'],
        trim : true
    },
    author : {
        type : String,
        required : [true, 'Auther is required feild']
    },
    category : {
        type : String,
        required : [true, 'Category is Required Feild']
    }
},
{
    timestamps : true
}
)

const Blog = mongoose.model("blogs", blogSchema)

const PORT = process.env.PORT || 3000;


async function startServer() {
    try{
        if(!process.env.MONGODB_URI){
            throw new Error('MONGODB_URI is missing!!!')
        }

        await mongoose .connect(process.env.MONGODB_URI)
        console.log('MongoDB is Connected Successfully!!!')

        app.listen(PORT, () => {
            console.log(`Application is running on port ${PORT}`)
        })
    }
    catch(err){
        console.log(`Server Error`, err.message)
        process.exit(1);
    }
}

startServer()