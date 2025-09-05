// src/api/donation.js

import api from './axios';

export const createDonation = (donationData) => {
  return api.post('/donations/create', null, {
    params: {
      campaignId: donationData.campaignId,
      amount: donationData.amount,
      paymentMethod: donationData.paymentMethod
    }
  });
};

export const getDonationHistory = () => {
  return api.get('/donations/history');
};

export const getAllDonations = (page = 0, size = 10, sort = 'donatedAt,desc') => {
  return api.get(`/donations/admin/history?page=${page}&size=${size}&sort=${sort}`);
};

// Fungsi baru untuk memeriksa status donasi berdasarkan ID eksternal
export const getDonationStatusById = (externalId) => {
  return api.get(`/donations/status/${externalId}`);
};