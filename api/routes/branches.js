const express = require('express');
const checkauth = require('../middleware/check-auth')
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'js025093',
    host: 'localhost',
    database: 'BANK',
    password: 'janani',
    port: 5432
})

const router = express.Router();

router.get('/', checkauth, (request, response, next) => {
    pool.query('select * from branches', (err, res) => {
        response.status(200).json({
            message: "From Banking GET method",
            BankDetails: res["rows"]
        });
    });
});

router.post('/', checkauth, (req, res, next) => {
    const {ifsc, bank_id, branch, address, city, district, state} = req.body
    pool.query('INSERT INTO branches (name, id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ifsc, bank_id, branch, address, city, district, state], (err, results) => {
        if(results["rowCount"]==1)
        {
            res.status(200).json({
                message: "From Banking POST method",
                createdBank: results
            });
        }
        else{
            res.status(200).json({
                message: "Error in posting bank details",
            });
        }
    })
    
});

router.get('/:ifsc', checkauth, (req, res, next) => {
    const ifsc = req.params.ifsc;
    pool.query(' SELECT ID, NAME FROM BANKS INNER JOIN BRANCHES ON BANKS.ID = BRANCHES.BANK_ID AND BRANCHES.IFSC = $1', [ifsc], (err, results) => {
        if(results)
        {
            res.status(200).json({
                bankDetails: results["rows"]
            })
        }
        else{
            res.status(404).json({
                message: "No details for bank with ID - " + ifsc
            })
        }
    })
});


router.get('/:city/:name', checkauth, (req, res, next) => {
    const name = req.body.name;
    const city = req.body.city;
    // SELECT * FROM BRANCHES INNER JOIN BANKS ON BANKS.ID = BRANCHES.BANK_ID WHERE BANKS.NAME = 'ABHYUDAYA COOPERATIVE BANK LIMITED' AND BRANCHES.CITY = 'MUMBAI';
    pool.query(' SELECT * FROM BRANCHES INNER JOIN BANKS ON BANKS.ID = BRANCHES.BANK_ID WHERE BANKS.NAME = $1 AND BRANCHES.CITY = $2', [name, city], (err, results) => {
        res.status(200).json({
            err: err,
            res: results["rows"]
        })
    })
})

module.exports = router;