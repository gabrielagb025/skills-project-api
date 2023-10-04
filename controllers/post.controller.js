const Post = require('../models/post.model');

module.exports.createPost = (req, res, next) => {
    const postData = {
            ...req.body,
            user: req.currentUser,
            date: new Date()
    }

    Post.create(postData) 
        .then((post) => {
            res.json(post)
        })
        .catch(next)
}