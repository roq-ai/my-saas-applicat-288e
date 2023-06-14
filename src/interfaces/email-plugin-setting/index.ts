import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EmailPluginSettingInterface {
  id?: string;
  user_id: string;
  setting_key: string;
  setting_value: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface EmailPluginSettingGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  setting_key?: string;
  setting_value?: string;
}
