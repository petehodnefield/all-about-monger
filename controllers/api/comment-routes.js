const router = require('express').Router()
const {Comment, User} = require('../../models')

// Get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: [
            'id',
            'comment_text',
            'user_id',
            'post_id',
            'createdAt'
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
})

// Delete a comment

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
            }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found!'})
            return
        }
        res.json(dbCommentData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Create a comment
router.post('/', (req, res) => {
    // TODO: add withAuth and if req.session
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.body.user_id
    })
    .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

module.exports = router