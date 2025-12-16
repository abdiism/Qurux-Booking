// This controller now aggregates handlers to keep the file small and clean
import { getAvailability } from '../handlers/availabilityHandler';
import { createBooking } from '../handlers/createBookingHandler';
import { getBookings } from '../handlers/bookingRetrieval';
import { updateBookingStatus, cancelBooking } from '../handlers/bookingStatusHandler';

// Exporting them directly allows strictly typed routes to work as before
export {
    getAvailability,
    createBooking,
    getBookings,
    updateBookingStatus,
    cancelBooking
};
