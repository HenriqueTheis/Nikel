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
    getCashIn(); 
    getCashOut();
    getTotal();
    
}
// DESLOGAR A CONTA
function logout () {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}


// ADICIONAR
document.getElementById("transaction-form").addEventListener('submit', function(e){
    e.preventDefault();
    
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
    getCashIn(); 
    getCashOut();
    getTotal();

});
function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}  

function getCashIn (){
    
    const transactions = data.transactions;
    const cashIn = transactions.filter((item) => item.type === '1');
    
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
                        <h3 class="fs-2">R$ ${cashIn[index].value.toFixed(2)}</h3>
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
    const CashOut = transactions.filter((item) => item.type === '2');
    
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
                        <h3 class="fs-2">R$ ${CashOut[index].value.toFixed(2)}</h3>
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
            if(item.type ==="1"){
                total += item.value;
            }
            else{
                total -= item.value;
            }

        });
        document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
    }
  