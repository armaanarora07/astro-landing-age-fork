interface Config {
  app: {
    name: string;
    domain: string;
    url: string;
    adminEmail: string;
  };
  analytics: {
    googleAnalyticsId: string | null;
    allowedDomains: string;
  };
  email: {
    postmarkApiKey: string;
    fromEmail: string;
    replyTo: string;
  };
  database: {
    url: string;
  };
  waitlist: {
    enabled: boolean;
    notifyEmail: string;
  };
  contactForm: {
    enabled: boolean;
    notifyEmail: string;
  };
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    facebook: string;
    instagram: string;
  };
  features: {
    blog: boolean;
    docs: boolean;
    navbar: boolean;
  };
  pricing: {
    basic: number;
    pro: number;
    enterprise: number;
    basicName: string;
    proName: string;
    enterpriseName: string;
  };
  server: {
    host: string;
    port: number;
    logFile: string;
    logFormat: 'json' | 'console';
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  
  // For pricing values, return 0 if the value is explicitly set to an empty string
  // This allows users to explicitly disable a price tier by setting it to empty
  if ((key.includes('PRICE_') || key.includes('_PRICE')) && value === '') {
    return 0;
  }
  
  // Special case for "FREE" pricing
  if ((key.includes('PRICE_') || key.includes('_PRICE')) && value.toUpperCase() === 'FREE') {
    return -1; // Use -1 to indicate FREE pricing
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return num;
}

// Helper to check if a pricing env var exists
function hasPricingEnvVar(key: string): boolean {
  return key in import.meta.env;
}

function getEnvVarOrNull(key: string): string | null {
  const value = import.meta.env[key];
  return value || null;
}

// Helper to get a social media URL or empty string
function getSocialUrl(key: string): string {
  return import.meta.env[key] || '';
}

export const config: Config = {
  app: {
    name: getEnvVar('APP_NAME', 'AI Chat Assistant'),
    domain: getEnvVar('APP_DOMAIN', 'example.com'),
    url: getEnvVar('APP_URL', 'https://example.com'),
    adminEmail: getEnvVar('ADMIN_EMAIL', 'admin@example.com'),
  },
  analytics: {
    googleAnalyticsId: getEnvVarOrNull('GOOGLE_ANALYTICS_ID'),
    allowedDomains: getEnvVar('ANALYTICS_DOMAINS', 'https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com'),
  },
  email: {
    postmarkApiKey: getEnvVar('POSTMARK_API_KEY', ''),
    fromEmail: getEnvVar('POSTMARK_FROM', 'notifications@example.com'),
    replyTo: getEnvVar('POSTMARK_TO', 'support@example.com'),
  },
  database: {
    url: getEnvVar('DATABASE_URL', 'file:./data.db'),
  },
  waitlist: {
    enabled: getEnvBoolean('WAITLIST_ENABLED', true),
    notifyEmail: getEnvVar('WAITLIST_NOTIFY_EMAIL', getEnvVar('POSTMARK_TO', 'founders@example.com')),
  },
  contactForm: {
    enabled: getEnvBoolean('CONTACT_FORM_ENABLED', true),
    notifyEmail: getEnvVar('CONTACT_FORM_NOTIFY_EMAIL', getEnvVar('POSTMARK_TO', 'sales@example.com')),
  },
  social: {
    twitter: getSocialUrl('TWITTER_URL'),
    github: getSocialUrl('GITHUB_URL'),
    linkedin: getSocialUrl('LINKEDIN_URL'),
    facebook: getSocialUrl('FACEBOOK_URL'),
    instagram: getSocialUrl('INSTAGRAM_URL'),
  },
  features: {
    blog: getEnvBoolean('ENABLE_BLOG', false),
    docs: getEnvBoolean('ENABLE_DOCS', false),
    navbar: getEnvBoolean('ENABLE_NAVBAR', true),
  },
  pricing: {
    // For pricing values, if the env var isn't defined, use 0 (contact us) instead of a default price
    basic: hasPricingEnvVar('PRICE_BASIC') ? getEnvNumber('PRICE_BASIC', 9) : 0,
    pro: hasPricingEnvVar('PRICE_PRO') ? getEnvNumber('PRICE_PRO', 29) : 0,
    enterprise: hasPricingEnvVar('PRICE_ENTERPRISE') ? getEnvNumber('PRICE_ENTERPRISE', 99) : 0,
    basicName: getEnvVar('BASIC_TIER_NAME', 'Basic'),
    proName: getEnvVar('PRO_TIER_NAME', 'Pro'),
    enterpriseName: getEnvVar('ENTERPRISE_TIER_NAME', 'Enterprise'),
  },
  server: {
    host: getEnvVar('ASTRO_HOST', 'astro-app'),
    port: getEnvNumber('ASTRO_PORT', 4321),
    logFile: getEnvVar('LOG_FILE', '/var/log/caddy/access.log'),
    logFormat: getEnvVar('LOG_FORMAT', 'json') as 'json' | 'console',
  },
} as const; 