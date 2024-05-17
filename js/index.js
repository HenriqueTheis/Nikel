const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogged();

//LOGAR NO SISTEMA
document.getElementById("login-form").addEventListener("submit", function(e){
   e.preventDefault();

   const email = document.getElementById("email-input").value;
   const senha = document.getElementById("password-input").value;
   const checkSession = document.getElementById("session-input").checked;

   axios.post('http://localhost:3333/login',{
      login: email,
      password: senha,
   })
  .then(function (response) {
    console.log(response);
    saveSession({email,senha}, checkSession);

      window.location.href = "home.html";
  })
  .catch(function (error) {
    const msg = error.response.data.msg;
    alert(msg);
  })
 
});

//CRIAR CONTA
document.getElementById("create-form").addEventListener("submit", function(e){
   e.preventDefault();

   const email = document.getElementById("email-create-input").value;
   const senha = document.getElementById("password-create-input").value;

   if(email.length < 5) {
    alert("Preencha o campo com um e-mail válido!")
    return;
   }

   if(senha.length < 4) {
    alert("A senha deve conter no mínimo 4 dígitos")
    return;
   }

   axios.post('http://localhost:3333/users',{
      login: email,
      password: senha,
   })
  .then(function (response) {
    console.log(response);
    //saveSession({email,senha}, checkSession);
   
    myModal.hide();  
    alert(response.data.msg);
  })
  .catch(function (error) {
    const msg = error.response.data.msg;
    alert(msg);
  })
 

   myModal.hide();

   alert("Conta criada com sucesso, parabéns!!!!!");
});

function checkLogged() {
   if(session) {
      sessionStorage.setItem("logged", session);
      logged = session;
   }

   if(logged) {
      saveSession(logged, session);
      window.location.href = "home.html";
   }
}

function saveAccount(data) {
   localStorage.setItem(data.login, JSON.stringify(data));
}

function saveSession(data, saveSession) {
   if(saveSession) {
      localStorage.setItem("session", JSON.stringify(data));// se ele deixou marcado, salva no localStorage
   }

   sessionStorage.setItem("logged", JSON.stringify(data));//se ele não deixar marcado, ele salva no sessionStorage
}



