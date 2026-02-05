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
                endDate.setHours(startDate.getHours() + 1);

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
        let backgroundColor = '#38bdf8';
        const now = new Date();
        if (event.start < now) backgroundColor = '#f97316';

        return {
            style: {
                backgroundColor,
                borderRadius: '10px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                padding: '4px 8px'
            }
        };
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">Preventive Maintenance</p>
                    <h1 className="page-title">Maintenance Calendar</h1>
                    <p className="page-subtitle">Visualize upcoming inspections and routine checks.</p>
                </div>
            </div>
            {loading ? (
                <div className="empty-state">Loading calendar...</div>
            ) : (
                <div className="surface-card h-[70vh]">
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
