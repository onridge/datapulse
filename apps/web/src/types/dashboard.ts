export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalUsers: number;
  usersChange: number;
  totalOrders: number;
  ordersChange: number;
  avgOrderValue: number;
  avgOrderChange: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
}

export interface TransactionsResult {
  items: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
  avatarColor: string;
}

export interface TransactionStats {
  completed: number;
  pending: number;
  failed: number;
  totalVolume: number;
  volumeChange: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface Customer {
  id: string;
  customerName: string;
  customerEmail: string;
  totalSpent: number;
  orderCount: number;
  firstOrder: string;
  lastOrder: string;
  plan: string;
}

export interface CustomersResult {
  items: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CustomerStats {
  total: number;
  totalChange: number;
  newCustomers: number;
  newChange: number;
  premium: number;
  premiumChange: number;
  churned: number;
  churnedChange: number;
}
