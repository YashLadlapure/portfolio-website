# Contributing to Portfolio Website

Thank you for considering contributing to this portfolio website! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Explain why this enhancement would be useful
- Mockups or examples if applicable

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests and ensure code quality checks pass
5. Commit your changes following our commit guidelines
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Coding Guidelines

### HTML/CSS

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Ensure responsive design (mobile-first approach)
- Maintain accessibility standards (WCAG 2.1 AA)

### JavaScript

- Use ES6+ features
- Write clean, self-documenting code
- Add comments for complex logic
- Follow ESLint configuration

### Accessibility

- Include appropriate ARIA labels
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Test with screen readers when possible

### Performance

- Optimize images (use WebP format when possible)
- Minimize CSS and JavaScript
- Lazy load images and components
- Keep bundle sizes small

## Commit Guidelines

We follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples:

```
feat(portfolio): add project filtering functionality

fix(contact): resolve form validation issue

docs(readme): update installation instructions
```

## Pull Request Process

1. **Update Documentation**: Update README.md and other docs as needed
2. **Run Tests**: Ensure all tests pass
3. **Code Quality**: Run linting and fix any issues
4. **Fill PR Template**: Complete all sections of the pull request template
5. **Link Issues**: Reference any related issues
6. **Request Review**: Request review from maintainers
7. **Address Feedback**: Respond to review comments promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Performance impact assessed

## Questions?

Feel free to open a discussion or reach out to the maintainers if you have questions!

Thank you for contributing! 🎉
