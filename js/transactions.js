const myModal = new bootstrap.Modal("#transactionModal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: [] 
};

document.getElementById("button-logout").addEventListener("click",logout);//lOGOUT

checklogged();
function checklogged(){
    if(session){
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    if(!logged){
        window.location.href ="index.html";
        return
    }
    const dataUser = localStorage.getItem(logged);
    if(dataUser){
        data = JSON.parse(dataUser);
    } 
    getTransaction();
}
document.getElementById("transactions-form").addEventListener('submit', function(e){
    e.preventDefault();
    
    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;
    
    
    
    axios.post('http://localhost:3333/transactions',{
        value: value,
        type: Number(type),
        date: date,
        description: description,
    },{
        headers: userHeader(),
    })
  .then(function (response) {
    e.target.reset();//limpar o input
    myModal.hide();//Fechar o modal
 

    alert(response.data.msg);
    getTransaction();    
  })
  .catch(function (error) {
    alert(error.response.data.msg);
  })    

});


function logout () {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
} 

function userHeader(){
    let userHeader = null;
if(logged){
    const user = JSON.parse(logged);
    userHeader = {'user': user.email, 'password': user.senha };
} else {
    const user = JSON.parse(session);
    userHeader = {'user': user.email, 'password': user.senha };
}
return userHeader;
} 

function getTransaction(){
    axios.get('http://localhost:3333/transactions',{
        headers: userHeader(),
    })
  .then(function (response) {
    console.log(response);
    
    data.transactions= response.data.data;
    
    let transactionsHtml = ``;

    if(data.transactions.length){
        data.transactions.forEach((item) =>{
            let type = "Entrada";

            if (item.type === "2"){
                type = "Saida";
            }

            transactionsHtml +=`
             <tr>
            <th scope="row">${item.date}</th>
            <td>${item.value}</td>
            <td>${type}</td>
            <td>${item.description}</td>
          </tr>
            `;
        });
    
    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}
  })
  .catch(function (error) {
    alert(error.response.data.msg);
  })    
}