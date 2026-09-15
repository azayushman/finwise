# Contributing to FinWise

First off, thank you for considering contributing to FinWise! It's people like you that make this financial literacy platform such a great tool for everyone.

## 🌿 Branch Naming Conventions

Please use the following prefixes when creating a new branch to keep our repository organized:

- `feat/` - For new features (e.g., `feat/multi-currency`)
- `fix/` - For bug fixes (e.g., `fix/auth-callback-loop`)
- `refactor/` - For code refactoring without behavior changes
- `docs/` - For documentation updates
- `chore/` - For routine tasks, dependency updates, etc.
- `test/` - For adding or fixing tests

**Example:** `feat/add-investment-calculator`

## 💻 Code Style & Standards

To maintain a high-quality, readable codebase, please adhere to these guidelines:

1. **TypeScript First**: Always use strong typing. Avoid `any` at all costs. Utilize specific interfaces and types for component props and state.
2. **React Functional Components**: We exclusively use functional components with Hooks.
3. **Tailwind CSS**: Use Tailwind utility classes for styling. Avoid inline styles or arbitrary values `w-[32px]` unless strictly necessary. Follow the existing glassmorphic design system tokens defined in `tailwind.config.ts`.
4. **Linting & Formatting**: Ensure your code passes all lint checks before committing.
   ```bash
   npm run lint
   ```
5. **Testing**: If you add new utility logic or calculations, add corresponding unit tests in `src/lib/__tests__/`.
   ```bash
   npm run test
   ```

## 🔄 Pull Request Workflow

1. **Fork & Branch**: Fork the repository and create your branch from `main`.
2. **Commit Often**: Write clear, descriptive commit messages.
3. **Update Documentation**: If you've changed APIs, components, or added new features, update `README.md` or add inline TSDoc comments.
4. **Open a PR**: Open a Pull Request against our `main` branch. 
5. **Code Review**: A core team member will review your PR. Please be responsive to feedback and be prepared to make requested changes.

## 🚀 CI / CD Pipeline

All Pull Requests automatically trigger our GitHub Actions workflow (`ci.yml`). Your PR will only be eligible for merging if:
- Dependencies install cleanly.
- `npm run lint` yields zero errors.
- `npm run test` passes 100%.
- A static test build (`npm run build`) completes without TypeScript or hydration errors.

Thank you for contributing!
