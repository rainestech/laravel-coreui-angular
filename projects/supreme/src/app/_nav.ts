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
];
