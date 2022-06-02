const router = require('express').Router()
const sequelize = require('../../config/connection')
const {Post, User, Vote, Comment } = require('../../models')

// Get all posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: User,
              attributes: ['username']
            }
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
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
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
// TODO: add withAuth below
router.put('/upvote', (req, res) => {
    // Pass session id along with all destructured properties on req.body
    Post.upvote({...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
    .then(updatedVoteData => res.json(updatedVoteData))
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