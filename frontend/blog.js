


function updatePost(user_id,post_id){
    fetch('/blog/updateRequest', {
        // Adding method type
        method: 'POST',
        // Adding body or contents to send
        body: JSON.stringify({
            user_id,
            post_id,
        }),
        // Adding headers to the request
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(res=>{
        console.log(res)
        if (res.ok) {
            if(res.redirected){
                console.log('redirecting to post update');
                let url = new URL(res.url)
                url.searchParams.set('post_id', post_id);
                window.location.href = url
            }
            // Registration successful
        } else {
            // Registration failed
            alert("unable to update");
            
        }
    });
};
    

async function getPosts(){
    return await fetch('/blog/posts')
        .then(res=>{
            return res.json()
        }).then(data=>{

            console.log(data)

            let postData = data.posts
            let user_id = data.id 

            const postsContainer = document.getElementById("posts-container")

            for(let x = 0; x<postData.length;x++){
        
                const post = document.createElement("div")
                post.id = postData[x].post_id
                post.className = "post"
            
                const postTitle = document.createElement("h2")
                postTitle.appendChild(document.createTextNode(postData[x].title))
                post.appendChild(postTitle)
            
                const userName = document.createElement("h3")
                userName.appendChild(document.createTextNode(postData[x].user_name))
                post.appendChild(userName)
            
                const body = document.createElement("p")
                body.appendChild(document.createTextNode(postData[x].body))
                post.appendChild(body)

                // console.log(postData[x].user_id=user_id," ",postData[x].user_id," ",user_id)
                // console.log(postData[x])

                if(postData[x].user_id==user_id){
                    const updateButton = document.createElement('button')
                    updateButton.innerHTML="Edit Post"
                    updateButton.addEventListener("click", function(){
                        updatePost(postData[x].user_id,postData[x].post_id)
                    })
                    post.appendChild(updateButton)

                }
            
                postsContainer.appendChild(post)
            }
            return postData
        })
    }

let posts = getPosts()

console.log(posts)

async function searchPosts(posts){

    





    let searchQuery = document.getElementById('searchBar').value
    searchQuery = searchQuery.toLowerCase()
    let foundPosts = []
    for(let x = 0; x<posts.length; x++){
       let {title,name,body,id} = posts[x]
       title = title.toLowerCase()
       name = name.toLowerCase()
       body = body.toLowerCase()

       if (title.includes(searchQuery) || name.includes(searchQuery) || body.includes(searchQuery)){
            foundPosts.push(posts[x])
       }        
    }
}


// 