import { createEmployee } from './src/api.js';

async function test() {
    try {
        const emp = await createEmployee({
            name: "TestUser",
            employeeId: "TEST01",
            designation: "Tester"
        });
        console.log("Success:", emp);
    } catch (e) {
        console.error("Failure:");
        console.error(JSON.stringify(e.response, null, 2));
    }
}
test();
