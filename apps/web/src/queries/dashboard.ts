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
