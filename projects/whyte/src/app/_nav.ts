interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}

interface NavBadge {
  text: string;
  variant: string;
}

interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
  module?: string;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-user',
  },
  {
    name: 'Chat',
    url: '/chat',
    icon: 'icon-docs',
  },
  {
    name: 'Channels',
    url: '/channels',
    icon: 'icon-fire',
  },
  {
    name: 'Tasks',
    url: '/tasks',
    icon: 'icon-fire',
  },
  {
    name: 'Calendar',
    url: '/calendar',
    icon: 'icon-magnifier',
  },
  {
    name: 'Profile',
    url: '/profile',
    icon: 'icon-list',
  },
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Manage Users',
    url: '/admin/users',
    icon: 'icon-people',
  },
  {
    name: 'Manage Roles',
    url: '/admin/roles',
    icon: 'icon-people',
  },
  {
    name: 'Access Control',
    url: '/admin/access',
    icon: 'icon-people',
  },
  {
    name: 'User Activity',
    url: '/admin/activity',
    icon: 'icon-options',
  },
];
