const myModal = new bootstrap.Modal("#transactionModal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: [] 
};

document.getElementById("button-logout").addEventListener("click",logout);//lOGOUT
document.getElementById("transaction-button").addEventListener("click", function(){
    window.location.href = "transactions.html";
})

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
function logout () {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}
function getTransaction(){
    axios.get('http://localhost:3333/transactions',{
        headers: userHeader(),
    })
  .then(function (response) {
    console.log(response);
    
    data.transactions= response.data.data;

    getCashIn();
    getCashOut();
    getTotal();

  })
  .catch(function (error) {
    alert(error.response.data.msg);
  })    
}
document.getElementById("transaction-form").addEventListener('submit', function(e){
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
function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}  
function getCashIn (){
    
    const transactions = data.transactions;
    const cashIn = transactions.filter((item) => item.type === 1);
    
    if (cashIn.length > 0) {
        let cashInHtml = ``;
        let limit = 0;
    
        if (cashIn.length > 5) {
            limit = 5;
        } else {
            limit = cashIn.length;
        }
    
        for (let index = 0; index < limit; index++) {
            cashInHtml += `
            <div class="row mb-4 ">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${cashIn[index].value}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-4 text-md-end">
                                    <p class="mb-0">${cashIn[index].date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `           
        }
        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }
} 
function getCashOut (){
    
    const transactions = data.transactions;
    const CashOut = transactions.filter((item) => item.type === 2);
    
    if (CashOut.length > 0) { // Corrigido para CashOut.length
        let CashOutHtml = ``;
        let limit = 0;
    
        if (CashOut.length > 5) {
            limit = 5;
        } else {
            limit = CashOut.length;
        }
    
        for (let index = 0; index < limit; index++) {
            CashOutHtml += `
            <div class="row mb-4 ">
                    <div class="col-12">
                        <h3 class="fs-2">R$ ${CashOut[index].value}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${CashOut[index].description}</p>
                                </div>
                                <div class="col-12 col-md-4 text-md-end">
                                    <p class="mb-0">${CashOut[index].date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `           
        }
        document.getElementById("cash-out-list").innerHTML = CashOutHtml;
    }
    }
function getTotal(){
        const transactions = data.transactions;
        let total= 0;

        transactions.forEach((item) => {
            if(item.type ===1){
                total +=Number(item.value);
            }
            else{
                total -= Number(item.value);
            }
        });
        document.getElementById("total").innerHTML = `R$ ${total}`;
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
 