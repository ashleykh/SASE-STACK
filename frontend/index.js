var base_url = "http://127.0.0.1:5000"

document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault();
    
    //Grab the values in each input box
    var email = this.elements['email'].value;
    var password = this.elements['password'].value;
    console.log(email);
    data = {
        "email": email,
        "password": password,
    }
    send_post_request(data, '/frontend/login').then(response =>
    {
    if(response == "Account logged in"){
        window.location.href = "/frontend/dashboard.html";
        console.log(email, password)
        localStorage.setItem('current_email', email); // Save current_user to localStorage
    }
    else{
        alert(response)
    }})
})

function send_post_request(data, url){
    return fetch(`${base_url}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
}