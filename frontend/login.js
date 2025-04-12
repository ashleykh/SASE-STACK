var form = null;
var emailInput = null;
var passwordInput = null;

document.addEventListener('DOMContentLoaded', () => {
    form = document.getElementById('login-form');
    emailInput = form.querySelector('input[name="email"]');
    passwordInput = form.querySelector('input[name="password"]');
    login();
});

function login(){
    form.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');
    
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
                window.location.href = 'home.html';
            } else {
                if (result.message === 'User does not exist') {
                    passwordInput.setCustomValidity("This user does not exist.");
                    passwordInput.reportValidity();
                }
                if (result.message === 'Invalid password') {
                    passwordInput.setCustomValidity("Invalid password.");
                    passwordInput.reportValidity();
                }
                else {
                    console.log('Error:', result.message);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    emailInput.addEventListener('input', () => {
        emailInput.setCustomValidity('');
    });
    passwordInput.addEventListener('input', () => {
        passwordInput.setCustomValidity('');
    });
}
