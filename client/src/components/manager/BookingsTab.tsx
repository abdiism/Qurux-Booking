import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Filter, Phone } from 'lucide-react';
import { Booking, Service } from '../../types';

interface BookingsTabProps {
    myBookings: Booking[];
    services: Service[];
    updateBookingStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Completed' | 'Declined') => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ myBookings, services, updateBookingStatus, showToast }) => {
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Declined'>('All');

    const filteredBookings = filter === 'All'
        ? myBookings
        : myBookings.filter(b => b.status === filter);

    // Sort by date (newest first)
    const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Manage Bookings</h2>
                    <p className="text-stone-500">Track and manage your appointments.</p>
                </div>

                <div className="flex bg-stone-100 p-1 rounded-2xl">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Declined'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {sortedBookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-[32px] border border-stone-100 border-dashed">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <p className="text-stone-400 font-medium">No bookings found for this filter.</p>
                    </div>
                ) : (
                    sortedBookings.map(booking => (
                        <div key={booking.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100 hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm ${booking.status === 'Confirmed' ? 'bg-green-500' :
                                        booking.status === 'Pending' ? 'bg-orange-400' :
                                            booking.status === 'Declined' ? 'bg-red-400' : 'bg-stone-400'
                                        }`}>
                                        {booking.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-stone-900">{booking.customerName}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                booking.status === 'Pending' ? 'bg-orange-50 text-orange-500 border-orange-100' :
                                                    booking.status === 'Declined' ? 'bg-red-50 text-red-500 border-red-100' :
                                                        'bg-stone-50 text-stone-500 border-stone-100'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        {booking.status === 'Confirmed' && booking.customerPhone && (
                                            <a
                                                href={`tel:${booking.customerPhone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
                                            >
                                                <Phone size={14} /> Contact Client
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-stone-500 font-medium">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {booking.timeSlot}</span>
                                    </div>
                                    <p className="mt-2 text-stone-800 font-bold text-sm bg-stone-50 inline-block px-3 py-1 rounded-lg">
                                        {services.find(s => s.id === booking.serviceId)?.nameEnglish} • <span className="text-rose-500">${booking.totalPrice}</span>
                                    </p>
                                </div>
                            </div>

                            {booking.status === 'Pending' && (
                                <div className="flex gap-2 mt-4 md:mt-0 md:ml-auto">
                                    <button
                                        onClick={() => {
                                            updateBookingStatus(booking.id, 'Confirmed');
                                            showToast('Booking Accepted', 'success');
                                        }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-xs hover:bg-green-600 transition-colors flex items-center gap-1 shadow-md shadow-green-100"
                                    >
                                        <CheckCircle size={14} /> Accept
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateBookingStatus(booking.id, 'Declined');
                                            showToast('Booking Declined', 'error');
                                        }}
                                        className="px-4 py-2 bg-white border border-stone-200 text-stone-500 rounded-lg font-bold text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors flex items-center gap-1"
                                    >
                                        <XCircle size={14} /> Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
