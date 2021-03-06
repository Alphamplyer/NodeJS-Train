const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.users_signup = (request, response, next) => {
    User.find({ email: request.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return response.status(409).json({
                message: 'Email already used'
            })
        }
        else {
            bcrypt.hash(request.body.password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        email: request.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        response.status(201).json({
                            message: 'User created'
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        response.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({
            error: err
        });
    });
}

exports.users_login = (request, response, next) => {
    User.findOne({ email: request.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return response.status(401).json({
                message: "Authentification fail"
            })
        }
        bcrypt.compare(request.body.password, user.password, (err, result) => {
            if (err) {
                return response.status(401).json({
                    message: "Authentification fail"
                })
            }
            if (result) {
                const token = jwt.sign(
                    { 
                        email: user.email, 
                        userId: user._id 
                    },
                    process.env.JWT_KEY, 
                    {
                        expiresIn: '1h'
                    }
                );
                return response.status(200).json({
                    message: 'Authentification succeeded',
                    token: token
                })
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({
            error: err
        });
    });
}

exports.users_delete = (request, response, next) => {
    User.remove({ _id: request.params.userId })
    .exec()
    .then(result => {
        console.log(result);
        response.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({
            error: err
        });
    });
}