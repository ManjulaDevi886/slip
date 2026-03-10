import { GraphQLClient, gql } from "graphql-request";
import fs from "fs";

const endpoint = "https://eu-west-2.cdn.hygraph.com/content/cmm90oqgn005506w7ailqayqe/master";
const client = new GraphQLClient(endpoint);

const query = gql`
  query {
    __schema {
      types {
        name
        kind
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
  }
`;

client.request(query)
    .then(data => {
        let out = "";
        data.__schema.types.filter(t => !t.name.startsWith('__')).forEach(t => {
            if (t.kind === 'OBJECT' || t.kind === 'INTERFACE') {
                out += `Type: ${t.name} (${t.kind})\n`;
                if (t.fields) {
                    t.fields.forEach(f => {
                        let typeName = f.type.name || (f.type.ofType ? f.type.ofType.name : "unknown");
                        out += `  - ${f.name} (${typeName})\n`;
                    });
                }
                out += '\n';
            }
        });
        fs.writeFileSync("schema_new.txt", out);
        console.log("Wrote to schema_new.txt");
    })
    .catch(console.error);
