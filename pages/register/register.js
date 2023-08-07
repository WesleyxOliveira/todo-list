auth.onAuthStateChanged((user) => {
    if(user) {
        window.location.href = '../../pages/home/home.html';
    }
})

function checkEmailValid() {
    const emailValue = form.email().value;

    form.emailRequiredError().style.display = !emailValue ? 'block' : 'none';

    form.emailInvalidError().style.display = validationEmail(emailValue) ? 'none' : 'block';

    toggleBtn();
}

function checkPasswordValid() {
    const passwordValue = form.password().value;

    form.passwordRequiredError().style.display = !passwordValue ? 'block' : 'none';

    toggleBtn();
}

function matchPasswords() {
    const confirmPasswordValue = form.confirmPassword().value;

    form.passwordDoesntMatchError().style.display = confirmPasswordValue == form.password().value ? 'none' : 'block';

    toggleBtn();
}

function toggleBtn() {
    form.btn().disabled = activeBtn() ? false : true;
}

function activeBtn() {
    if (!form.email().value) {
        return false;
    }

    if (!validationEmail(form.email().value)) {
        return false;
    }

    if (!form.password().value) {
        return false;
    }

    if (form.password().value != form.confirmPassword().value) {
        return false;
    }

    return true;
}

function registerUser(e) {
    e.preventDefault();

    const userMail = form.email().value;
    const userPassword = form.password().value;

    auth.createUserWithEmailAndPassword(userMail, userPassword)
        .then(() => {
            alert('Usuário criado com sucesso!');

            setTimeout(() => {
                window.location.href = '../../pages/home/home.html';
            }, 3000)
        })
        .catch(error => {
            alert(error.code);
        })
}

function handleRegisterErrors(error) {
    if(error.code == 'auth/email-already-in-use') {
        return 'Este usuário já está cadastrado!'
    } else {
        return error.code;
    }
}

const form = {
    email: () => document.querySelector('#email'),
    emailRequiredError: () => document.querySelector('.email-required-error'),
    emailInvalidError: () => document.querySelector('.email-invalid-error'),
    password: () => document.querySelector('#password'),
    passwordRequiredError: () => document.querySelector('.password-required-error'),
    confirmPassword: () => document.querySelector('#confirm-password'),
    passwordDoesntMatchError: () => document.querySelector('.password-doesnt-match-error'),
    btn: () => document.getElementsByTagName('button')[0]
}