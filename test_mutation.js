import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://ap-south-1.cdn.hygraph.com/content/cmm18ttt200sg07wc0igjym4x/master";
const client = new GraphQLClient(endpoint);

const createEmployee = async () => {
    const mutation = gql`
    mutation {
      createEmployee(
        data: {
          name: "Arun"
          employeeId: "E01"
          designation: "Developer"
        }
      ) {
        id
      }
    }
  `;

    try {
        const data = await client.request(mutation);
        console.log("Success:", data);
    } catch (err) {
        console.error("Error creating employee:");
        console.error(JSON.stringify(err.response, null, 2));
    }
};

createEmployee();
