const pool = require('../config/db');
jwt = require('jsonwebtoken')

exports.authUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const result = await pool.query('SELECT * FROM users where email = $1 and password = $2', [email, password]);
        const user = result.rows[0];

        if (user) {
            return res.status(200).json({
                id: user.id,
                login: user.login,
                token: jwt.sign({id: user.id}, process.env.JWT_SECRET_TOKEN),
            });
        } else {
            return res.status(404).json({error: 'User not found'});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows[0]) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.createUser = async (req, res) => {
    const {name, email} = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    try {
        const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};