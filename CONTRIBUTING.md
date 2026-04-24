# Contributing to Seamless QR Dining

Thank you for your interest in contributing to **Seamless QR Dining**! We welcome contributions of all kinds — bug reports, feature requests, documentation improvements, and code.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [License](#license)

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive experience for everyone.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/seamless-qr-dining.git
   cd seamless-qr-dining
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Run the linter:
   ```bash
   npm run lint
   ```
4. Run the test suite:
   ```bash
   npm run test
   ```

## Code Style

- **Language**: TypeScript is used throughout the project.
- **Framework**: Next.js (App Router) with React 19.
- **Styling**: Tailwind CSS.
- **Documentation**: All functions, components, and interfaces should include TSDoc/JSDoc comments.
- **Testing**: Write tests using Jest and React Testing Library. Place all test files in the `tests/` directory, mirroring the `src/` structure.

## How to Contribute

### Bug Fixes & Features

1. Check the [issue tracker](https://github.com/dhaatrik/seamless-qr-dining/issues) for open issues or create a new one.
2. Discuss the approach in the issue before starting work on large changes.
3. Write your code, including appropriate tests.
4. Ensure all tests pass and the linter reports no errors.

### Documentation

- Improvements to the README, inline code comments, or this contributing guide are always welcome.

## Pull Request Process

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Push your branch and open a pull request against `main`.
3. Provide a clear title and description explaining:
   - **What** the change does.
   - **Why** it's needed.
   - **How** to test it.
4. The CI pipeline must pass (lint, test, build) before merging.
5. A maintainer will review your PR and may request changes.

## Reporting Bugs

When filing a bug report, please include:

- **Steps to reproduce** the issue.
- **Expected behavior** vs. **actual behavior**.
- **Browser and OS** information.
- **Screenshots or error logs**, if applicable.

Open an issue at: [https://github.com/dhaatrik/seamless-qr-dining/issues](https://github.com/dhaatrik/seamless-qr-dining/issues)

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).
