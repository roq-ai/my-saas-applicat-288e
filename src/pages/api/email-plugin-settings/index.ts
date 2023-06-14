import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { emailPluginSettingValidationSchema } from 'validationSchema/email-plugin-settings';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEmailPluginSettings();
    case 'POST':
      return createEmailPluginSetting();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmailPluginSettings() {
    const data = await prisma.email_plugin_setting
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'email_plugin_setting'));
    return res.status(200).json(data);
  }

  async function createEmailPluginSetting() {
    await emailPluginSettingValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.email_plugin_setting.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
