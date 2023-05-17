const express = require('express');
const session = require('express-session');
const database = require('./db');
const steraliseInput= require('./inputSterilisation')
const blog = require('express').Router();
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const cookieParser = require('cookie-parser');

require('dotenv').config({ path: './config.env' });
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
blog.use(csrfProtection);

blog.use(cookieParser());
// Configure session middleware
blog.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // Ensures cookies are only sent over HTTPS
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            sameSite: 'strict', // Restricts the cookie to be sent only with same-site requests
            maxAge: 60 * 60 * 24, // expiration time 1 day
        },
    })
);


blog.use((req, res, next) => {
    res.setHeader('X-CSRF-Token', req.csrfToken());
    next();
});
blog.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
blog.get('/', (req, res) => {
    res.sendFile('blog.html', { root: './frontend' });
});

blog.get('/updatePost',(req, res) => {
    res.sendFile('updatePost.html', { root: './frontend' });
});


blog.get('/updatePost.js', (req, res) => {
    res.sendFile('updatePost.js', { root: './frontend' });
});

blog.get('/createPost',(req, res) => {
    res.sendFile('createPost.html', { root: './frontend' });
});

blog.get('/createPost.js', (req, res) => {
    res.sendFile('createPost.js', { root: './frontend' });
});

blog.use((error, req, res, next) => {
    if (error.code === 'EBADCSRFTOKEN') {
        // errors here
        res.status(403);
        res.sendFile(path.join(__dirname, '../frontend/bad.html'));
        console.log(__dirname)
    } else {
        // !pass it to the next error handler
        next(error);
    }
});
blog.use((error, req, res, next) => {
    console.error(error);

    // (Internal Server Error)
    res.status(500);
    res.send('An error occurred. Please try again later.');
});
blog.get('/posts',async(res,req)=>{
    const user_id = Number(res.session.user_id)

    

    data = await database.query(`select users.user_name, users.user_id,
    posts.post_id, posts.user_id, posts.title, posts.body, posts.created_at, posts.updated_at 
    from user_data.posts 
    inner join user_data.users on posts.user_id = users.user_id
    order by created_at`)

    for (const row of data.rows) {
        const res = await database.query('SELECT encryption_key FROM user_data.users WHERE user_id = $1', [row.user_id]);
        const key = CryptoJS.AES.decrypt(res.rows[0].encryption_key, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        row.user_name = CryptoJS.AES.decrypt(row.user_name, key).toString(CryptoJS.enc.Utf8);
      }
    req.send(JSON.stringify(data = {posts:data.rows, id :user_id}))
})

blog.post('/updateRequest',async(req,res)=>{
    const user_id = Number(req.session.user_id)
    const post_id = Number(req.body.post_id)
    
    data = await database.query(`select user_id from user_data.posts where post_id = $1`,
    [post_id])
    if(data.rows[0].user_id == user_id){
        res.redirect('/blog/updatePost')
    }else{
        res.status(404).send()
    }
})


blog.post('/deleteRequest',async(req,res)=>{
    const user_id = Number(req.session.user_id)
    const post_id = Number(req.body.post_id)

    try{
    data = await database.query(`delete from user_data.posts where post_id = $1`,
    [post_id])    
        res.status(200).send()
        getPosts()
    }catch(error){
        res.status(404).send()
    }
})



blog.post('/createPost',async(req,res)=>{

    try{
        database.query(`insert into user_data.posts (user_id,title,body,created_at)
        values ($1,$2,$3,current_date)`,[
            Number(req.session.user_id),
            steraliseInput(req.body.title),
            steraliseInput(req.body.body)
        ])
        res.redirect('/blog')
    }catch(err){
        console.error(err)
        res.status(404).send()
    }

})

blog.post('/updatePost',async(req,res)=>{
    const user_id = Number(req.session.user_id)
    const post_id = Number(req.body.post_id)


    data = await database.query(`select user_id from user_data.posts where post_id = $1`,
    [post_id])

    if(data.rows[0].user_id != user_id){  
        res.setHeader('X-CSRF-Token', req.csrfToken());
        res.redirect('/blog/updatePost');
        res.status(404).send()
    }else{    
        try{
            await database.query(`update user_data.posts
            set title = $1,
            body = $2,
            updated_at = current_date
            where post_id = $3`,[
                steraliseInput(req.body.title),
                steraliseInput(req.body.body),
                post_id
            ])

            res.redirect('/blog')
        }catch(err){
            console.log("ran")
            console.error(err)
            res.status(404).send()
        }
    }
})


blog.post('/search',async(req,res)=>{
    user_id = req.session.user_id
    searchText = steraliseInput(req.body.searchText)

    data = await database.query(`
  SELECT users.user_name, users.user_id, posts.post_id, posts.user_id, posts.title, posts.body, posts.created_at, posts.updated_at
  FROM user_data.posts
  INNER JOIN user_data.users ON posts.user_id = users.user_id
  WHERE posts.title LIKE '%' || $1 || '%' OR posts.body LIKE '%' || $1 || '%'
  ORDER BY created_at
`, [searchText]);

    for (const row of data.rows) {
        const res = await database.query('SELECT encryption_key FROM user_data.users WHERE user_id = $1', [row.user_id]);
        const key = CryptoJS.AES.decrypt(res.rows[0].encryption_key, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        row.user_name = CryptoJS.AES.decrypt(row.user_name, key).toString(CryptoJS.enc.Utf8);
      }
    res.send(JSON.stringify(data = {posts:data.rows, id :user_id}))

})


module.exports = blog;
