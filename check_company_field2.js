import { GraphQLClient, gql } from "graphql-request";
import fs from "fs";

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
        let out = "Fields in Employee type:\n";
        data.__type.fields.forEach(f => {
            const typeName = f.type.name || (f.type.ofType ? f.type.ofType.name : "unknown");
            out += `- ${f.name} (${f.type.kind} ${typeName})\n`;
        });
        fs.writeFileSync("schema_out.txt", out);
        console.log("Wrote to schema_out.txt");
    })
    .catch(err => {
        fs.writeFileSync("schema_out.txt", "Error: " + err.message);
    });
