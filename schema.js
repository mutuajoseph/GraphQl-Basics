const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = require('graphql');

// HARDCODED DATA
// const customers = [
//   {
//     id: 1,
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'johndoe@gmail.com',
//     age: 30,
//     phoneNumber: '+254712345678',
//   },
//   {
//     id: 2,
//     firstName: 'Mary',
//     lastName: 'Doe',
//     email: 'marydoe@gmail.com',
//     age: 30,
//     phoneNumber: '+254712345678',
//   },
//   {
//     id: 3,
//     firstName: 'Mark',
//     lastName: 'Doe',
//     email: 'markdoe@gmail.com',
//     age: 30,
//     phoneNumber: '+254712345678',
//   },
//   {
//     id: 4,
//     firstName: 'June',
//     lastName: 'Doe',
//     email: 'junedoe@gmail.com',
//     age: 30,
//     phoneNumber: '+254712345678',
//   },
// ];

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    phoneNumber: { type: GraphQLString },
  }),
});

// mutations
const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    // add a new customer
    addNewCustomer: {
      type: CustomerType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return axios
          .post(`http://localhost:3000/customers/`, {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            age: args.age,
            phoneNumber: args.phoneNumber,
          })
          .then((res) => res.data);
      },
    },

    // delete a customer
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return axios
          .delete(`http://localhost:3000/customers/` + args.id)
          .then((res) => res.data);
      },
    },

    // edit a customer
    editCustomer:{
        type: CustomerType,
        args: {
            id: {type: new GraphQLNonNull(GraphQLInt)},
            firstName: {type: GraphQLString},
            lastName: {type: GraphQLString},
            email: {type: GraphQLString},
            age: {type: GraphQLString},
            phoneNumber: {type: GraphQLString}
        },
        resolve(parent, args) {
            return axios.patch(`http://localhost:3000/customers/`+ args.id, args)
                        .then(res => res.data)
        }
    }
  },
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // fetch a single customer
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        // filter out the customer that matches the given id
        // const result = customers.filter((customer) => customer.id == args.id);
        // return result[0];

        // network request
        return axios
          .get(`http://localhost:3000/customers/` + args.id)
          .then((res) => res.data);
      },
    },

    //   fetch all customers
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent, args) {
        // return customers;

        // network request to fetch all data
        return axios
          .get(`http://localhost:3000/customers`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
