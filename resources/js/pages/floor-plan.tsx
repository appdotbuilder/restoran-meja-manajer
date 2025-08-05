import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Table {
    id: number;
    table_name: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'billed';
    position_x: number;
    position_y: number;
    current_session_id: number | null;
    currentSession?: {
        id: number;
        start_time: string;
        pax: number;
        customer_name: string | null;
    } | null;
    reservations?: Array<{
        id: number;
        customer_name: string;
        reservation_time: string;
        pax: number;
    }>;
}

interface Reservation {
    id: number;
    customer_name: string;
    customer_phone: string;
    pax: number;
    reservation_time: string;
    status: string;
    assignedTable: {
        id: number;
        table_name: string;
    };
}

interface Props {
    tables: Table[];
    upcomingReservations: Reservation[];
    [key: string]: unknown;
}

interface TableActionModalProps {
    table: Table | null;
    onClose: () => void;
    onAction: (action: string, data?: { customer_name: string; pax: number }) => void;
}

function TableActionModal({ table, onClose, onAction }: TableActionModalProps) {
    const [customerName, setCustomerName] = useState('');
    const [pax, setPax] = useState(1);

    if (!table) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500';
            case 'occupied': return 'bg-red-500';
            case 'reserved': return 'bg-blue-500';
            case 'cleaning': return 'bg-yellow-500';
            case 'billed': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDuration = (startTime: string) => {
        const start = new Date(startTime);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{table.table_name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-6">
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(table.status)}`}>
                        {table.status.toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Capacity: {table.capacity} people
                    </p>
                </div>

                {/* Current Session Info */}
                {table.currentSession && (
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h3 className="font-semibold mb-2">Current Session</h3>
                        <p className="text-sm">Customer: {table.currentSession.customer_name || 'Walk-in'}</p>
                        <p className="text-sm">People: {table.currentSession.pax}</p>
                        <p className="text-sm">Started: {formatTime(table.currentSession.start_time)}</p>
                        <p className="text-sm">Duration: {getDuration(table.currentSession.start_time)}</p>
                    </div>
                )}

                {/* Upcoming Reservations */}
                {table.reservations && table.reservations.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold mb-2">Next Reservation</h3>
                        <p className="text-sm">Customer: {table.reservations[0].customer_name}</p>
                        <p className="text-sm">People: {table.reservations[0].pax}</p>
                        <p className="text-sm">Time: {formatTime(table.reservations[0].reservation_time)}</p>
                    </div>
                )}

                {/* Actions based on status */}
                <div className="space-y-3">
                    {table.status === 'available' && (
                        <>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Customer name (optional)"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="number"
                                    placeholder="Number of people"
                                    value={pax}
                                    onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max={table.capacity}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                                <Button
                                    onClick={() => onAction('seat', { customer_name: customerName, pax })}
                                    className="w-full"
                                >
                                    👥 Seat Customers
                                </Button>
                            </div>
                            <Button
                                onClick={() => onAction('cleaning')}
                                variant="outline"
                                className="w-full"
                            >
                                🧹 Mark as Cleaning
                            </Button>
                        </>
                    )}

                    {table.status === 'occupied' && (
                        <>
                            <Button
                                onClick={() => onAction('billed')}
                                className="w-full"
                            >
                                💳 Mark as Billed
                            </Button>
                            <Button
                                onClick={() => onAction('available')}
                                variant="outline"
                                className="w-full"
                            >
                                ✅ Mark as Available
                            </Button>
                        </>
                    )}

                    {table.status === 'billed' && (
                        <Button
                            onClick={() => onAction('available')}
                            className="w-full"
                        >
                            ✅ Mark as Available
                        </Button>
                    )}

                    {table.status === 'cleaning' && (
                        <Button
                            onClick={() => onAction('available')}
                            className="w-full"
                        >
                            ✅ Mark as Available
                        </Button>
                    )}

                    {table.status === 'reserved' && (
                        <Button
                            onClick={() => onAction('occupied')}
                            className="w-full"
                        >
                            👥 Customer Arrived
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FloorPlan({ tables, upcomingReservations }: Props) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-500 hover:bg-green-600';
            case 'occupied': return 'bg-red-500 hover:bg-red-600';
            case 'reserved': return 'bg-blue-500 hover:bg-blue-600';
            case 'cleaning': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'billed': return 'bg-purple-500 hover:bg-purple-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const handleTableAction = (action: string, data?: { customer_name: string; pax: number }) => {
        if (!selectedTable) return;

        if (action === 'seat' && data) {
            router.post(route('tables.store'), {
                table_id: selectedTable.id,
                customer_name: data.customer_name,
                pax: data.pax,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setSelectedTable(null),
            });
        } else {
            router.patch(route('tables.update', selectedTable.id), {
                status: action,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setSelectedTable(null),
            });
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🍽️ Restaurant Floor Plan</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Click on any table to manage its status or seat customers
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Floor Plan */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Floor Plan</h2>
                                <div className="flex gap-2 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                                        <span>Occupied</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span>Reserved</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                        <span>Cleaning</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                        <span>Billed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floor Plan Canvas */}
                            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                                {tables.map((table) => (
                                    <button
                                        key={table.id}
                                        onClick={() => setSelectedTable(table)}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(table.status)} text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105`}
                                        style={{
                                            left: `${(table.position_x / 700) * 100}%`,
                                            top: `${(table.position_y / 500) * 100}%`,
                                            width: '80px',
                                            height: '60px',
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="font-bold text-sm">{table.table_name}</div>
                                            <div className="text-xs">👥 {table.capacity}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Panel */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                            <h3 className="font-semibold mb-3">Quick Stats</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-600">Available:</span>
                                    <span>{tables.filter(t => t.status === 'available').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-600">Occupied:</span>
                                    <span>{tables.filter(t => t.status === 'occupied').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-600">Reserved:</span>
                                    <span>{tables.filter(t => t.status === 'reserved').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-600">Cleaning:</span>
                                    <span>{tables.filter(t => t.status === 'cleaning').length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Reservations */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">Upcoming Reservations</h3>
                                <Button
                                    onClick={() => router.visit(route('reservations.create'))}
                                    size="sm"
                                    variant="outline"
                                >
                                    + New
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {upcomingReservations.slice(0, 5).map((reservation) => (
                                    <div key={reservation.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                                        <div className="font-medium">{reservation.customer_name}</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {reservation.assignedTable.table_name} • {reservation.pax} people
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {formatTime(reservation.reservation_time)}
                                        </div>
                                    </div>
                                ))}
                                
                                {upcomingReservations.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No upcoming reservations
                                    </p>
                                )}
                                
                                {upcomingReservations.length > 5 && (
                                    <Button
                                        onClick={() => router.visit(route('reservations.index'))}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        View All ({upcomingReservations.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Action Modal */}
            <TableActionModal
                table={selectedTable}
                onClose={() => setSelectedTable(null)}
                onAction={handleTableAction}
            />
        </AppShell>
    );
}