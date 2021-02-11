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
    title: true,
    name: 'Profile'
  },
  {
    name: 'My Profile',
    url: '/profile',
    icon: 'icon-user',
  },
  {
    name: 'My Documents',
    url: '/docs',
    icon: 'icon-docs',
  },
  {
    name: 'Profile Settings',
    url: '/profile-options',
    icon: 'icon-fire',
  },
  {
    title: true,
    name: 'Search'
  },
  {
    name: 'Search Candidates',
    url: '/search',
    icon: 'icon-magnifier',
  },
  {
    name: 'ShortLists',
    url: '/shortlists',
    icon: 'icon-list',
  },
  {
    title: true,
    name: 'Settings'
  },
  {
    name: 'API Tokens',
    url: '/tokens',
    icon: 'icon-shield',
  },
  {
    name: 'API Documentation',
    url: '/api-docs',
    icon: 'icon-support',
  },
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Manage Candidates',
    url: '/admin/candidates',
    icon: 'icon-directions',
  },
  {
    name: 'Manage Recruiters',
    url: '/admin/recruiters',
    icon: 'icon-organization',
  },
  {
    name: 'Manage Users',
    url: '/admin/users',
    icon: 'icon-people',
  },
  {
    name: 'Reports',
    url: '/admin/report',
    icon: 'icon-options',
  },
];
