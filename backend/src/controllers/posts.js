const path = require("path");
const fs = require("fs");

const db = require('../models')
const { Post,User,Comments,Likes } = db.sequelize.models

exports.createPost = async (req, res, next) => {
  let postObject = req.body
 
  if (req.file) {
    postObject = JSON.parse(req.body.post)
    postObject.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req.file.filename
    }`
  }

  try {
    let post = await Post.create({
      ...postObject, //...merges both arrays
      userId: req.user.userId
    }) 
    post = await Post.findOne({ where: { id: post.id }, include: [{model:User }]})
    res.status(201).json({ post })
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: [{model: User}, {model: Comments}]
  })
    .then(post => res.status(200).json({ post }))
    .catch(error => res.status(404).json({ error }))
}

exports.getAllPosts = (req, res, next) => {
  const limit = 4
  const page = parseInt(req.query.page) || 1
 
  const options = {
    include: [{ model: User }, {model: Comments}, {model: Likes}],
    limit,
    offset: limit * (page - 1),
    order: [['createdAt', 'DESC']]
  }

  if (req.query.userId) {
    options.where = {
      userId: parseInt(req.query.userId)
    }
  }

  Post.findAll(options)
    .then(posts => res.status(200).json({ posts }))
    .catch(error => res.status(400).json({error }))
}

exports.deletePost = (req, res, next) => {
  const where = {
    id: req.params.id
  }

  if (!req.user.admin) {
    where.userId = req.user.userId
  }

  Post.findOne({ where })
    .then(post => {
      if (!post) {
        res.status(400).json({ error: "You have no authorization!" })
      }
      post
        .destroy()
        .then(() =>
          res.status(200).json({ message: 'Post deleted!' })
        )
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error: error.message }))
}
