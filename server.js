
require('dotenv').config();

const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose');


const app = express();

app.use(cors());
app.use(express.json())

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is Required feild...'],
        trim: true,
        minlenght: [5, 'Title must have 5 charactor..']
    },
    content: {
        type: String,
        required: [true, 'Content is required feild..'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Auther is required feild']
    },
    category: {
        type: String,
        required: [true, 'Category is Required Feild']
    }
},
    {
        timestamps: true
    }
)

const Blog = mongoose.model("blogs", blogSchema)

const PORT = process.env.PORT || 3000;


//Create 

app.post('/api/blogs', async (req, res) => {
    try {
        let reqBody = req.body;
        let blog = await Blog.create(reqBody)
        res.status(200).json({
            message: `New Blog is Created Successfull !!!`,
            data: blog
        })
    } catch (err) {
        if (err.name === 'ValidataionError') {
            let errMsg = Object.values(err.errors)
            return res.status(400).json({
                message: 'Validation Error',
                errors: errMsg.map(e => e.message)
            })
        }

        res.status(500).json({
            message: `Faild to create Blog, Server Error`
        })
    }
})

// All Get 

app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find()

        res.status(200).json({
            message: `Blogs Fatced successfully !!!`,
            data: blogs
        })
    } catch (err) {
        res.status(500).json({
            message: `Faild to Fetch Blogs, Server Error`
        })
    }
})


// Single Get

app.get("/api/blogs", async (req, res) => {
    try {
        let { id } = req.params;
        let blog = await Blog.findById(id)

        if (!blog) {
            return res.status(404).json({
                message: `Blog with id ${id} Not Found.`
            })
        }

        res.status(200).json({
            message: `Blog Found`,
            data: blog
        })
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: `Invalid Blog ID`
            })
        }

        res.status(500).json({
            message: `Faild to Fetch Blogs, Server Error`
        })
    }
})

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing!!!')
        }

        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB is Connected Successfully!!!')

        app.listen(PORT, () => {
            console.log(`Application is running on port ${PORT}`)
        })
    }
    catch (err) {
        console.log(`Server Error`, err.message)
        process.exit(1);
    }
}

startServer()