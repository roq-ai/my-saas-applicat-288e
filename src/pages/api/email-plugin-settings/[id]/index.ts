import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { emailPluginSettingValidationSchema } from 'validationSchema/email-plugin-settings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.email_plugin_setting
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEmailPluginSettingById();
    case 'PUT':
      return updateEmailPluginSettingById();
    case 'DELETE':
      return deleteEmailPluginSettingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmailPluginSettingById() {
    const data = await prisma.email_plugin_setting.findFirst(
      convertQueryToPrismaUtil(req.query, 'email_plugin_setting'),
    );
    return res.status(200).json(data);
  }

  async function updateEmailPluginSettingById() {
    await emailPluginSettingValidationSchema.validate(req.body);
    const data = await prisma.email_plugin_setting.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEmailPluginSettingById() {
    const data = await prisma.email_plugin_setting.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
