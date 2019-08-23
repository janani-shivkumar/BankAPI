const express = require('express');
const jwt = require('jsonwebtoken');
process.env.JWT_KEY = 'secret'
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'js025093',
    host: 'localhost',
    database: 'BANK',
    password: 'janani',
    port: 5432
})

const router = express.Router();

router.post('/signup', (req, res, next) => {
    const user = {
        emailid: req.body.emailid,
        password: req.body.password,
        id: req.body.id
    }

    pool.query('SELECT * FROM users_tbl WHERE emailid = $1', [user.emailid], (err, results) => {
        if(results["rowCount"])
        {
            res.status(200).json({
                message: "User Exist"
            })
        }
        else{
            pool.query('INSERT INTO users_tbl (emailid, id, password) VALUES ($1, $2, $3)', [user.emailid, user.id, user.password], (err, results) => {
                if(results["rowCount"]== 1)
                {
                    res.status(200).json({
                        message: "User Added"
                    })
                }
            })
        }
    })
});

router.post('/login', (req, res, err) => {
    email = req.body.emailid
    pwd = req.body.password
    pool.query('SELECT * FROM users_tbl WHERE emailid = $1',[email], (err, results) => {
        if(results["rowCount"])
        {
            // console.log(results)
            if(results["rows"][0]["password"] == pwd)
            {
                const token = jwt.sign({
                    email: results["rows"]["emailid"],
                    id: results["rows"]["id"]
                },  process.env.JWT_KEY,
                {
                    expiresIn: "120h"
                })
                res.status(200).json({
                    message: "User logged in!",
                    UserDetails: results["rows"],
                    token: token
                })
            }
            else{
                res.status(404).json({
                    message: "Entered wrong password!"
                })
            }
        }
        else{
            res.status(404).json({
                message: "User not found!"
            })
        }
    })
})

router.delete('/:id', (req, res, err) => {
    id = req.body.id
    pool.query('DELETE FROM users_tbl WHERE id = $1', [id], (err, results) => {
        if(results)
        {
            res.status(200).json({
                message: "User deleted!"
            })
        }
    })
})

module.exports = router;