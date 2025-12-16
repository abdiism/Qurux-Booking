import React from 'react';
import { Booking, Salon, Service } from '../../types';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Clock3, Phone } from 'lucide-react';

interface ClientBookingsProps {
    bookings: Booking[];
    salons: Salon[];
    services: Service[];
    onCancel: (id: string) => void;
}

export const ClientBookings: React.FC<ClientBookingsProps> = ({ bookings, salons, services, onCancel }) => {
    const getSalon = (id: string) => salons.find(s => s.id === id);
    const getService = (id: string) => services.find(s => s.id === id);

    const sortedBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto mb-4">
                    <Calendar size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-800">No Bookings Yet</h3>
                <p className="text-stone-500">Your booking history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedBookings.map(booking => {
                const salon = getSalon(booking.salonId);
                const service = getService(booking.serviceId);

                return (
                    <div key={booking.id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-24 h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                            {salon?.image && <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-stone-900">{service?.name || 'Unknown Service'}</h4>
                                    <p className="text-sm text-stone-500 font-medium">{salon?.name || 'Unknown Salon'}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                    ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                                        booking.status === 'Declined' || booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                            'bg-yellow-100 text-yellow-600'}`}>
                                    {booking.status === 'Confirmed' && <CheckCircle size={12} />}
                                    {(booking.status === 'Declined' || booking.status === 'Cancelled') && <XCircle size={12} />}
                                    {booking.status === 'Pending' && <Clock3 size={12} />}
                                    {booking.status}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-500 mt-3">
                                <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-lg">
                                    <Calendar size={14} />
                                    {new Date(booking.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-lg">
                                    <Clock size={14} />
                                    {booking.timeSlot}
                                </div>
                                {salon?.city && (
                                    <div className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded-lg">
                                        <MapPin size={14} />
                                        {salon.city}
                                    </div>
                                )}
                                <div className="ml-auto font-bold text-stone-900 text-sm">
                                    ${booking.totalPrice}
                                </div>
                            </div>

                            {booking.status === 'Confirmed' && (
                                <div className="mt-4 flex justify-end gap-2">
                                    {salon?.phoneNumber && (
                                        <a
                                            href={`tel:${salon.phoneNumber}`}
                                            className="text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Phone size={14} /> Contact Salon
                                        </a>
                                    )}
                                </div>
                            )}

                            {booking.status === 'Pending' && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => onCancel(booking.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
