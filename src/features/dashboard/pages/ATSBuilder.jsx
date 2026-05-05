import React, { useState, useEffect } from 'react';
import interviewService from '../../../services/interview.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ATSBuilder = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await interviewService.getAllReports();
                setReports(data.interviewReports);
            } catch (err) {
                console.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleDownload = async (id) => {
        setDownloading(id);
        try {
            const blob = await interviewService.downloadResume(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Optimized_Resume_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to download resume');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your resumes..." />;
    }

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="border-b border-outline-variant pb-md">
                <h1 className="font-h1 text-h1 text-on-surface">ATS Resume Builder</h1>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">Download AI-optimized, ATS-friendly versions of your resume.</p>
            </header>

            <div className="grid gap-md">
                {reports?.map((report) => (
                    <div key={report._id} className="bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-md">
                            <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                                <h3 className="font-h3 text-[18px] text-on-surface font-bold">{report.title || 'Untitled Report'}</h3>
                                <p className="font-body-sm text-secondary">Optimized for: {report.title || 'Job Role'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDownload(report._id)}
                            disabled={downloading === report._id}
                            className={`flex items-center gap-xs px-lg py-sm rounded-full font-button text-sm transition-all ${
                                downloading === report._id 
                                ? 'bg-surface-container-high text-secondary cursor-not-allowed' 
                                : 'bg-primary text-on-primary hover:bg-primary/90'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {downloading === report._id ? 'sync' : 'download'}
                            </span>
                            {downloading === report._id ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>
                ))}

                {(!reports || reports.length === 0) && (
                    <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
                        <span className="material-symbols-outlined text-[64px] text-surface-container-highest mb-md">architecture</span>
                        <p className="font-body-lg text-secondary">No analyzed resumes found. Start a new analysis to generate optimized resumes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ATSBuilder;
