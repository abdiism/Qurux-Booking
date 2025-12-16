import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    DollarSign, Users, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { Booking, Service } from '../../types';

interface OverviewTabProps {
    totalRevenue: number;
    myBookings: Booking[];
    pendingBookings: number;
    myServices: Service[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ totalRevenue, myBookings, pendingBookings, myServices }) => {
    // Mock Data for Charts (since we don't have historical data yet)
    const revenueData = [
        { name: 'Mon', value: totalRevenue * 0.1 },
        { name: 'Tue', value: totalRevenue * 0.2 },
        { name: 'Wed', value: totalRevenue * 0.15 },
        { name: 'Thu', value: totalRevenue * 0.3 },
        { name: 'Fri', value: totalRevenue * 0.25 },
        { name: 'Sat', value: totalRevenue * 0.4 },
        { name: 'Sun', value: totalRevenue * 0.5 },
    ];

    // Calculate category distribution
    const categoryData = myServices.reduce((acc, service) => {
        const existing = acc.find(i => i.name === service.category);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: service.category, value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const COLORS = ['#f43f5e', '#f97316', '#3b82f6', '#10b981', '#8b5cf6'];

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color.text}`}>
                <Icon size={64} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${color.bg} ${color.shadow}`}>
                    <Icon size={24} />
                </div>
                <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-stone-900">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-500">
                        <ArrowUpRight size={14} /> +{trend}% from last week
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue}`}
                    icon={DollarSign}
                    color={{ bg: 'bg-gradient-to-br from-rose-500 to-rose-600', text: 'text-rose-500', shadow: 'shadow-rose-200' }}
                    trend={12}
                />
                <StatCard
                    title="Total Bookings"
                    value={myBookings.length}
                    icon={Users}
                    color={{ bg: 'bg-gradient-to-br from-orange-400 to-orange-500', text: 'text-orange-500', shadow: 'shadow-orange-200' }}
                    trend={8}
                />
                <StatCard
                    title="Pending"
                    value={pendingBookings}
                    icon={Calendar}
                    color={{ bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-blue-500', shadow: 'shadow-blue-200' }}
                />
                <StatCard
                    title="Active Services"
                    value={myServices.length}
                    icon={Activity}
                    color={{ bg: 'bg-gradient-to-br from-emerald-400 to-emerald-500', text: 'text-emerald-500', shadow: 'shadow-emerald-200' }}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-stone-900">Revenue Trends</h3>
                            <p className="text-stone-500 text-sm">Income over the last 7 days</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-full bg-stone-100 text-xs font-bold text-stone-600">Weekly</button>
                            <button className="px-3 py-1 rounded-full bg-white text-xs font-bold text-stone-400 hover:bg-stone-50">Monthly</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                    cursor={{ stroke: '#f43f5e', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Service Mix</h3>
                    <p className="text-stone-500 text-sm mb-8">Distribution by category</p>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-stone-800">{myServices.length}</p>
                                <p className="text-xs text-stone-400 font-bold uppercase">Services</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {categoryData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="font-bold text-stone-600">{entry.name}</span>
                                </div>
                                <span className="font-bold text-stone-400">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity / Top Services Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                    <h3 className="text-xl font-bold text-stone-900 mb-6">Recent Bookings</h3>
                    <div className="space-y-4">
                        {myBookings.slice(0, 5).map(booking => (
                            <div key={booking.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${booking.status === 'Confirmed' ? 'bg-green-500' : booking.status === 'Pending' ? 'bg-orange-400' : 'bg-stone-400'
                                        }`}>
                                        {booking.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-800">{booking.customerName}</p>
                                        <p className="text-xs text-stone-500">{new Date(booking.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-stone-800">${booking.totalPrice}</span>
                            </div>
                        ))}
                        {myBookings.length === 0 && <p className="text-stone-400 italic">No recent bookings.</p>}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                    <h3 className="text-xl font-bold text-stone-900 mb-6">Top Services</h3>
                    <div className="space-y-4">
                        {myServices.slice(0, 5).map((service, idx) => (
                            <div key={service.id} className="flex items-center gap-4">
                                <span className="font-bold text-stone-300 w-6">0{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-stone-800">{service.nameEnglish}</span>
                                        <span className="text-xs font-bold text-rose-500">${service.price}</span>
                                    </div>
                                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.random() * 60 + 40}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
