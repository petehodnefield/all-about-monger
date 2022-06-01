const router = require('express').Router()
const {User} = require('../../models')


// Get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: [
            'id',
            'username',
            'email'
        ],
        exclude: ['password']
    })
    .then(dbUserData => {
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Get a single user
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No user found!`})
    })
})
// Create a user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Update a user
router.put('/:id', (req, res) => {
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUpdatedUserData => {
        res.json(dbUpdatedUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No user found!`})
    })
})

// Delete a user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUpdatedUserData => {
        res.json(dbUpdatedUserData)
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({message: `No user found!`})
    })
})

module.exports = router