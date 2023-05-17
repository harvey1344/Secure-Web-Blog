let params = new URLSearchParams(document.location.search);
const post_id = params.get("post_id")


const updateRequest=()=>{
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;


    // sanitise user input
    title = sanitiseInput(title);
    body = sanitiseInput(body)

   
    fetch('/blog/updatePost', {
        method: 'POST',
        body: JSON.stringify({
            title,
            body,
            post_id
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(res=>{
        if (res.ok) {
            alert("update sucessfull")
            window.location.href = "/blog"
        } else {
            // Registration failed
            alert("unable to update");
            
        }
    });
}