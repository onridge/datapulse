import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      jobTitle: String
      company: String
      teamSize: String
      usePage: String
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
