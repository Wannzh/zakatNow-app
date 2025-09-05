import api from './axios';

export const getCampaigns = (status = '') => {
  const endpoint = status ? `/campaigns?status=${status}` : '/campaigns';
  return api.get(endpoint);
};

export const getCampaignById = (id) => {
  return api.get(`/campaigns/${id}`);
};

export const createCampaign = (campaignData, userId) => {
  return api.post(`/campaigns/create?userId=${userId}`, campaignData);
};

export const updateCampaignStatus = (id, status) => {
  return api.put(`/campaigns/${id}/status?status=${status}`);
};

export const approveCancelRequest = (id) => {
  return api.patch(`/campaigns/${id}/cancel`);
};

export const requestCampaignCancellation = (id, reason) => {
  const endpoint = reason 
    ? `/campaigns/${id}/request-cancel?reason=${encodeURIComponent(reason)}`
    : `/campaigns/${id}/request-cancel`;
  return api.patch(endpoint);
};

export const getCampaignList = () => {
  return api.get('/campaigns/list');
};