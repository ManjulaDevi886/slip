import { GraphQLClient, gql } from "graphql-request";

const endpoint =
    "https://ap-south-1.cdn.hygraph.com/content/cmm18ttt200sg07wc0igjym4x/master";

const client = new GraphQLClient(endpoint);

const getPayslip = async (empId) => {
    const query = gql`
    query GetPayslip($empId: String!) {
      payslips(where: { employee: { employeeId: $empId } }) {
        payPeriod
        payDate
        totalNetPay

        employee {
          name
          employeeId
          designation
        }
      }
    }
  `;

    try {
        const data = await client.request(query, { empId });
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
};

getPayslip("HD25");
