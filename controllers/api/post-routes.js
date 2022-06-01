const router = require('express').Router()
const sequelize = require('../../config/connection')
const {Post, User, Vote, Comment } = require('../../models')

// Get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'post_url',
            'user_id'
        ]
    })
    .then(dbPostData => {
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})
// Get a post by ID
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No post found with this id!`})
    })
})

// Create a post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => {
        res.json(dbPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// UPDATE a post
router.put('/:id', (req, res) => {
    Post.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUpdatedPostData => {
        res.json(dbUpdatedPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No post found with this id!`})
    })
})

// DELETE a post
router.delete('/:id', (req, res) => {
    Post.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbUpdatedPostData => {
        res.json(dbUpdatedPostData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No post found with this id!`})
    })
})

module.exports = router