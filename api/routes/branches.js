const express = require('express');
const checkauth = require('../middleware/check-auth')
const Pool = require('pg').Pool
// const pool = new Pool({
//     user: 'js025093',
//     host: 'localhost',
//     database: 'BANK',
//     password: 'janani',
//     port: 5432
// })

const router = express.Router();
var pg = require('pg');

var conString = process.env.DATABASE_URL || "postgres://mofuiknrtdlrju:129dd1ed50a736ae395a2b4d13f6c98317628b9def66e9beaf15e8c2008bc32e@ec2-23-21-91-183.compute-1.amazonaws.com:5432/d4iq9173sc9hqf";
var client = new pg.Client(conString);

client.connect();

router.get('/', (request, response, next) => {
    client.query('select * from branches', (err, res) => {
        response.status(200).json({
            message: "From Banking GET method",
            BankDetails: res["rows"]
        });
    });
});

router.post('/', checkauth, (req, res, next) => {
    const {ifsc, bank_id, branch, address, city, district, state} = req.body
    client.query('INSERT INTO branches (name, id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ifsc, bank_id, branch, address, city, district, state], (err, results) => {
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
    client.query(' SELECT ID, NAME FROM BANKS INNER JOIN BRANCHES ON BANKS.ID = BRANCHES.BANK_ID AND BRANCHES.IFSC = $1', [ifsc], (err, results) => {
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
    const name = req.params.name;
    const city = req.params.city;
    // SELECT * FROM BRANCHES INNER JOIN BANKS ON BANKS.ID = BRANCHES.BANK_ID WHERE BANKS.NAME = 'ABHYUDAYA COOPERATIVE BANK LIMITED' AND BRANCHES.CITY = 'MUMBAI';
    client.query('SELECT * FROM BRANCHES INNER JOIN BANKS ON BANKS.ID = BRANCHES.BANK_ID WHERE BANKS.NAME = $1 AND BRANCHES.CITY = $2 ORDER BY BANKS.ID OFFSET $3 LIMIT $4', [name, city, global.offset, global.limit], (err, results) => {
        res.status(200).json({
            err: err,
            params:  global.limit,  
            off: global.offset,
            res: results["rows"]
        })
    })
})

module.exports = router;
