import { useEffect, useState } from 'react';
import { getCampaigns } from '../api/campaign';
import { showError } from '../components/Toast';

export default function Dashboard() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                const res = await getCampaigns();
                setCampaigns(res.data.content);
            } catch (err) {
                showError('Gagal load campaign');
            }
        }
        fetchCampaigns();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {campaigns.map(c => (
                    <li key={c.id}>{c.title}</li>
                ))}
            </ul>
        </div>
    );
}
