import api from './axios';

export const createReport = (reportData) => {
  const params = new URLSearchParams();
  params.append('campaignId', reportData.campaignId);
  params.append('description', reportData.description);
  params.append('startDate', reportData.startDate);
  params.append('endDate', reportData.endDate);
  params.append('format', reportData.format);
  
  return api.post('/reports/create', params);
};

export const getReports = () => {
  return api.get('/reports');
};

export const downloadReport = (id, format) => {
  const extension = format.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx';
  
  return api.get(`/reports/download/${id}?format=${format}`, {
    responseType: 'blob', 
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${id}.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  });
};