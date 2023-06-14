import axios from 'axios';
import queryString from 'query-string';
import { EmailPluginSettingInterface, EmailPluginSettingGetQueryInterface } from 'interfaces/email-plugin-setting';
import { GetQueryInterface } from '../../interfaces';

export const getEmailPluginSettings = async (query?: EmailPluginSettingGetQueryInterface) => {
  const response = await axios.get(`/api/email-plugin-settings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmailPluginSetting = async (emailPluginSetting: EmailPluginSettingInterface) => {
  const response = await axios.post('/api/email-plugin-settings', emailPluginSetting);
  return response.data;
};

export const updateEmailPluginSettingById = async (id: string, emailPluginSetting: EmailPluginSettingInterface) => {
  const response = await axios.put(`/api/email-plugin-settings/${id}`, emailPluginSetting);
  return response.data;
};

export const getEmailPluginSettingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/email-plugin-settings/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteEmailPluginSettingById = async (id: string) => {
  const response = await axios.delete(`/api/email-plugin-settings/${id}`);
  return response.data;
};
