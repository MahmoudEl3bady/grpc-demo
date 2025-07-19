import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import * as readline from "node:readline/promises";

const packageDef = protoLoader.loadSync("./taskTracker.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const tasksPackage = grpcObject.TaskManager;

const client = new tasksPackage.TaskService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mainMenu() {
  console.log(`\nTask Tracker Menu:
        1. Add Task
        2. List Tasks
        3. Mark Task as Done
        4. Delete Task
        5. Exit`);

  rl.question("Choose an option: ")
    .then((answer) => {
      switch (answer.trim()) {
        case "1":
          rl.question("Task title: ").then((title) => {
            client.createTask({ title }, (err, response) => {
              if (err) console.log("Error: ", err.message);
              else console.log("Task Added successfully", response);
              setTimeout(mainMenu, 1500);
            });
          });
          break;

        case "2":
          client.getTasks({}, (err, response) => {
            if (err) console.log("Error: ", err.message);
            else {
              console.log("\nYour Tasks:");
              if (response.tasks && response.tasks.length > 0) {
                response.tasks.forEach((task, index) => {
                  console.log(
                    `${index + 1}. ID: ${task.id}, Title: ${
                      task.title
                    }, Status: ${task.status}`
                  );
                });
              } else {
                console.log("No tasks found.");
              }
            }
            setTimeout(mainMenu, 1500);
          });
          break;

        case "3":
          rl.question("Task ID to mark as done: ").then((id) => {
            client.markDone({ id: parseInt(id) }, (err, response) => {
              if (err) console.error("Error:", err.message);
              else console.log("Marked Done:", response);
              setTimeout(mainMenu, 1500);
            });
          });
          break;

        case "4":
          rl.question("Task ID to delete: ").then((id) => {
            client.deleteTask({ id: parseInt(id) }, (err, response) => {
              if (err) console.error("Error:", err.message);
              else console.log("Task deleted successfully.");
              setTimeout(mainMenu, 1500);
            });
          });
          break;

        case "5":
          console.log("Goodbye!");
          rl.close();
          process.exit(0);
          break;

        default:
          console.log("Invalid option. Please try again.");
          setTimeout(mainMenu, 1500);
      }
    })
    .catch((error) => {
      console.error("Input error:", error);
      setTimeout(mainMenu, 1500);
    });
}

console.log("Welcome to Task Tracker!");
setTimeout(mainMenu, 400);
