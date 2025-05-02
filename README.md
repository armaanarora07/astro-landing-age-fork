# Landstro

<p align="center">
  <img src="landstro.png" alt="Landstro Logo" width="250" />
</p>

<p align="center">
  <strong>Modern landing page starter built with Astro, TailwindCSS, and TypeScript</strong>
</p>

<p align="center">
  <em>Landstro is offered by <a href="https://benav.io" target="_blank">benav.io</a></em>
</p>

Landstro is a feature-rich, production-ready landing page starter designed to help you quickly launch beautiful websites. With dark mode, SEO optimization, contact forms, and more, it provides everything you need to showcase your product or service.

## Table of Contents

- [Features](#features)
- [Project Overview](#project-overview)
  - [Project Structure](#project-structure)
  - [Automated Build Process](#automated-build-process)
- [Getting Started: Technical Setup](#getting-started-technical-setup)
  - [Initial Installation](#initial-installation)
  - [Creating Environment Variables](#creating-environment-variables)
  - [Previewing and Building](#previewing-and-building)
- [Creating an Effective Landing Page](#creating-an-effective-landing-page)
  - [Hero Section Best Practices](#hero-section-best-practices)
  - [Conversion Optimization](#conversion-optimization)
  - [Psychological Principles](#psychological-principles)
  - [Content Guidelines](#content-guidelines)
  - [Key Components to Customize](#key-components-to-customize)
- [Customization Guide](#customization-guide)
  - [Automatic Customizations](#automatic-customizations)
  - [Essential Files to Modify](#essential-files-to-modify)
  - [Advanced Customization](#advanced-customization)
- [Setting Up External Services](#setting-up-external-services)
  - [Domain Management](#domain-management)
  - [Email Communication with Postmark](#email-communication-with-postmark)
  - [Analytics with Google](#analytics-with-google)
- [Deployment Options](#deployment-options)
  - [Self-Hosted with Docker](#self-hosted-with-docker)
  - [Deploying on Digital Ocean](#deploying-on-digital-ocean)
  - [Setting Up Cloudflare](#setting-up-cloudflare)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- 🚀 **Built with [Astro](https://astro.build/)** - Super fast static site generator
- 💨 **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- 🌙 **Dark Mode** - Automatic and manual dark mode support
- 📱 **Responsive Design** - Mobile-first approach
- 🔍 **SEO Optimized** - Meta tags, Open Graph, JSON-LD
- 📧 **Contact Form** - Ready-to-use contact form with database storage
- 📊 **Waitlist & Early Access** - Built-in signup forms with database storage
- 🔒 **Security Headers** - CSP, CORS, and other security best practices
- 📊 **Analytics Ready** - Google Analytics integration
- 🎨 **Modern UI Components**:
  - Hero Section
  - Features/Benefits
  - Social Proof
  - Pricing Tables
  - FAQ Section
  - Contact Modal
  - Footer

## Project Overview

### Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Page layouts
├── pages/          # Route pages
├── lib/            # Utilities and database
├── styles/         # Global styles
└── data/           # Static data

public/
├── favicon/        # Favicon files (generated automatically)
├── images/         # Images and assets
│   ├── icon/       # Place your logo.png here
│   └── companies/  # Partner/client logos
```

### Automated Build Process

The `npm run build` command automatically runs several important processes:

```javascript
// From package.json
"build": "node src/lib/initDb.js && npm run optimize-images && npm run generate-favicons && astro build"
```

This means a single build command:

- Initializes the SQLite database (for contact form and waitlist storage)
- Optimizes all images in the public directory
- Generates favicons from your logo.png
- Builds the Astro site with all optimizations

For deployment preparation, `npm run prepare-prod` goes further:
```javascript
"prepare-prod": "npm run generate-caddyfile && npm run build && mkdir -p production-build && cp -r dist production-build/ && cp db.sqlite production-build/ && cp package.json production-build/ && cp Caddyfile production-build/"
```

This creates a complete production build with all required files for deployment.

## Getting Started: Technical Setup

### Initial Installation

1. **Use the Landstro Template**:
   - Click the `Use this template` button in the GitHub repository
   - Create a repository using Landstro as your template
   - Clone your new repository:
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add your logo**:
   - Create a `logo.png` file with your company logo
   - Place it in `public/images/icon/logo.png`
   - This logo will be used to generate all favicons and site branding
   - **Recommendation**: Use a square logo with at least 512×512px dimensions

### Creating Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp env.example .env
   ```

2. **Open the `.env` file and update these key settings**:
   ```env
   # Application Settings
   APP_NAME=Your Company Name
   APP_DOMAIN=your-domain.com
   SITE_URL=https://your-domain.com
   ADMIN_EMAIL=your-email@example.com

   # Contact Form Settings 
   CONTACT_FORM_ENABLED=true
   CONTACT_FORM_NOTIFY_EMAIL=your-email@example.com

   # Waitlist Settings
   WAITLIST_ENABLED=true
   WAITLIST_NOTIFY_EMAIL=your-email@example.com

   # Analytics
   GOOGLE_ANALYTICS_ID=your-GA-ID
   ```

### Previewing and Building

1. **Preview your site locally**:
   ```bash
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

## Creating an Effective Landing Page

Let's face it: the internet is crowded, and people have almost no patience. You have about 10 seconds to convince visitors that your solution is worth their time. A well-crafted landing page can be the difference between a thriving business and a failed launch. Here's how to make yours convert.

### Mastering the Hero Section

Your hero section does almost all of the conversion work. This is where most visitors make their split-second decision to stay or leave.

**The Brand Paradox**: While your brand matters to you, it doesn't matter much to new visitors (you are not apple - yet). Keep your logo small and your brand name modest, positioned in the top left corner. Your visitors aren't looking for a cool brand name—they're looking for solutions to their problems.

**Headline Hierarchy**: Your headline should be BIG and immediately communicate value. A great headline answers one question: "Why should a stranger stay on your site for more than three seconds?" Write about the pain you're relieving, the problem you're solving, or the pleasure you're giving.

**Visual Proof**: People need to see what they're getting. Place a demo of your product prominently in the hero section—an image is good, a video is better, and an interactive demo is best. Keep it clutter-free and focused on your most valuable feature. If this delays you, launch without it and add it later.

**Trust Signals**: Visitors don't trust you yet. Include social proof elements like testimonials, user counts, or recognizable client logos directly in your hero section. Never fake these—people are incredibly good at detecting inauthenticity.

**Action-Oriented CTA**: Your call-to-action button should be prominent, in a contrasting color, and use action-oriented language that reinforces benefits (e.g., "Create My Landing Page" instead of "Sign Up"). Place it prominently below your headline and address common objections in small text beneath it (e.g., "No credit card required" or "Free 14-day trial").

### Converting Visitors to Customers

Beyond the hero section, your entire landing page should be designed with conversion in mind:

**Focus on One Goal**: Every element on your page should drive toward a single conversion goal. Multiple CTAs or competing offers will only confuse visitors and reduce conversions.

**Visual Flow**: Guide the visitor's eye naturally down the page with a clear visual hierarchy. Use size, color, and spacing to emphasize what's most important.

**Reduce Friction**: Every field in a form, every click required, and every decision you ask visitors to make adds friction. Minimize these whenever possible—a simple email-only signup form will convert far better than one asking for multiple pieces of information.

**Mobile Experience**: Over half your visitors will likely be on mobile devices. Ensure your site looks perfect and functions flawlessly on small screens.

**Address Objections**: Visitors will have concerns before converting. Anticipate and address these objections directly in your copy. "Is it expensive?" → "Start for free, no credit card required." "Is it complicated?" → "Set up in under 2 minutes."

### Psychological Principles That Drive Conversion

Smart marketers understand and ethically apply these psychological triggers:

**Scarcity and Urgency**: Limited-time offers, early-bird pricing, or showing limited availability can motivate fence-sitters to act now rather than later.

**Social Validation**: We look to others to determine what's correct or valuable. Testimonials, case studies, and user statistics provide this social proof and reduce perceived risk.

**Authority Signals**: Credentials, media mentions, industry awards, and partnerships establish credibility and trust.

**Reciprocity**: Offer genuine value upfront—a useful download, a free trial, or valuable content—to activate the natural desire to reciprocate.

**Loss Aversion**: People are more motivated to avoid losses than to achieve equivalent gains. Framing benefits as avoiding negative outcomes ("Stop losing customers to slow websites") can be more motivating than purely positive messaging.

### Key Components to Customize in Landstro

Landstro makes it easy to implement these conversion principles through its component system:

1. **Hero Section** (`src/components/Hero.astro`)
   - Make your headline big, bold, and benefit-focused
   - Keep your brand elements modest in size
   - Include a strong visual demonstration of your product
   - Use a single, clear CTA with action-oriented language
   - Add trust indicators directly in the hero area

2. **Benefits Section** (`src/components/Benefits.astro`)
   - Focus on outcomes, not features ("Save 10 hours weekly" vs "Automated reporting")
   - Use customer language rather than industry jargon
   - Limit to 3-4 core benefits for maximum impact
   - Support claims with specific numbers or results when possible

3. **Social Proof** (`src/components/SocialProof.astro`)
   - Use real testimonials with specific results or benefits
   - Include full names and photos to increase credibility
   - Feature recognizable client or partner logos
   - Consider adding verifiable metrics (e.g., "10,000+ happy customers")

4. **Pricing Tables** (`src/components/Pricing.astro`)
   - Highlight a recommended option to guide decision-making
   - Focus on value rather than just features
   - Address pricing objections directly (e.g., money-back guarantee, free trial)
   - Include social proof elements near pricing to reduce purchase anxiety

5. **FAQ Section** (`src/components/FAQ.astro`)
   - Answer real questions rather than creating marketing-focused "FAQs"
   - Address objections directly and honestly
   - Include practical questions about implementation, setup, and support
   - End with a soft CTA to guide visitors who've read this far

Remember: Launch your landing page as quickly as possible, then iterate based on real visitor behavior. A mediocre live page provides more learning than a perfect page that never launches.

## Customization Guide

### Automatic Customizations

The build process automatically handles several customizations based on your `.env` settings:

1. **Company Name**: Set via `APP_NAME` in `.env` - this will automatically update:
   - The navbar brand name
   - SEO metadata site name
   - Various references throughout the site

2. **Social Media Links**: Set via `TWITTER_URL`, `GITHUB_URL`, and `LINKEDIN_URL` in `.env` - these will appear in the navbar and footer automatically

3. **Email Settings**: Set via Postmark API keys and notification emails in `.env` - these configure form submissions

4. **Favicons**: Automatically generated from your logo.png during build

5. **Database**: Automatically initialized with proper tables for waitlist/contact forms

### Essential Files to Modify

1. **Branding & Logo**:
   - Replace `public/images/icon/logo.png` with your own logo (a square PNG, at least 512×512px)
   - Remove or replace company logos in `public/images/companies/` with your own partners/clients
   - All optimized images and favicons will be regenerated automatically when source images change

2. **Content Sections** (Manual Updates Required):
   - Hero section: `src/components/Hero.astro` (update headlines, descriptions, CTAs)
   - Benefits/features: `src/components/Benefits.astro` (update your product features)
   - Pricing: `src/components/Pricing.astro` (update tiers and pricing)
   - FAQ: `src/components/FAQ.astro` (update questions and answers)
   - Call to action: `src/components/CTA.astro` (update to match your value proposition)
   - Footer: `src/components/Footer.astro` (update copyright and additional links)

3. **Environment Variables** (Critical Configuration):
   - Update your `.env` file with all necessary values (see [Environment Variables](#creating-environment-variables) section)
   
4. **SEO & Metadata**:
   - Edit `src/layouts/Layout.astro` to update JSON-LD structured data (manually)
   - Meta keywords tag in `src/components/SEOMetadata.astro` should be updated manually

### Advanced Customization

- **Colors & Theme**: Edit the color scheme in `tailwind.config.mjs`
- **Typography**: Modify font settings in `tailwind.config.mjs`
- **Layout**: Adjust container widths and spacing in relevant component files

## Setting Up External Services

### Domain Management

#### Recommended Domain Types

- **Use**: `.com`, `.io`, `.ai`, `.dev`, or regional TLDs (`.co.uk`, `.de`, etc.)
- **Avoid**: Lesser-known TLDs like `.xyz`, `.online`, `.site` or even `.net` which can appear less professional

#### Domain Name Best Practices

- **Keep it short**: Ideally under 15 characters
- **Make it memorable**: Easy to spell and pronounce
- **Avoid hyphens**: They reduce memorability and trustworthiness
- **Check availability**: Ensure matching social media handles are available

#### Purchasing Process

1. Visit [Namecheap](https://www.namecheap.com/) or your preferred registrar
2. Search for your desired domain name
3. Purchase for 1-2 years (longer registrations can help with SEO)
4. Enable privacy protection to hide your personal information

### Email Communication with Postmark

This step is optional (and requires a work email). If you don't pass a Postmark key to `Landstro`, it will just store the emails in the database without sending notifications. You can also change the implementation for your prefered email sending provider.

1. **Create a Postmark account**:
   - Sign up at [Postmark](https://postmarkapp.com/)
   - Verify your domain ownership through DNS records

2. **Create a new server in Postmark**:
   - Name it after your website/project
   - Configure sender signatures for your domain

3. **Get your API keys**:
   - Navigate to "API Tokens" in your server settings
   - Copy the Server API token
   - Note: Keep this key private; never commit it to public repositories

4. **Configure DKIM and SPF records**:
   - Follow Postmark's instructions to add DNS records
   - This improves email deliverability and prevents spam flags

### Analytics with Google

1. **Create a Google Analytics 4 account**:
   - Visit [Google Analytics](https://analytics.google.com/)
   - Click "Start measuring" and follow the setup process

2. **Create a property for your website**:
   - Name it after your domain
   - Set the reporting time zone appropriately

3. **Set up a data stream**:
   - Choose "Web" as the platform
   - Enter your website URL
   - Note the Measurement ID (starts with "G-")

4. **Enable recommended data collection features**:
   - Enhanced measurement for events
   - User metrics reports

## Deployment Options

### Self-Hosted with Docker

Landstro includes a convenient deployment script that handles the entire process:

```bash
# Make the script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:

1. Load environment variables from your `.env` file
2. Prepare your production build with `npm run prepare-prod`
3. Set up Docker containers
4. Verify SSL configuration
5. Provide status of your deployment

For manual deployment, you can also run:

```bash
# Generate production assets
npm run prepare-prod

# Deploy using Docker
cd production-build
docker-compose -f ../docker-compose.yml up -d
```

### Deploying on Digital Ocean

1. **Create a Digital Ocean account**:
   - Sign up at [Digital Ocean](https://www.digitalocean.com/)
   - Add a payment method

2. **Create a new Droplet**:
   - Choose Ubuntu 22.04 LTS
   - Select a Basic plan ($5-10/month is sufficient for most landing pages)
   - Choose a datacenter region closest to your target audience
   - Add your SSH key for secure access

3. **Connect to your Droplet**:
   ```bash
   ssh root@your-droplet-ip
   ```

4. **Install Docker and Docker Compose**:
   ```bash
   apt update
   apt install -y docker.io docker-compose
   ```

5. **Configure your server**:
   ```bash
   mkdir -p /var/www/landstro
   cd /var/www/landstro
   ```

6. **Copy your files to the server**:
   Option 1: Using SCP:
   ```bash
   # On your local machine
   scp -r ./production-build/* root@your-droplet-ip:/var/www/landstro/
   ```
   
   Option 2: Using Git:
   ```bash
   # On your server
   git clone https://github.com/yourusername/landstro.git .
   ```

7. **Set up environment variables**:
   ```bash
   # On your server
   cp env.example .env
   nano .env  # Edit with your values
   ```

8. **Run the deployment script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

9. **Verify deployment**:
   - Check if containers are running: `docker-compose ps`
   - View logs if needed: `docker-compose logs -f`

### Setting Up Cloudflare

1. **Create a Cloudflare account**:
   - Sign up at [Cloudflare](https://www.cloudflare.com/)
   - Add your domain to Cloudflare

2. **Update nameservers at your domain registrar**:
   - Find the Cloudflare nameservers provided during setup
   - Update your domain's nameservers at your registrar
   - Wait for DNS propagation (can take 24-48 hours)

3. **Configure DNS records in Cloudflare**:
   - Create an A record pointing to your server IP:
     ```
     Type: A
     Name: @ (root domain)
     Content: your-server-ip
     Proxy status: Proxied
     ```
   
   - Add a CNAME record for www subdomain:
     ```
     Type: CNAME
     Name: www
     Content: yourdomain.com
     Proxy status: Proxied
     ```

4. **Enable SSL/TLS protection**:
   - Set SSL/TLS encryption mode to "Full" or "Full (strict)"
   - Enable "Always Use HTTPS"
   - Turn on "Automatic HTTPS Rewrites"

5. **Configure Cloudflare settings**:
   - Under "Speed" tab, enable Auto Minify for HTML, CSS, and JavaScript
   - Enable Brotli compression
   - Turn on caching features appropriate for your site

6. **Verify configuration**:
   - Visit your domain to ensure it loads properly
   - Check SSL certificate is valid (look for the padlock in browser)
   - Use [SSL Labs](https://www.ssllabs.com/ssltest/) to verify security configuration

## Troubleshooting

Common issues and solutions:

- **Missing favicons**: Ensure your logo.png exists at `public/images/icon/logo.png`
- **Form not working**: Check that the database was properly initialized during build
- **Image optimization issues**: Ensure Sharp is installed correctly
- **Site URL issues**: Verify that the `SITE_URL` environment variable is set correctly in your `.env` file
- **Failed deployment**: Check Docker logs with `docker-compose logs -f`
- **SSL certificate issues**: Verify Cloudflare is properly configured with your domain

> **Note about image regeneration**: When changing the logo.png or other source images, the build process automatically detects changes and regenerates optimized images and favicons as needed. No manual deletion of previously generated files is required.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <small>Landstro - Modern Landing Page Starter created by <a href="https://benav.io" target="_blank">benav.io</a></small>
</p>