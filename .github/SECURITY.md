# Security Policy

## Supported Versions

This section outlines which versions of the portfolio website are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

We recommend always using the latest version of the portfolio website to ensure you have the most recent security updates.

## Reporting a Vulnerability

We take the security of our portfolio website seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them using one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security Advisories](https://github.com/YashLadlapure/portfolio-website/security/advisories) page
   - Click "Report a vulnerability"
   - Fill in the details about the vulnerability

2. **Email**
   - Send an email with details to the repository maintainer
   - Include the word "SECURITY" in the subject line

### What to Include in Your Report

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, CSRF, SQL injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it
- Any potential mitigations you've identified

### What to Expect

After you submit a report, you can expect:

1. **Initial Response**: Within 48 hours, we will acknowledge receipt of your vulnerability report
2. **Assessment**: Within 7 days, we will assess the vulnerability and determine its severity
3. **Updates**: We will keep you informed about our progress as we work on a fix
4. **Resolution**: Once we've developed and tested a fix, we will:
   - Notify you of the planned release date
   - Credit you in the security advisory (unless you prefer to remain anonymous)
   - Release the security patch

### Security Update Process

When a security issue is identified:

1. The issue is privately discussed and a fix is prepared
2. A new version is released with the security fix
3. A security advisory is published on GitHub
4. The vulnerability details are disclosed responsibly

## Security Best Practices

If you're using or contributing to this portfolio website, please follow these security best practices:

### For Users

- Always use the latest version
- Keep your browser updated
- Be cautious when running the site locally
- Review security advisories regularly

### For Contributors

- Never commit sensitive data (API keys, passwords, etc.)
- Sanitize user inputs
- Use HTTPS for all external resources
- Follow secure coding guidelines in CONTRIBUTING.md
- Run security checks before submitting PRs
- Keep dependencies up to date

## Security Features

This portfolio website implements several security features:

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HTTPS**: All resources loaded over secure connections
- **Input Validation**: Form inputs are properly validated and sanitized
- **Dependency Scanning**: Regular automated scans for vulnerable dependencies
- **Code Quality Checks**: Automated checks for security issues

## Responsible Disclosure

We believe in responsible disclosure and will:

- Work with you to understand and validate the vulnerability
- Keep you informed throughout the fix process
- Credit you appropriately (unless you prefer anonymity)
- Publicly disclose the vulnerability only after a fix is available

## Security Hall of Fame

We maintain a list of security researchers who have responsibly disclosed vulnerabilities:

_No vulnerabilities have been reported yet._

Thank you for helping keep our portfolio website secure! 🔒
