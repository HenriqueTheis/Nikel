const myModal = new bootstrap.Modal("#transactionModal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: [] 
};

document.getElementById("button-logout").addEventListener("click",logout);//lOGOUT


document.getElementById("transactions-form").addEventListener('submit', function(e){


    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({ // Corrigido para 'transactions'
        value: value, type: type, description: description, date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();
    alert("finalizando");

});

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
    getTransactions();
}

function getTransactions(){
    const transaction = data.transactions;
    let transactionsHtml = ``;

    if(transaction.length){
        transaction.forEach((item) =>{
            let type = "Entrada";

            if (item.type === "2"){
                type = "Saida";
            }

            transactionsHtml +=`
             <tr>
            <th scope="row">${item.date}</th>
            <td>${item.value.toFixed(2)}</td>
            <td>${type}</td>
            <td>${item.description}</td>
          </tr>
            `
        })
    }
    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function logout () {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
} 



function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}  