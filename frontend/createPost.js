const createPost=()=>{
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;
    
    fetch('/blog/createPost', {
        // Adding method type
        method: 'POST',
        // Adding body or contents to send
        body: JSON.stringify({
            title,
            body
        }),
        // Adding headers to the request
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(res=>{
        if (res.redirected) {
            console.log('redirecting blog');
            window.location.href = res.url
        } else {
            // Registration failed
            alert("unable to create post");            
        }
    });
}