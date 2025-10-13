import gql from 'graphql-tag';

const UserType = gql`
  type User {
    id: ID!
    name: String!
    email:String!,
    createdAt: String
    updatedAt: String
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!,email:String!): User
    updateUser(id:ID!,name:String,email:String):User
    deleteUser(id:ID!):User
  }
`;

export default UserType;
