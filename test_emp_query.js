import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://eu-west-2.cdn.hygraph.com/content/cmm90oqgn005506w7ailqayqe/master";
const client = new GraphQLClient(endpoint);

const getEmployees = async () => {
  const query = gql`
    query GetEmployees {
      employees {
        name
        employeeCode
        company
      }
    }
  `;
  try {
    const data = await client.request(query);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
};

getEmployees();
