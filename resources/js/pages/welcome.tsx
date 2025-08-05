import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Restaurant Table Manager">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-6xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    👤 Staff Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    📝 Register Staff
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col lg:max-w-6xl">
                        <div className="flex-1 rounded-lg bg-white p-6 pb-12 text-center shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            {/* Hero Section */}
                            <div className="mb-12">
                                <h1 className="mb-6 text-4xl font-bold lg:text-5xl">
                                    🍽️ Restaurant Table Manager
                                </h1>
                                <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A] max-w-3xl mx-auto">
                                    Visual floor plan management system for restaurant staff to manage table statuses, 
                                    reservations, and walk-in customers in real-time.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <div className="bg-[#f8f8f7] dark:bg-[#222221] p-6 rounded-lg">
                                    <div className="text-3xl mb-4">🗺️</div>
                                    <h3 className="font-semibold text-lg mb-2">Visual Floor Plan</h3>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Interactive restaurant layout with color-coded table statuses
                                    </p>
                                </div>
                                
                                <div className="bg-[#f8f8f7] dark:bg-[#222221] p-6 rounded-lg">
                                    <div className="text-3xl mb-4">⚡</div>
                                    <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Instant status changes: Available, Occupied, Reserved, Cleaning, Billed
                                    </p>
                                </div>
                                
                                <div className="bg-[#f8f8f7] dark:bg-[#222221] p-6 rounded-lg">
                                    <div className="text-3xl mb-4">📅</div>
                                    <h3 className="font-semibold text-lg mb-2">Reservation System</h3>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Manage bookings with customer details, time slots, and table assignments
                                    </p>
                                </div>
                                
                                <div className="bg-[#f8f8f7] dark:bg-[#222221] p-6 rounded-lg">
                                    <div className="text-3xl mb-4">⏱️</div>
                                    <h3 className="font-semibold text-lg mb-2">Session Tracking</h3>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                        Track dining duration and billing for walk-in customers
                                    </p>
                                </div>
                            </div>

                            {/* Mock Floor Plan Preview */}
                            <div className="bg-[#f8f8f7] dark:bg-[#222221] p-8 rounded-lg mb-12">
                                <h3 className="text-lg font-semibold mb-6">Floor Plan Preview</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                    <div className="bg-green-500 text-white p-4 rounded text-center text-sm font-medium">
                                        T01<br />Available
                                    </div>
                                    <div className="bg-red-500 text-white p-4 rounded text-center text-sm font-medium">
                                        T02<br />Occupied
                                    </div>
                                    <div className="bg-blue-500 text-white p-4 rounded text-center text-sm font-medium">
                                        T03<br />Reserved
                                    </div>
                                    <div className="bg-yellow-500 text-white p-4 rounded text-center text-sm font-medium">
                                        T04<br />Cleaning
                                    </div>
                                </div>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mt-6">
                                    Click any table to change status, seat customers, or view details
                                </p>
                            </div>

                            {/* Get Started Section */}
                            {!auth.user && (
                                <div className="text-center">
                                    <p className="text-lg mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                        Ready to streamline your restaurant operations?
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-sm bg-[#f53003] px-8 py-3 text-lg font-medium text-white hover:bg-[#e02a00] dark:bg-[#FF4433] dark:hover:bg-[#e53e2e]"
                                        >
                                            👤 Staff Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-sm border border-[#19140035] px-8 py-3 text-lg font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            📝 Register Staff
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {auth.user && (
                                <div className="text-center">
                                    <p className="text-lg mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                        Welcome back! Ready to manage your restaurant?
                                    </p>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-sm bg-[#f53003] px-8 py-3 text-lg font-medium text-white hover:bg-[#e02a00] dark:bg-[#FF4433] dark:hover:bg-[#e53e2e]"
                                    >
                                        🍽️ Go to Floor Plan
                                    </Link>
                                </div>
                            )}

                            <footer className="mt-12 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Built with ❤️ for restaurant staff efficiency
                            </footer>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}