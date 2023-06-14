import * as yup from 'yup';
import { teamMemberValidationSchema } from 'validationSchema/team-members';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  team_member: yup.array().of(teamMemberValidationSchema),
});
