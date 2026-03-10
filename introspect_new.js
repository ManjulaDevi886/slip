import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://ap-south-1.cdn.hygraph.com/content/cmm20f9dk01ft07wcvp4itftx/master";
const client = new GraphQLClient(endpoint);

const query = gql`
  query {
    __type(name: "Employee") {
      fields {
        name
      }
    }
  }
`;

client.request(query)
    .then(data => {
        if (data.__type) {
            console.log("Fields in Employee type:");
            data.__type.fields.forEach(f => console.log("- " + f.name));
        } else {
            console.log("Type 'Employee' not found in schema.");
            // If Employee not found, list all types
            const listTypes = gql`{ __schema { types { name } } }`;
            return client.request(listTypes).then(res => {
                console.log("Available types:");
                res.__schema.types.filter(t => !t.name.startsWith("__")).forEach(t => console.log("- " + t.name));
            });
        }
    })
    .catch(err => {
        console.error("Introspection failed:", err.message);
        if (err.response) console.error("Response data:", JSON.stringify(err.response, null, 2));
    });
