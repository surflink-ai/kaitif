"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@kaitif/ui";
import { 
  DollarSign, 
  Users, 
  Ticket, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Trophy,
  FileText,
  ShoppingBag
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar
} from "recharts";

interface DashboardClientPageProps {
  stats: {
    totalRevenue: number;
    activePasses: number;
    checkInsToday: number;
    newUsers: number;
  };
  revenueData: any[];
  attendanceData: any[];
  recentActivity: any[];
}

export default function DashboardClientPage({ 
  stats,
  revenueData,
  attendanceData,
  recentActivity
}: DashboardClientPageProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-[#F5F5F0]/60">
          Overview of park performance and activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFCC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-[#F5F5F0]/60 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 
                +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Passes
            </CardTitle>
            <Ticket className="h-4 w-4 text-[#00E6E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePasses}</div>
            <p className="text-xs text-[#F5F5F0]/60 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 
                +12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Check-ins Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-[#FFCC00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkInsToday}</div>
            <p className="text-xs text-[#F5F5F0]/60 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <TrendingUp className="h-3 w-3 mr-0.5" /> 
                Live
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users
            </CardTitle>
            <Users className="h-4 w-4 text-[#00E6E6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.newUsers}</div>
            <p className="text-xs text-[#F5F5F0]/60 flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> 
                +5%
              </span>
              since last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Daily revenue for the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#080808', border: '1px solid #333' }}
                    itemStyle={{ color: '#F5F5F0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#FFCC00"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#FFCC00" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>
              Daily check-ins for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#080808', border: '1px solid #333' }}
                    cursor={{ fill: '#ffffff10' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#00E6E6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="h-9 w-9 rounded-full border border-[#F5F5F0]/10 flex items-center justify-center bg-[#F5F5F0]/5">
                  {item.type === 'purchase' ? <DollarSign className="h-4 w-4 text-green-500" /> :
                   item.type === 'checkin' ? <CheckCircle className="h-4 w-4 text-[#FFCC00]" /> :
                   item.type === 'waiver' ? <FileText className="h-4 w-4 text-blue-500" /> :
                   <Trophy className="h-4 w-4 text-[#00E6E6]" />}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-bold">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-[#F5F5F0]/60">
                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
