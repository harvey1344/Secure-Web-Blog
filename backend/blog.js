const database = require('./db');
const steraliseInput= require('./inputSterilisation')
const blog = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

blog.get('/', (req, res) => {
    res.sendFile('blog.html', { root: '../frontend' });
});

blog.get('/updatePost',(req, res) => {
    res.sendFile('updatePost.html', { root: '../frontend' });
});

blog.get('/updatePost.js', (req, res) => {
    res.sendFile('updatePost.js', { root: '../frontend' });
});

blog.get('/createPost',(req, res) => {
    res.sendFile('createPost.html', { root: '../frontend' });
});

blog.get('/createPost.js', (req, res) => {
    res.sendFile('createPost.js', { root: '../frontend' });
});

blog.get('/posts',async(res,req)=>{
    const user_id = Number(req.req.session.user_id)

    data = await database.query(`select users.name, users.user_id, 
    posts.post_id, posts.user_id, posts.title, posts.body, posts.created_at, posts.updated_at 
    from user_data.posts 
    inner join user_data.users on posts.user_id = users.user_id
    order by created_at`)
    req.send(JSON.stringify(data = {posts:data.rows, id:user_id}))
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
module.exports = blog;
