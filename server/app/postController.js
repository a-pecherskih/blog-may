const pool = require('../config/db');

exports.getPosts = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});

    try {
        const result = await pool.query('SELECT * FROM posts');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getPostById = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});

    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (result.rows[0]) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Post not found");
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.createPost = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});

    const {name, email} = req.body;
    try {
        const result = await pool.query('INSERT INTO posts (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updatePost = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});

    const {id} = req.params;
    const {name, email} = req.body;
    try {
        const result = await pool.query('UPDATE posts SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deletePost = async (req, res) => {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});

    const {id} = req.params;
    try {
        await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};