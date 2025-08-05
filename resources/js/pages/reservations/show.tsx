import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Table {
    id: number;
    table_name: string;
    capacity: number;
}

interface Reservation {
    id: number;
    customer_name: string;
    customer_phone: string;
    pax: number;
    reservation_time: string;
    status: string;
    created_at: string;
    assignedTable: Table;
}

interface Props {
    reservation: Reservation;
    [key: string]: unknown;
}

export default function ShowReservation({ reservation }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'arrived': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleMarkArrived = () => {
        router.patch(route('reservations.update', reservation.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            router.delete(route('reservations.destroy', reservation.id));
        }
    };

    const isUpcoming = new Date(reservation.reservation_time) > new Date();
    const canMarkArrived = reservation.status === 'confirmed' && !isUpcoming;
    const canCancel = ['pending', 'confirmed'].includes(reservation.status) && isUpcoming;

    return (
        <AppShell>
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-8">
                    <Button
                        onClick={() => router.visit(route('reservations.index'))}
                        variant="outline"
                        className="mb-4"
                    >
                        ← Back to Reservations
                    </Button>
                    <h1 className="text-3xl font-bold mb-2">📅 Reservation Details</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Reservation #{reservation.id}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">👤 Customer Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                    <p className="text-lg font-medium mt-1">{reservation.customer_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                    <p className="text-lg font-medium mt-1">
                                        <a href={`tel:${reservation.customer_phone}`} className="text-blue-600 hover:underline">
                                            {reservation.customer_phone}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">📋 Reservation Details</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</label>
                                    <p className="text-lg font-medium mt-1">{formatDateTime(reservation.reservation_time)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Party Size</label>
                                    <p className="text-lg font-medium mt-1">👥 {reservation.pax} people</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Table</label>
                                    <p className="text-lg font-medium mt-1">
                                        {reservation.assignedTable.table_name}
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                            (Capacity: {reservation.assignedTable.capacity})
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                                    <p className="text-lg font-medium mt-1">{formatDateTime(reservation.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">⏱️ Timeline</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <div className="font-medium">Reservation Created</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(reservation.created_at)}
                                        </div>
                                    </div>
                                </div>
                                
                                {reservation.status !== 'pending' && (
                                    <div className="flex items-center space-x-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <div className="font-medium">Status: {reservation.status}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Current status
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isUpcoming && (
                                    <div className="flex items-center space-x-4">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                        <div>
                                            <div className="font-medium">Scheduled Arrival</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDateTime(reservation.reservation_time)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="font-semibold mb-4">Status</h3>
                            <div className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full border ${getStatusColor(reservation.status)}`}>
                                {reservation.status.toUpperCase()}
                            </div>
                            
                            {isUpcoming && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        ⏰ Upcoming Reservation
                                    </div>
                                    <div className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                        {Math.ceil((new Date(reservation.reservation_time).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours remaining
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="font-semibold mb-4">Actions</h3>
                            <div className="space-y-3">
                                {canMarkArrived && (
                                    <Button
                                        onClick={handleMarkArrived}
                                        className="w-full"
                                    >
                                        ✅ Mark as Arrived
                                    </Button>
                                )}
                                
                                {canCancel && (
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                    >
                                        ❌ Cancel Reservation
                                    </Button>
                                )}

                                <Button
                                    onClick={() => window.print()}
                                    variant="outline"
                                    className="w-full"
                                >
                                    🖨️ Print Details
                                </Button>
                            </div>
                        </div>

                        {/* Contact Customer */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h3 className="font-semibold mb-4">Contact Customer</h3>
                            <div className="space-y-3">
                                <a
                                    href={`tel:${reservation.customer_phone}`}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    📞 Call Customer
                                </a>
                                <a
                                    href={`sms:${reservation.customer_phone}`}
                                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    💬 Send SMS
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}