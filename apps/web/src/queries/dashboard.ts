import { gql } from "graphql-request";

export const GET_DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalRevenue
      revenueChange
      totalUsers
      usersChange
      totalOrders
      ordersChange
      avgOrderValue
      avgOrderChange
    }
  }
`;

export const GET_REVENUE_CHART = gql`
  query RevenueChart($days: Int) {
    revenueChart(days: $days) {
      date
      revenue
      orders
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query Transactions($page: Int, $limit: Int, $status: String) {
    transactions(page: $page, limit: $limit, status: $status) {
      items {
        id
        customerName
        customerEmail
        amount
        status
        method
        createdAt
      }
      total
      page
      totalPages
    }
  }
`;

export const GET_TRANSACTION_STATS = gql`
  query TransactionStats {
    transactionStats {
      completed
      pending
      failed
      totalVolume
      volumeChange
    }
  }
`;

export const GET_ACTIVITY = gql`
  query Activity {
    activity {
      id
      type
      message
      time
      avatarColor
    }
  }
`;

export const GET_CATEGORY_STATS = gql`
  query CategoryStats {
    categoryStats {
      name
      value
      color
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query Customers($page: Int, $limit: Int, $plan: String, $search: String) {
    customers(page: $page, limit: $limit, plan: $plan, search: $search) {
      items {
        id
        customerName
        customerEmail
        totalSpent
        orderCount
        firstOrder
        lastOrder
        plan
      }
      total
      page
      totalPages
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($name: String!, $email: String!, $plan: String) {
    createCustomer(name: $name, email: $email, plan: $plan) {
      id
      customerName
      customerEmail
      plan
    }
  }
`;

export const GET_CUSTOMER_STATS = gql`
  query CustomerStats {
    customerStats {
      total
      totalChange
      newCustomers
      newChange
      premium
      premiumChange
      churned
      churnedChange
    }
  }
`;
