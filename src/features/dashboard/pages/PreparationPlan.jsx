import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import interviewService from '../../../services/interview.service';

const PreparationPlan = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await interviewService.getReportById(id);
                setReport(data.interviewReport);
            } catch (err) {
                setError('Failed to load preparation plan.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="font-body-lg text-secondary">Mapping your roadmap...</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl flex flex-col items-center space-y-md">
                <span className="material-symbols-outlined text-[48px]">error</span>
                <p className="font-h3 text-h3">{error || 'Plan not found.'}</p>
                <Link to="/analysis/new" className="bg-primary text-on-primary px-lg py-sm rounded-full">Try Again</Link>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="border-b border-outline-variant pb-md">
                <h1 className="font-h1 text-h1 text-on-surface">Interview Preparation Roadmap</h1>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">A day-by-day guide to mastering the target role.</p>
            </header>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-outline-variant hidden md:block"></div>

                <div className="space-y-xl md:pl-12">
                    {report.preparationPlan?.map((day, index) => (
                        <div key={index} className="relative">
                            {/* Day Marker */}
                            <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-button text-[12px] shadow-sm hidden md:flex">
                                {index + 1}
                            </div>
                            
                            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm mb-md">
                                    <div>
                                        <h3 className="font-h3 text-[20px] text-on-background">{day.day}</h3>
                                        <p className="font-label-caps text-secondary text-[10px] uppercase tracking-widest">{day.focus}</p>
                                    </div>
                                    <div className="flex items-center gap-xs px-3 py-1 bg-surface-container-high rounded-full">
                                        <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                                        <span className="font-body-sm text-[12px] font-medium">~2-3 hours</span>
                                    </div>
                                </div>

                                <div className="space-y-sm">
                                    <h4 className="font-button text-button text-on-surface">Action Items:</h4>
                                    <ul className="space-y-sm">
                                        {day.tasks?.map((task, taskIdx) => (
                                            <li key={taskIdx} className="flex items-start gap-sm p-sm bg-surface-container-lowest border border-outline-variant rounded-lg">
                                                <div className="mt-0.5 w-5 h-5 rounded border border-outline flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                                    {/* Checkbox placeholder */}
                                                </div>
                                                <span className="font-body-md text-on-surface-variant flex-1">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {(!report.preparationPlan || report.preparationPlan.length === 0) && (
                        <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
                            <span className="material-symbols-outlined text-[64px] text-surface-container-highest mb-md">event_note</span>
                            <p className="font-body-lg text-secondary">No preparation plan found for this report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreparationPlan;
