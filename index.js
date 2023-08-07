// Tratar erros de login (OK)
// Criar função de recuperação de senha (OK) 
// Criar função de remember(me mantenha conectado) (OK)
//Criar tela de cadastro de usuário

// window.onload = function() {
//     const senhaArmazenada = localStorage.getItem('senha');

//     const emailArmazenado = localStorage.getItem('email');

//     if(senhaArmazenada && emailArmazenado) {

//         form.email().value = emailArmazenado;
//         form.password().value = senhaArmazenada;
//     }
// }

auth.onAuthStateChanged((user) => {
    if(user) {
        window.location.href = '../pages/home/home.html';
    }
})

function checkEmailValid() {
    form.emailRequiredError().style.display = !form.email().value ? 'block' : 'none';

    form.emailInvalidError().style.display = validationEmail(form.email().value) ? 'none' : 'block';

    toggleBtn();
}

function checkPasswordValid() {
    form.passwordRequiredError().style.display = !form.password().value ? "block" : "none";

    toggleBtn();
}

function toggleBtn() {
    form.loginBtn().disabled = !isValid();
}

function isValid() {
    if (form.email().value && validationEmail(form.email().value) && form.password().value.length != 0) {
        return true;
    } else {
        return false;
    }
}

function login(e) {
    e.preventDefault();

    let userMail = form.email().value;
    let userPassword = form.password().value;

    //Função que guarda a senha nos campos
    // if(form.remember().checked) {
    //     localStorage.setItem('email', form.email().value);

    //     localStorage.setItem('senha', form.password().value);
    // }

    showLoading();

    auth.setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
        auth.signInWithEmailAndPassword(userMail, userPassword).then((user) => {    
            window.location.href = './pages/home/home.html';
        }).catch(error => {
            hideLoading();

            alert(handleLoginError(error));
        })
    }).catch((error) => {
        hideLoading();
        console.log(error);
    })
} 

function handleLoginError(error) {
    if(error.code == 'auth/user-not-found') {
        return 'Usuário não encontrado';
    } else if(error.code == 'auth/wrong-password') {
        return 'Senha incorreta';
    } else {
        return error.code;
    }
} 

function recoverPassword(e) {
    e.preventDefault();

    auth.sendPasswordResetEmail(form.email().value)
    .then(() => {
        alert('Email de redefinição enviado com sucesso!');
    }) 
    .catch(error => {
        alert(error.code);
    })
}

const form = {
    email: () => document.querySelector("#email"),
    emailRequiredError: () => document.querySelector('.email-required-error'),
    emailInvalidError: () => document.querySelector('.email-invalid-error'),
    password: () => document.querySelector('#password'),
    passwordRequiredError: () => document.querySelector('.password-required-error'),
    loginBtn: () => document.querySelector('.login-btn'),
    remember: () => document.querySelector('#remember')
}