const listaTaskuri = [
  { id: 1001, nume: "Setare Boilerplate HTML", completat: true },
  { id: 1002, nume: "Înțelegere Arhitectură Client-Server", completat: false }
];


const proceseazaTaskNou = (taskObj) => {
  if (taskObj.nume === "" || taskObj.nume === undefined) {
    console.log("Eroare: Task-ul trebuie să aibă un nume!");
  } else {
    listaTaskuri.push(taskObj);
    console.log("Task adăugat cu succes!");
  }
};

proceseazaTaskNou({ id: 1003, nume: "", completat: false }); 
proceseazaTaskNou({ id: 1004, nume: "Scrie primul test Playwright", completat: false }); 

console.log("--- Raport Task-uri ---");
for (let i = 0; i < listaTaskuri.length; i++) {
  console.log("Task-ul " + listaTaskuri[i].id + ": " + listaTaskuri[i].nume);
}

