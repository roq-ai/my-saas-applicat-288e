import * as yup from 'yup';

export const emailPluginSettingValidationSchema = yup.object().shape({
  setting_key: yup.string().required(),
  setting_value: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
