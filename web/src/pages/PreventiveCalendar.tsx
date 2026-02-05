import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPreventivePlans, type PreventivePlan } from '../services/preventiveService';
import toast from 'react-hot-toast';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: PreventivePlan;
}

export default function PreventiveCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const plans = await getPreventivePlans();
            const mappedEvents = plans.map(plan => {
                const startDate = new Date(plan.nextDue);
                const endDate = new Date(startDate);
                endDate.setHours(startDate.getHours() + 1); // Mock 1 hour duration

                return {
                    id: plan.id,
                    title: `PM: ${plan.name} (${plan.asset?.name || 'No Asset'})`,
                    start: startDate,
                    end: endDate,
                    resource: plan
                };
            });
            setEvents(mappedEvents);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load calendar');
        } finally {
            setLoading(false);
        }
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // blue-500
        const now = new Date();
        if (event.start < now) backgroundColor = '#ef4444'; // red-500 (Overdue)

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="p-6 h-[85vh]">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Maintenance Calendar</h1>
            {loading ? <p>Loading...</p> : (
                <div className="h-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        views={['month', 'week', 'day']}
                    />
                </div>
            )}
        </div>
    );
}
