const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: 'You so wrong for that.'});
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Unexpected Error'});
        });
    } else {
        res.status(400).json({ message: 'You shall not Pass!'});
    }
};