import { getEmployees } from "./src/api.js";

getEmployees().then(employees => {
  console.log("Success! Fetched", employees.length, "employees.");
  console.log(JSON.stringify(employees, null, 2));
}).catch(err => {
  console.error("Failed:", err.message);
});
