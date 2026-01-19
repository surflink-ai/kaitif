"use client";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@kaitif/ui";
import { Download, TrendingUp } from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

interface ReportsClientPageProps {
  revenueData: any[];
  passDistribution: any[];
  hourlyTraffic: any[];
  stats: {
    totalRevenue: number;
    activePasses: number;
    checkInsToday: number;
    newUsers: number;
  };
}

const COLORS = ['#FFCC00', '#00E6E6', '#FF4444', '#F5F5F0'];

export default function ReportsClientPage({ 
  revenueData,
  passDistribution,
  hourlyTraffic,
  stats
}: ReportsClientPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reports & Analytics</h1>
          <p className="text-[#F5F5F0]/60">
            Deep dive into park performance metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#F5F5F0]/60">Total Revenue (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-xs text-green-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#F5F5F0]/60">Avg. Daily Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <div className="text-xs text-green-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#F5F5F0]/60">Pass Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <div className="text-xs text-red-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> -0.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#F5F5F0]/60">Member Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <div className="text-xs text-[#F5F5F0]/60 mt-1">
              Recurring monthly
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Revenue Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorPasses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFCC00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFCC00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMerch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E6E6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00E6E6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080808', border: '1px solid #333' }}
                  itemStyle={{ color: '#F5F5F0' }}
                />
                <Area type="monotone" dataKey="passes" stackId="1" stroke="#FFCC00" fill="url(#colorPasses)" />
                <Area type="monotone" dataKey="merch" stackId="1" stroke="#00E6E6" fill="url(#colorMerch)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pass Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pass Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {passDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#080808', border: '1px solid #333' }}
                    itemStyle={{ color: '#F5F5F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-4">
              {passDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[#F5F5F0]/60">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Traffic */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours (Avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyTraffic}>
                  <XAxis dataKey="hour" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#080808', border: '1px solid #333' }}
                    cursor={{ fill: '#ffffff10' }}
                  />
                  <Bar dataKey="visitors" fill="#F5F5F0" opacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
