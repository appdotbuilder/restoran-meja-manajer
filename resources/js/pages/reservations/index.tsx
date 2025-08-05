import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Table {
    id: number;
    table_name: string;
}

interface Reservation {
    id: number;
    customer_name: string;
    customer_phone: string;
    pax: number;
    reservation_time: string;
    status: string;
    assignedTable: Table;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface Props {
    reservations: {
        data: Reservation[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

export default function ReservationsIndex({ reservations }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'arrived': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleMarkArrived = (reservation: Reservation) => {
        router.patch(route('reservations.update', reservation.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCancel = (reservation: Reservation) => {
        if (confirm('Are you sure you want to cancel this reservation?')) {
            router.delete(route('reservations.destroy', reservation.id), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AppShell>
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">📅 Reservations</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage all restaurant reservations
                        </p>
                    </div>
                    <Button onClick={() => router.visit(route('reservations.create'))}>
                        + New Reservation
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {reservations.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-4">📅</div>
                            <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Start by creating your first reservation
                            </p>
                            <Button onClick={() => router.visit(route('reservations.create'))}>
                                Create Reservation
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Table
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            People
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {reservations.data.map((reservation) => (
                                        <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {reservation.customer_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {reservation.customer_phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {formatDateTime(reservation.reservation_time)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {reservation.assignedTable.table_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                👥 {reservation.pax}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                    {reservation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                {reservation.status === 'confirmed' && (
                                                    <Button
                                                        onClick={() => handleMarkArrived(reservation)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        ✅ Arrived
                                                    </Button>
                                                )}
                                                {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                                                    <Button
                                                        onClick={() => handleCancel(reservation)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        ❌ Cancel
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => router.visit(route('reservations.show', reservation.id))}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    👁️ View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {reservations.meta.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {reservations.meta.from} to {reservations.meta.to} of {reservations.meta.total} results
                        </div>
                        <div className="flex space-x-1">
                            {reservations.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-2 text-sm rounded ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}