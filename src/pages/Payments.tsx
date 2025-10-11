import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MetricCard } from '@/components/ui/metric-card';
import { Navbar } from '@/components/layout/Navbar';
import {
  DollarSign,
  Clock,
  Calendar,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  Building,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'payout';
  title: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'recurring' | 'failed';
  date: string;
  icon: 'performance' | 'subscription' | 'payout' | 'fee';
}

export default function Payments() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Mock data
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      title: 'Wedding Reception Performance',
      description: 'Client: Emma Thompson',
      amount: 2800,
      status: 'completed',
      date: '2024-01-15T18:00:00Z',
      icon: 'performance'
    },
    {
      id: '2',
      type: 'expense',
      title: 'Pro Monthly Subscription',
      description: 'Dec 18, 2024 03:00',
      amount: -99,
      status: 'recurring',
      date: '2024-12-18T03:00:00Z',
      icon: 'subscription'
    },
    {
      id: '3',
      type: 'income',
      title: 'Corporate Event Performance',
      description: 'Client: Acme Corp',
      amount: 1500,
      status: 'pending',
      date: '2024-01-16T09:00:00Z',
      icon: 'performance'
    },
    {
      id: '4',
      type: 'payout',
      title: 'Payout to Bank Account',
      description: 'Jan 18, 2024 10:30',
      amount: 2520,
      status: 'completed',
      date: '2024-01-18T10:30:00Z',
      icon: 'payout'
    }
  ];

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'recurring':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };

  const getTransactionIcon = (icon: Transaction['icon']) => {
    switch (icon) {
      case 'performance':
        return <Calendar className="h-5 w-5" />;
      case 'subscription':
        return <CreditCard className="h-5 w-5" />;
      case 'payout':
        return <Building className="h-5 w-5" />;
      case 'fee':
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (typeFilter !== 'all' && transaction.type !== typeFilter) return false;
    // Add time filtering logic here if needed
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payments & Earnings</h1>
              <p className="text-muted-foreground">
                Track your earnings, manage subscriptions, and view transaction history
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Earnings"
            value="$2,520"
            description="This month"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Pending Funds"
            value="$1,350"
            description="In escrow"
            icon={Clock}
          />
          <MetricCard
            title="Next Payout"
            value="$2,900"
            description="Scheduled for Jan 25"
            icon={Calendar}
          />
          <MetricCard
            title="Platform Fees"
            value="$430"
            description="This month"
            icon={TrendingDown}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Filter by:</span>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expenses</SelectItem>
                        <SelectItem value="payout">Payouts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  All your payments, earnings, and subscription charges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {filteredTransactions.map((transaction, index) => (
                    <div key={transaction.id}>
                      <div className="flex items-center justify-between py-4 hover:bg-muted/50 px-4 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'income' ? 'bg-green-500/10' :
                            transaction.type === 'expense' ? 'bg-red-500/10' :
                            'bg-blue-500/10'
                          }`}>
                            {getTransactionIcon(transaction.icon)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{transaction.title}</p>
                              <Badge 
                                variant="outline" 
                                className={getStatusColor(transaction.status)}
                              >
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {transaction.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), 'MMM d, HH:mm')}
                          </p>
                        </div>
                      </div>
                      {index < filteredTransactions.length - 1 && (
                        <Separator className="mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pro Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 border rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced analytics, priority support, and unlimited bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$99</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next billing date</span>
                    <span className="font-medium">Jan 18, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment method</span>
                    <span className="font-medium">Visa •••• 4242</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
