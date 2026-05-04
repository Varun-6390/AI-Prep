import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import interviewService from '../../services/interview.service';

const DashboardLayout = () => {
    const { user, handleLogout } = useAuth();
    const location = useLocation();
    const [latestId, setLatestId] = React.useState(null);

    React.useEffect(() => {
        const fetchLatest = async () => {
            try {
                const data = await interviewService.getAllReports();
                if (data.interviewReports && data.interviewReports.length > 0) {
                    setLatestId(data.interviewReports[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch latest report', err);
            }
        };
        fetchLatest();
    }, [location.pathname]); // Refresh when navigating

    return (
        <div className="bg-background text-on-background font-body-md text-body-md flex h-screen overflow-hidden antialiased">
            {/* NavigationDrawer (Sidebar) - Hidden on Mobile */}
            <nav className="hidden md:flex flex-col h-full py-8 px-4 bg-slate-50 dark:bg-slate-950 w-72 rounded-r-lg border-r border-slate-200 dark:border-slate-800 shadow-xl shrink-0 z-20">
                {/* Header Profile Layout */}
                <div className="flex items-center gap-sm mb-lg px-2">
                    <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center bg-primary-container text-on-primary-container text-xl font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="font-h3 text-[18px] font-bold text-on-surface">{user?.username || 'User'}</h3>
                        <p className="font-body-sm text-body-sm text-secondary">Interview Ready</p>
                        <span className="inline-block mt-1 bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2 py-0.5 rounded-full">Pro Plan</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 flex-1">
                    <Link to="/" className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/' ? 'fill-icon' : ''}`} data-icon="grid_view" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>grid_view</span>
                        Dashboard
                    </Link>
                    <Link to="/analysis/new" className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/analysis/new' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/analysis/new' ? 'fill-icon' : ''}`} data-icon="troubleshoot" style={{ fontVariationSettings: location.pathname === '/analysis/new' ? "'FILL' 1" : "'FILL' 0" }}>troubleshoot</span>
                        Resume Analysis
                    </Link>
                    <Link to={latestId ? `/questions/${latestId}` : '/analysis/new'} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname.startsWith('/questions') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname.startsWith('/questions') ? 'fill-icon' : ''}`} data-icon="quiz" style={{ fontVariationSettings: location.pathname.startsWith('/questions') ? "'FILL' 1" : "'FILL' 0" }}>quiz</span>
                        Question Gen
                    </Link>
                    <Link to={latestId ? `/prep-plan/${latestId}` : '/analysis/new'} className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname.startsWith('/prep-plan') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname.startsWith('/prep-plan') ? 'fill-icon' : ''}`} data-icon="checklist_rtl" style={{ fontVariationSettings: location.pathname.startsWith('/prep-plan') ? "'FILL' 1" : "'FILL' 0" }}>checklist_rtl</span>
                        Prep Plan
                    </Link>
                    <Link to="/ats" className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/ats' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/ats' ? 'fill-icon' : ''}`} data-icon="architecture" style={{ fontVariationSettings: location.pathname === '/ats' ? "'FILL' 1" : "'FILL' 0" }}>architecture</span>
                        ATS Builder
                    </Link>
                </div>

                {/* Bottom Settings */}
                <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-2">
                    <Link to="/settings" className={`flex items-center gap-sm px-4 py-3 rounded-lg font-manrope text-sm font-medium hover:translate-x-1 duration-200 ${location.pathname === '/settings' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${location.pathname === '/settings' ? 'fill-icon' : ''}`} data-icon="settings" style={{ fontVariationSettings: location.pathname === '/settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
                        Settings
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-sm px-4 py-3 rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-manrope text-sm font-medium hover:translate-x-1 duration-200 w-full text-left">
                        <span className="material-symbols-outlined text-[20px]" data-icon="logout">logout</span>
                        Log out
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pb-[80px] md:pb-0">
                {/* TopAppBar */}
                <header className="flex justify-between items-center w-full px-6 h-16 max-w-full docked full-width top-0 border-b border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none bg-white dark:bg-slate-950 font-manrope antialiased z-10 shrink-0 sticky top-0">
                    <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-[24px]" data-icon="smart_toy">smart_toy</span>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Career Catalyst</span>
                    </div>
                    <div className="flex items-center gap-md">
                        {/* Search Input */}
                        <div className="hidden sm:flex relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]" data-icon="search">search</span>
                            <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search resources..." type="text"/>
                        </div>
                        {/* Trailing Avatar */}
                        <div className="w-9 h-9 rounded-full border border-surface-variant cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-primary-container text-on-primary-container text-sm font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Dashboard Canvas */}
                <div className="flex-1 overflow-y-auto p-md md:p-gutter">
                    <Outlet />
                </div>
            </main>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-none font-manrope text-[10px] font-semibold uppercase tracking-wider">
                <Link to="/" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                    <span className="mt-1">Home</span>
                </Link>
                <Link to="/analysis/new" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/analysis/new' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/analysis/new' ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
                    <span className="mt-1">Analyze</span>
                </Link>
                <Link to={latestId ? `/questions/${latestId}` : '/analysis/new'} className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname.startsWith('/questions') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.startsWith('/questions') ? "'FILL' 1" : "'FILL' 0" }}>psychology</span>
                    <span className="mt-1">Questions</span>
                </Link>
                <Link to={latestId ? `/prep-plan/${latestId}` : '/analysis/new'} className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname.startsWith('/prep-plan') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.startsWith('/prep-plan') ? "'FILL' 1" : "'FILL' 0" }}>event_note</span>
                    <span className="mt-1">Plan</span>
                </Link>
                <Link to="/ats" className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-150 ${location.pathname === '/ats' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/ats' ? "'FILL' 1" : "'FILL' 0" }}>edit_document</span>
                    <span className="mt-1">Builder</span>
                </Link>
            </nav>
        </div>
    );
};

export default DashboardLayout;
