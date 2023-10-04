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

module.exports.getCurrentUserPosts = (req, res, next) => {
    
}