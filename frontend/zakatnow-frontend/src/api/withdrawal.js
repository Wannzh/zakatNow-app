import api from './axios';

export const requestWithdrawal = (requestData) => {
  return api.post('/withdraws/request', requestData);
};

export const getCampaignWithdrawalHistory = (campaignId) => {
  return api.get(`/withdraws/campaign/${campaignId}`);
};

export const getWithdrawals = (page = 0, size = 10, sort = 'requestedAt,desc') => {
  return api.get(`/withdraws?page=${page}&size=${size}&sort=${sort}`);
};

export const approveWithdrawal = (id) => {
  return api.put(`/withdraws/${id}/approve`);
};

export const rejectWithdrawal = (id) => {
  return api.put(`/withdraws/${id}/reject`);
};