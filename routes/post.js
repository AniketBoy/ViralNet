const router = require("express").Router();
const Post = require("../modals/post.js")


//create post
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const save = await newPost.save();
        res.status(200).json(newPost);
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//update post
router.put("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.params.id) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("You have update your post")
        }
        else {
            res.status(403).json("You can only update your own post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }


})
//delete post
router.delete("/:id", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId == req.params.id) {
            await post.deleteOne()
            res.status(200).json("You have deleted your post")
        }
        else {
            res.status(403).json("You can only delete your own post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }


})
// like||dislike a post
router.put("/:id/like", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.params.userId)) {
            await post.updateOne({ $push: { likes: req.params.userId } })
            res.status(200).json("You have liked the post")
        } else {
            await post.updateOne({ $pull: { likes: req.params.userId } })
            res.status(200).json("You have disliked the post")
        }
    }
    catch (err) {
        res.status(500).json(err)

    }

})

//get post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)

    }
    catch (err) {
        res.status(500).json(err)

    }
})

//get all post from followings
router.get("/timeline/all", async (req, res) => {

    try {
        const currentUser = await Post.findById(req.body.userId);
        const currentPost = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                Post.find({ userId: friendId })
            })

        )
        res.json(currentPost.concat(...friendPosts))
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;