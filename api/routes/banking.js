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

router.get('/', (req, res, next) => {

    var pg = require('pg');

    var conString = process.env.DATABASE_URL || "postgres://mofuiknrtdlrju:129dd1ed50a736ae395a2b4d13f6c98317628b9def66e9beaf15e8c2008bc32e@ec2-23-21-91-183.compute-1.amazonaws.com:5432/d4iq9173sc9hqf";
    var client = new pg.Client(conString);

    client.connect();

    // var query = client.query("select * from banks");

    // query.on("row", function (row, result) { 
    //     result.addRow(row); 
    // });

    // query.on("end", function (result) {          
    //     client.end();
    //     res.writeHead(200, {'Content-Type': 'text/plain'});
    //     res.write(JSON.stringify(result.rows, null, "    ") + "\n");
    //     res.end();  
    // });

    client.query('select * from banks', (err, result) => {
        res.status(200).json({
            message: "From Banking GET method",
            BankDetails: result
        });
    });

    // pool.query('select * from banks', (err, res) => {
    //     response.status(200).json({
    //         message: "From Banking GET method",
    //         BankDetails: res
    //     });
    // });
});

router.post('/', (req, res, next) => {
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

router.get('/:bankId', (req, res, next) => {
    const id = req.params.bankId;
    pool.query('select * from banks where id = $1', [id], (err, results) => {
        if(results)
        {
            res.status(200).json({
                bankName: results
            })
        }
        else{
            res.status(404).json({
                message: "No details for bank with ID - " + id
            })
        }
    })
});

router.delete('/:bankId', (req, res, next) => {
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

router.patch('/:bankId', (req, res, next) => {
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
