interface Config {
  app: {
    name: string;
    domain: string;
    url: string;
    adminEmail: string;
  };
  analytics: {
    googleAnalyticsId: string | null;
    posthogApiKey: string | null;
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
  };
  features: {
    blog: boolean;
    docs: boolean;
  };
  pricing: {
    basic: number;
    pro: number;
    enterprise: number;
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
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return num;
}

function getEnvVarOrNull(key: string): string | null {
  const value = import.meta.env[key];
  return value || null;
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
    posthogApiKey: getEnvVarOrNull('POSTHOG_API_KEY'),
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
    enabled: getEnvBoolean('ENABLE_WAITLIST', getEnvBoolean('WAITLIST_ENABLED', true)),
    notifyEmail: getEnvVar('WAITLIST_NOTIFY_EMAIL', getEnvVar('POSTMARK_TO', 'founders@example.com')),
  },
  contactForm: {
    enabled: getEnvBoolean('CONTACT_FORM_ENABLED', true),
    notifyEmail: getEnvVar('CONTACT_FORM_NOTIFY_EMAIL', getEnvVar('POSTMARK_TO', 'sales@example.com')),
  },
  social: {
    twitter: getEnvVar('TWITTER_URL', 'https://twitter.com/your-company'),
    github: getEnvVar('GITHUB_URL', 'https://github.com/your-company'),
    linkedin: getEnvVar('LINKEDIN_URL', 'https://linkedin.com/company/your-company'),
  },
  features: {
    blog: getEnvBoolean('ENABLE_BLOG', false),
    docs: getEnvBoolean('ENABLE_DOCS', false),
  },
  pricing: {
    basic: getEnvNumber('PRICE_BASIC', 9),
    pro: getEnvNumber('PRICE_PRO', 29),
    enterprise: getEnvNumber('PRICE_ENTERPRISE', 99),
  },
  server: {
    host: getEnvVar('ASTRO_HOST', 'astro-app'),
    port: getEnvNumber('ASTRO_PORT', 4321),
    logFile: getEnvVar('LOG_FILE', '/var/log/caddy/access.log'),
    logFormat: getEnvVar('LOG_FORMAT', 'json') as 'json' | 'console',
  },
} as const; 