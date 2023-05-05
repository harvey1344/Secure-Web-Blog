let params = new URLSearchParams(document.location.search);
const post_id = params.get("post_id")

console.log(post_id)


const updateRequest=()=>{
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;

    console.log(title)

    title = sanitizeInput(title);
    body = sanitizeInput(body)

    console.log(title)

    
    fetch('/blog/updatePost', {
        // Adding method type
        method: 'POST',
        // Adding body or contents to send
        body: JSON.stringify({
            title,
            body,
            post_id
        }),
        // Adding headers to the request
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(res=>{
        if (res.redirected) {
            console.log('redirecting to post update');
            //window.location.href = res.url
        } else {
            // Registration failed
            alert("unable to update");
            
        }
    });
}