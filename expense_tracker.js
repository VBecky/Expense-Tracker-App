document.addEventListener("DOMContentLoaded", function () {

    // DATA
    let expenses = [];

    // LOGIN
    document.getElementById("loginBtn").onclick = function(){
        let email = document.getElementById("email").value;
        let pass = document.getElementById("pass").value;

        if(email === "test@gmail.com" && pass === "1234"){
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("appPage").classList.remove("hidden");
        } else {
            document.getElementById("error").innerText = "Invalid Email or Password";
        }
    };

    // LOGOUT
    document.getElementById("logoutBtn").onclick = function(){
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("appPage").classList.add("hidden");
    };

    // DARK MODE
    document.getElementById("darkBtn").onclick = function(){
        document.body.classList.toggle("dark");
    };

    // ADD EXPENSE
    document.getElementById("addBtn").onclick = function(){
        let desc = document.getElementById("desc").value;
        let amount = document.getElementById("amount").value;
        let category = document.getElementById("category").value;

        if(!desc || !amount){
            alert("Fill all fields");
            return;
        }

        expenses.push({
            desc,
            amount: Number(amount),
            category
        });

        showExpenses();
        loadChart();
    };

    // DELETE
    window.deleteExpense = function(i){
        expenses.splice(i,1);
        showExpenses();
        loadChart();
    };

    // SHOW
    function showExpenses(){
        let list = document.getElementById("list");
        list.innerHTML = "";

        let total = 0;

        expenses.forEach((e,i)=>{
            total += e.amount;

            list.innerHTML += `
            <tr>
                <td>${e.desc}</td>
                <td>${e.category}</td>
                <td>₹${e.amount}</td>
                <td><button onclick="deleteExpense(${i})">X</button></td>
            </tr>`;
        });

        document.getElementById("today").innerText = "ETB" + total;
        document.getElementById("month").innerText = "ETB" + total;
        document.getElementById("year").innerText = "ETB" + total;
    }

    // SEARCH
    document.getElementById("search").onkeyup = function(){
        let value = this.value.toLowerCase();
        let rows = document.querySelectorAll("#list tr");

        rows.forEach(row=>{
            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
    };

    // CHART
    let chart;

    function loadChart(){
        const ctx = document.getElementById("pieChart");

        let categories = {
            Food:0, Bills:0, Shopping:0, Travel:0,
            Entertainment:0, Health:0, Education:0, Other:0
        };

        expenses.forEach(e=>{
            categories[e.category] += e.amount;
        });

        if(chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories)
                }]
            }
        });
    }

    // EXPORT
    document.getElementById("exportBtn").onclick = function(){
        let csv = "Description,Category,Amount\n";

        expenses.forEach(e=>{
            csv += `${e.desc},${e.category},${e.amount}\n`;
        });

        let blob = new Blob([csv], {type:'text/csv'});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "expenses.csv";
        a.click();
    };

});
