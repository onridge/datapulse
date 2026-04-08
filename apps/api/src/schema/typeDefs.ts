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

  type DashboardStats {
    totalRevenue: Float!
    revenueChange: Float!
    totalUsers: Int!
    usersChange: Float!
    totalOrders: Int!
    ordersChange: Float!
    avgOrderValue: Float!
    avgOrderChange: Float!
  }

  type RevenuePoint {
    date: String!
    revenue: Float!
    orders: Int!
  }

  type Transaction {
    id: ID!
    customerName: String!
    customerEmail: String!
    amount: Float!
    status: String!
    method: String!
    createdAt: String!
  }

  type TransactionsResult {
    items: [Transaction!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  type ActivityItem {
    id: ID!
    type: String!
    message: String!
    time: String!
    avatarColor: String!
  }

  type Query {
    me: User
    dashboardStats: DashboardStats!
    revenueChart(days: Int): [RevenuePoint!]!
    transactions(page: Int, limit: Int, status: String): TransactionsResult!
    activity: [ActivityItem!]!
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
