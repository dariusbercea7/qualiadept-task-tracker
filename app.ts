export { };
const apiUrl: string = 'https://jsonplaceholder.typicode.com/todos';
const maxTasksLimit: number = 5;
let isAppReady: boolean = false;

type TaskStatus = "todo" | "in-progress" | "completed";
type TaskItem = {
  id: number;
  title: string;
  status: TaskStatus;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}
let listaTaskuri: TaskItem[] = [];

const proceseazaTaskNou = (taskObj: TaskItem): boolean => {
  if (!taskObj.title) {
    console.error("Task-ul trebuie sa aiba un titlu");
    return false;
  }
  listaTaskuri.push(taskObj);
  console.log("Task-ul a fost adaugat cu succes");
  return true;

};
const afiseazaTask = (id: number): void => {
  const taskGasit = listaTaskuri.find(task => task.id === id);
  if (taskGasit) {
    console.log(`[${taskGasit.status.toUpperCase()}] ${taskGasit.title}`);

  } else {
    console.log("Task-ul ", id, "nu exista");

  }

}
const incarcaTaskuriInitiale = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}?_limit=${maxTasksLimit}`);
    if (!response.ok) {
      throw new Error("Eroare la conectarea cu API-ul");
    }
    const dateServer = await response.json() as TaskItem[];
    listaTaskuri = dateServer;
    isAppReady = true;
    console.log(`Au fost încărcate ${listaTaskuri.length} task-uri.`);
  } catch (error) {
    console.error("Sistemul a intampinat o problema", error);
  }
};
incarcaTaskuriInitiale().then(() => {
  const testNou: TaskItem = {
    id: 999,
    title: "Rulează suita Playwright",
    status: "todo",
    completed: false,
    priority: "high"
  };
  proceseazaTaskNou(testNou);
  afiseazaTask(999);

});
