const formular = document.querySelector("#add-task-form");
const inputTask = document.querySelector("#task-name");
const tabelTaskuri = document.querySelector("#history-table tbody");

formular.addEventListener("submit", function(event) {
    event.preventDefault();
    const numeTask = inputTask.value;
    if (numeTask === "") {
        return;
    }
    const randNou = document.createElement("tr");

    const Id = document.createElement("td");
    const Nume = document.createElement("td");
    const Data = document.createElement("td");
    const Actiuni = document.createElement("td");

  
    Id.textContent = "#1004";
    Nume.textContent = numeTask;
    Data.textContent = "—";

   
    const butonStergere = document.createElement("button");
    butonStergere.textContent = "Sterge";
    butonStergere.classList.add("delete-row");

    
   butonStergere.addEventListener("click", function(event) {
    event.target.closest("tr").remove();
});
    
    Actiuni.appendChild(butonStergere);

    
    randNou.appendChild(Id);
    randNou.appendChild(Nume);
    randNou.appendChild(Data);
    randNou.appendChild(Actiuni);
    tabelTaskuri.appendChild(randNou);

    inputTask.value = "";
});


