import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://ap-south-1.cdn.hygraph.com/content/cmm20f9dk01ft07wcvp4itftx/master";
const client = new GraphQLClient(endpoint);

const query = gql`
  query {
    payslips {
      id
    }
  }
`;

client.request(query).then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
