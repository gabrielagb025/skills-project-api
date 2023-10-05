const Post = require('../models/post.model');

module.exports.createPost = (req, res, next) => {
    const postData = {
            ...req.body,
            multimedia: req.files ? req.files.map(file => file.path) : undefined,
            user: req.currentUser,
            date: new Date()
    }

    Post.create(postData) 
        .then((post) => {
            res.json(post)
        })
        .catch(next)
}

module.exports.deletePost = (req, res, next) => {
    const { id } = req.params;
    Post.findByIdAndDelete(id)
        .then((rating) => {
            console.log('post borrado')
            res.status(204).json({status: "ok"})
        })
        .catch(next)
}

module.exports.getCurrentUserPosts = (req, res, next) => {
    const user = req.currentUser
    Post.find({ user: user })
        .then((posts) => {
            res.json(posts)
        })
        .catch(next)
}

