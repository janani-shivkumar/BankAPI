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

var pg = require('pg');

var conString = process.env.DATABASE_URL || "postgres://mofuiknrtdlrju:129dd1ed50a736ae395a2b4d13f6c98317628b9def66e9beaf15e8c2008bc32e@ec2-23-21-91-183.compute-1.amazonaws.com:5432/d4iq9173sc9hqf";
var client = new pg.Client(conString);

client.connect();

router.get('/', (req, res, next) => {

    client.query('select * from banks', (err, result) => {
        res.status(200).json({
            message: "From Banking GET method",
            BankDetails: result
        });
    });
});

router.post('/', checkauth, (req, res, next) => {
    const bank = {
        name: req.body.name,
        id: req.body.id
    }
    client.query('INSERT INTO banks (name, id) VALUES ($1, $2)', [bank.name, bank.id], (err, results) => {
        if(results)
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

router.get('/:bankId', (req, res, next) => {
    const id = req.params.bankId;
    client.query('select * from banks where id = $1', [id], (err, results) => {
        res.status(200).json({
            Results: results["rows"]
        })
    //     if(results["rows"])
    //     {
    //         res.status(200).json({
    //             bankName: results
    //         })
    //     }
    //     else{
    //         res.status(404).json({
    //             message: "No details for bank with ID - " + id
    //         })
    //     }
    })
});

router.delete('/:bankId', checkauth, (req, res, next) => {
    const id = req.params.bankId;

    client.query('DELETE FROM banks WHERE id = $1', [id], (err, results) => {
        if(results)
        {
            res.status(200).json({
                message: id + ' deleted! '
            });
        }
    })
    
});

router.patch('/:bankId', (req, res, next) => {
    const id = req.params.bankId;
    const {name} = req.body

    client.query('UPDATE banks SET name = $1 where id = $2', [name, id], (err, results) => {
        if(results['rowCount'])
        {
            res.status(200).json({
                // UpdatedBankDetails: results,
                message: id + ' Updated!'
            })
        }
        else{
            res.status(200).json({
                message: "Failed to update bank Id " + id
            })
        }
    })
});

module.exports = router;
