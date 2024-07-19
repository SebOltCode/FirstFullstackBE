// Import utility functions
import {
    getResourceId,
    processBodyFromRequest,
    returnErrorWithMessage,
} from './utils.js';
import pg from 'pg';
const {Client} = pg;

export const createPost = async (req, res) => {
    try {
        const body = await processBodyFromRequest(req);
        if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
        const parsedBody = JSON.parse(body);

        const client = new Client({
            connectionString: process.env.PG_URI,
        });

        await client.connect();
        const result = await client.query(
            ' INSERT INTO posts (title, author, content) VALUES ($1, $2, $3) RETURNING *;',
            [parsedBody.title, parsedBody.author, parsedBody.content]
        );
        await client.end();
        console.log('result', result);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify({message: 'Post created', result: result.rows[0]})
        );
    } catch (error) {
        returnErrorWithMessage(res);
    }
};

export const getPosts = async (req, res) => {
    try {
        const client = new Client({
            connectionString: process.env.PG_URI,
        });
        await client.connect();
        const results = await client.query('SELECT * FROM posts');
        await client.end();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify({message: 'Posts fetched', posts: results.rows})
        );
    } catch (error) {
        console.error('Error fetchign posts: ', error);
        returnErrorWithMessage(res);
    }
};

export const getPostById = (req, res) => {
    const id = getResourceId(req.url);
    console.log('Here we have access to the ID: ', id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Post fetched'}));
};

export const updatePost = async (req, res) => {
    try {
        const id = getResourceId(req.url);
        const body = await processBodyFromRequest(req);
        if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
        const parsedBody = JSON.parse(body);
        const client = new Client({
            connectionString: process.env.PG_URI,
        });
        await client.connect();
        const results = await client.query(
            'Update posts SET title = $1, author = $2, content = $3 WHERE id = $4 RETURNING *',
            [parsedBody.title, parsedBody.author, parsedBody.content, id]
        );
        await client.end();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify({message: 'Post updated', result: results.rows[0]})
        );
    } catch (error) {
        console.error8('Error updating post: ', error);
        returnErrorWithMessage(res);
    }
};

export const deletePost = async (req, res) => {
    try {
        const id = getResourceId(req.url);
        const client = new Client({
            connectionString: process.env.PG_URI,
        });
        await client.connect();
        await client.query('DELETE FROM posts WHERE ID = $1', [id]);
        await client.end();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({message: 'Post deleted'}));
    } catch (error) {
        console.error('Error deleting post: ', error);
        returnErrorWithMessage(res);
    }
};