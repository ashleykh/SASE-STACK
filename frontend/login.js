const form = document.getElementById('login-form');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            localStorage.setItem('userid', result.id)
            window.location.href = 'home.html';
        } else {
            console.log('Error:', result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});