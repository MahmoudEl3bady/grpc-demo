import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Load proto file
const packageDef = loadSync("./taskTracker.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = loadPackageDefinition(packageDef);

// Debug: Let's see what's actually loaded
console.log("grpcObject keys:", Object.keys(grpcObject));
console.log("Full grpcObject structure:", JSON.stringify(grpcObject, null, 2));

const tasksPackage = grpcObject.TaskManager;

let tasks = [];
let currentId = 1;

const createTask = (call, callback) => {
  const newTask = {
    id: currentId++,
    title: call.request.title,
    status: "pending", // Fixed: Added quotes
  };
  tasks.push(newTask);
  callback(null, newTask);
};

const getTasks = (_, callback) => {
  callback(null, { tasks });
};

const markDone = (call, callback) => {
  const task = tasks.find((t) => t.id === call.request.id);
  if (!task) {
    // Better error handling with gRPC status
    const error = new Error("Task Not found");
    error.code = 5; // NOT_FOUND status code
    return callback(error);
  }

  task.status = "completed";
  callback(null, task);
};

function deleteTask(call, callback) {
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== call.request.id);

  if (tasks.length === initialLength) {
    const error = new Error("Task not found");
    error.code = 5;
    return callback(error);
  }

  callback(null, { success: true });
}

// Debug: tasksPackage content
console.log("tasksPackage:", tasksPackage);
if (tasksPackage) {
  console.log("tasksPackage keys:", Object.keys(tasksPackage));
}

const server = new Server();

let serviceDefinition = null;

if (tasksPackage && tasksPackage.service) {
  serviceDefinition = tasksPackage.service;
  console.log("Found service at tasksPackage.service");
} else if (
  tasksPackage &&
  tasksPackage.TaskService &&
  tasksPackage.TaskService.service
) {
  serviceDefinition = tasksPackage.TaskService.service;
  console.log("Found service at tasksPackage.TaskService.service");
} else if (grpcObject.TaskService && grpcObject.TaskService.service) {
  serviceDefinition = grpcObject.TaskService.service;
  console.log("Found service at grpcObject.TaskService.service");
}

if (!serviceDefinition) {
  console.error(
    "Could not find service definition! Check your proto file structure."
  );
  process.exit(1);
}

server.addService(serviceDefinition, {
  createTask: createTask,
  getTasks: getTasks,
  markDone: markDone,
  deleteTask: deleteTask,
});

server.bindAsync(
  "0.0.0.0:50051",
  ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Failed to bind server:", error);
      return;
    }
    console.log(`gRPC Server is running on port ${port}`);
    server.start();
  }
);

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT, shutting down gracefully...");
  server.tryShutdown((error) => {
    if (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
    console.log("Server shut down successfully");
    process.exit(0);
  });
});
