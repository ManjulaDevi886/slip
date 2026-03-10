import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://ap-south-1.cdn.hygraph.com/content/cmm20f9dk01ft07wcvp4itftx/master";
const client = new GraphQLClient(endpoint);

const query = gql`
  query {
    __type(name: "Employee") {
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

client.request(query)
    .then(data => {
        console.log("Fields in Employee type:");
        data.__type.fields.forEach(f => {
            const typeName = f.type.name || (f.type.ofType ? f.type.ofType.name : "unknown");
            console.log(`- ${f.name} (${f.type.kind} ${typeName})`);
        });
    })
    .catch(err => {
        console.error("Introspection failed:", err.message);
    });
