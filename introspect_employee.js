import { GraphQLClient, gql } from "graphql-request";
import fs from "fs";

const endpoint = "https://eu-west-2.cdn.hygraph.com/content/cmm90oqgn005506w7ailqayqe/master";
const client = new GraphQLClient(endpoint);

const query = gql`
  query {
    __type(name: "Employee") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

client.request(query)
  .then(data => {
    fs.writeFileSync("employee_schema.json", JSON.stringify(data, null, 2));
    console.log("Written Employee Schema to employee_schema.json");
  })
  .catch(console.error);
