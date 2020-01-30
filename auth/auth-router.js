const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');


router.get('/users', (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

router.post('/login', (req, res) =>{
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);

            res.status(200).json({
                message: `Whaddup, ${user.username}`,
                token,
            });
        } else {
            res.status(401).json({ message: "You ain't right!"});
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


function generateToken(user){
    const payload = {
        subject: user.id,
        username: user.username,

    };


    const secret = 'Big secret';

    const options = {
        expiresIn: '24h',
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router;