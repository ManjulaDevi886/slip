import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://ap-south-1.cdn.hygraph.com/content/cmm20f9dk01ft07wcvp4itftx/master";
// Note: Using the master endpoint to write data.
// In Hygraph, if public mutations are not enabled, a token is required. Let's try it first.
const client = new GraphQLClient(endpoint);

const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($data: EmployeeCreateInput!) {
    createEmployee(data: $data) {
      id
    }
  }
`;

const PUBLISH_EMPLOYEE = gql`
  mutation PublishEmployee($id: ID!) {
    publishEmployee(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

const employeesToCreate = [
    { name: "Manjula", employeeId: "EMP001", designation: "Software Engineer", email: "manjula@example.com", dateOfJoining: "2022-04-10" },
    { name: "Shabana", employeeId: "EMP002", designation: "HR Manager", email: "shabana@example.com", dateOfJoining: "2021-08-15" },
    { name: "Karthiga", employeeId: "EMP003", designation: "Frontend Developer", email: "karthiga@example.com", dateOfJoining: "2023-01-20" },
    { name: "Anand", employeeId: "EMP004", designation: "Backend Developer", email: "anand@example.com", dateOfJoining: "2022-11-05" },
    { name: "Priya", employeeId: "EMP005", designation: "UI/UX Designer", email: "priya@example.com", dateOfJoining: "2023-05-12" },
    { name: "Rajesh", employeeId: "EMP006", designation: "QA Engineer", email: "rajesh@example.com", dateOfJoining: "2021-12-01" },
    { name: "Meera", employeeId: "EMP007", designation: "Product Manager", email: "meera@example.com", dateOfJoining: "2020-09-10" },
    { name: "Vikram", employeeId: "EMP008", designation: "System Administrator", email: "vikram@example.com", dateOfJoining: "2022-02-18" },
    { name: "Sneha", employeeId: "EMP009", designation: "Data Analyst", email: "sneha@example.com", dateOfJoining: "2023-07-25" },
    { name: "Arjun", employeeId: "EMP010", designation: "Software Engineer", email: "arjun@example.com", dateOfJoining: "2022-06-30" }
];

async function seed() {
    for (const emp of employeesToCreate) {
        try {
            console.log(`Creating employee: ${emp.name}`);
            const createRes = await client.request(CREATE_EMPLOYEE, { data: emp });
            const id = createRes.createEmployee.id;
            console.log(`Created with ID: ${id}, publishing...`);
            await client.request(PUBLISH_EMPLOYEE, { id });
            console.log(`Published ${emp.name} successfully.`);
        } catch (err) {
            console.error(`Failed to create/publish ${emp.name}:`, err.response?.errors || err.message);
        }
    }
    console.log("Seeding process completed.");
}

seed();
