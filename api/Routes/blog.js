import express, { response } from "express"
import Blog from "../schema/BlogSchema.js"
import getAuth from "../middleware/auth.js"
import { get } from "mongoose"

const BlogRouter = express.Router()
BlogRouter.use(express.json())

BlogRouter.get("/", async (req, res) => {
        await Blog.find().populate("user", "-password").sort("-createdOn").then(result => {
            res.status(200).json(result)
        })
            .catch(err => {
                res.status(400).json({ msg: "No blogs found" })
            })
})

BlogRouter.post("/create", getAuth, async (req, res) => {
    try {
        const { title, content, image } = req.body
        console.log(req.body)
        if (title && content) {
            const blog = new Blog({
                title, content, image, user: req.userId
            })
            await blog.save()
            res.status(200).json({ msg: "blog is created", blog: blog })
        }

    }
    catch (err) {
        res.status(401).json({ msg: " Error occurred" })
    }
})

BlogRouter.delete("/delete/:id", getAuth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.id })
        console.log("this is delete ka backend", blog)
        if (!blog) {
            res.status(404).json({ msg: "Blog not found" })
        }
        else {

            res.status(200).json({ msg: "Blog deleted successfully" })
        }
    }
    catch (err) {
        res.status(401).json({ msg: " Error occurred" })
    }
})

BlogRouter.put("/update/:id", getAuth, async (req, res) => {
    const { title, content, image } = req.body;
    console.log("update", req.body);
    try {
        const updateBlog = await Blog.findOneAndUpdate(
            { _id: req.params.id, user: req.userId }, // Filter
            { title, content, image }, // Update
            { new: true } // Return the updated document
        );

        console.log("updatedblog", updateBlog);

        if (!updateBlog) {
            res.status(404).json({ msg: "Blog not found" });
        } else {
            res.status(200).json({ msg: "Blog is updated successfully", blog: updateBlog });
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: "Error occurred" });
    }
});


BlogRouter.get("/:id", getAuth,async (req, res) => {
    await Blog.findById(req.params.id).populate("user", "-password").then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.status(400).json({error:err})
    })
})

export default BlogRouter 