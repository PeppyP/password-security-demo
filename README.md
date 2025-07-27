# Password Security Demo

Educational web application demonstrating client-side vs server-side password processing vulnerabilities for computer science students.

## Overview

This project provides hands-on learning about authentication security by implementing three different password validation approaches with intentional vulnerabilities and security best practices.

**Live Demo:** [View Demo](http://localhost:3000) (after running locally)

![Demo Screenshot](https://via.placeholder.com/800x400?text=Password+Security+Demo+Screenshot)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/password-security-demo.git
cd password-security-demo
npm install
```

### Running the Application

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start
```

Navigate to `http://localhost:3000`

## Usage

### Demo Credentials

| Method | Username | Password |
|--------|----------|----------|
| Client-side | `admin` | `password123` |
| Insecure Server | `admin` | `secretpassword` |
| Secure Server | `secureAdmin` | `supersecretpassword` |

### API Endpoints

```
POST /api/login-insecure    # Vulnerable authentication
POST /api/login-secure      # Secure authentication  
GET  /api/health           # Health check
```

## Architecture

```
├── server.js              # Express server
├── package.json           # Dependencies
├── public/
│   └── index.html        # Frontend application
└── .env.example          # Environment template
```

## Security Implementations

### Vulnerabilities Demonstrated

**Client-Side Processing**
- Validation logic exposed in browser
- Easily bypassed via developer tools
- Credentials visible in source code

**Insecure Server-Side**
- Information disclosure in error messages
- No rate limiting (brute force vulnerable)
- Weak authentication logic

**Secure Server-Side**
- bcrypt password hashing with salt
- Rate limiting (3 attempts/minute)
- Account lockout after 5 failed attempts
- Generic error messages
- Timing attack prevention

### Code Examples

**Rate Limiting**
```javascript
const secureRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
});
```

**Password Hashing**
```javascript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

## Performance Comparison

| Approach | Usability | Cost | Maintenance | Security | Server Load |
|----------|-----------|------|-------------|----------|-------------|
| Client-side | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| Insecure Server | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Secure Server | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

## Development

### Environment Variables

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development
```

### Scripts

- `npm start` - Production server
- `npm run dev` - Development with auto-reload
- `npm test` - Run tests

## Educational Content

### Learning Objectives

Students will learn:
- Why client-side validation is insufficient for security
- Common server-side vulnerabilities and exploitation techniques  
- Authentication security best practices
- Trade-offs between usability and security

### Exploit Examples

**Client-Side Bypass**
```javascript
// Paste in browser console
checkPasswordClient = function(e) {
    e.preventDefault();
    document.getElementById('client-result').innerHTML = 'Access Granted!';
    return false;
}
```

**Server-Side Attacks**
- Information disclosure via error messages
- Brute force attacks (no rate limiting)
- SQL injection simulation: `admin'--`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-vulnerability`)
3. Commit changes (`git commit -am 'Add new vulnerability example'`)
4. Push branch (`git push origin feature/new-vulnerability`)
5. Create Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Disclaimer

**For educational purposes only.** Contains intentional security vulnerabilities. Never use insecure code in production environments.