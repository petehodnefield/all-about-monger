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
        },
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
          },
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
          {
              model: Post,
              attributes: ['title'],
              through: Vote,
              as: 'voted-posts'
          }
        ]
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
        // TODO: CHECK user-routes in just technews here
    })
    .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id
          req.session.username = dbUserData.username
          req.session.loggedIn = true
  
          res.json(dbUserData)
        })
      })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Login
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        // Declare session variables
        req.session.user_id = dbUserData.id
        req.session.username = dbUserData.username,
        req.session.loggedIn = true
  
        res.json({user: dbUserData, message: `You are now logged in!`})
      })
    });
  });

  // Logout
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end()
      })
    }
    else {
      res.status(404).end()
    }
  })

// Update a user
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
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