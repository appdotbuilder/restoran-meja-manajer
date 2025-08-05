import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { router, useForm } from '@inertiajs/react';

interface Table {
    id: number;
    table_name: string;
    capacity: number;
    status: string;
}

interface Props {
    availableTables: Table[];
    [key: string]: unknown;
}

export default function CreateReservation({ availableTables }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        pax: 1,
        reservation_time: '',
        assigned_table_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'));
    };

    const getMinTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1); // Minimum 1 hour from now
        return now.toISOString().slice(0, 16);
    };

    return (
        <AppShell>
            <div className="container mx-auto p-6 max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">📅 New Reservation</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a new reservation for your restaurant
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter customer name"
                                    required
                                />
                                {errors.customer_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="+62812345678"
                                    required
                                />
                                {errors.customer_phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Reservation Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Number of People *
                                </label>
                                <input
                                    type="number"
                                    value={data.pax}
                                    onChange={(e) => setData('pax', parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="20"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                {errors.pax && (
                                    <p className="mt-1 text-sm text-red-600">{errors.pax}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Reservation Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.reservation_time}
                                    onChange={(e) => setData('reservation_time', e.target.value)}
                                    min={getMinTime()}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                {errors.reservation_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.reservation_time}</p>
                                )}
                            </div>
                        </div>

                        {/* Table Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Table *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {availableTables.map((table) => (
                                    <div key={table.id}>
                                        <input
                                            type="radio"
                                            id={`table-${table.id}`}
                                            name="assigned_table_id"
                                            value={table.id}
                                            onChange={(e) => setData('assigned_table_id', e.target.value)}
                                            className="sr-only"
                                        />
                                        <label
                                            htmlFor={`table-${table.id}`}
                                            className={`block p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                                                data.assigned_table_id === table.id.toString()
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                            } ${
                                                data.pax > table.capacity
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            <div className="font-medium">{table.table_name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                👥 {table.capacity} people
                                            </div>
                                            {data.pax > table.capacity && (
                                                <div className="text-xs text-red-500 mt-1">
                                                    Too small
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.assigned_table_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.assigned_table_id}</p>
                            )}
                            
                            {availableTables.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-2">🚫</div>
                                    <p>No tables available for reservation</p>
                                </div>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('reservations.index'))}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || availableTables.length === 0}
                                className="min-w-[120px]"
                            >
                                {processing ? 'Creating...' : '📅 Create Reservation'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Helper Text */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Tips</h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Reservations must be made at least 1 hour in advance</li>
                        <li>• Select a table that can accommodate your party size</li>
                        <li>• Customers will be marked as "arrived" when they check in</li>
                    </ul>
                </div>
            </div>
        </AppShell>
    );
}