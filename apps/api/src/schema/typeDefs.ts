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

  type AnalyticsStats {
    mrr: Float!
    mrrChange: Float!
    churnRate: Float!
    churnChange: Float!
    retention: Float!
    retentionChange: Float!
    ltv: Float!
    ltvChange: Float!
  }

  type TrendPoint {
    month: String!
    current: Float!
    previous: Float!
  }

  type FunnelStep {
    label: String!
    value: Int!
    pct: Float!
    color: String!
  }

  type TopPage {
    page: String!
    views: Int!
    bounce: Int!
    bouncePos: Boolean!
    avgTime: String!
  }

  type TrafficSource {
    label: String!
    pct: Int!
    color: String!
  }

  type AnalyticsData {
    stats: AnalyticsStats!
    trend: [TrendPoint!]!
    funnel: [FunnelStep!]!
    topPages: [TopPage!]!
    traffic: [TrafficSource!]!
  }

  type CategoryStat {
    name: String!
    value: Int!
    color: String!
  }

  type Query {
    me: User
    dashboardStats: DashboardStats!
    revenueChart(days: Int): [RevenuePoint!]!
    transactions(page: Int, limit: Int, status: String): TransactionsResult!
    activity: [ActivityItem!]!
    analytics: AnalyticsData!
    categoryStats: [CategoryStat!]!
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
