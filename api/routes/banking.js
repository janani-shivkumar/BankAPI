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
    pool.query('select * from banks', (err, res) => {
        response.status(200).json({
            message: "From Banking GET method",
            BankDetails: res["rows"]
        });
    });
});

router.post('/', checkauth, (req, res, next) => {
    const bank = {
        name: req.body.name,
        id: req.body.id
    }
    pool.query('INSERT INTO banks (name, id) VALUES ($1, $2)', [bank.name, bank.id], (err, results) => {
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

router.get('/:bankId', checkauth, (req, res, next) => {
    const id = req.params.bankId;
    pool.query('select * from banks where id = $1', [id], (err, results) => {
        if(results["rows"][0])
        {
            res.status(200).json({
                bankName: results["rows"]
            })
        }
        else{
            res.status(404).json({
                message: "No details for bank with ID - " + id
            })
        }
    })
});

router.delete('/:bankId', checkauth, (req, res, next) => {
    const id = req.params.bankId;

    pool.query('DELETE FROM banks WHERE id = $1', [id], (err, results) => {
        if(results)
        {
            res.status(200).json({
                message: id + ' deleted! '
            });
        }
    })
    
});

router.patch('/:bankId', checkauth, (req, res, next) => {
    const id = req.params.bankId;
    const {name} = req.body

    pool.query('UPDATE banks SET name = $1 where id = $2', [name, id], (err, results) => {
        if(results['rowCount'] == 1)
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
