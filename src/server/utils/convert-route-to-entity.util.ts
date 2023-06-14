const mapping: Record<string, string> = {
  'email-plugin-settings': 'email_plugin_setting',
  organizations: 'organization',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
