# GitHub Publication Checklist

- [ ] **Secrets Check**: Ensure no `.env` file is accidentally staged. Run `git status`.
- [ ] **Build Check**: Run `npm run build` locally one last time.
- [ ] **Lint Check**: Run `npm run lint`.
- [ ] **History Scrub**: If this repo is new, proceed. If old, verify no secrets in `git log`.
- [ ] **Push**:
    ```bash
    git add .
    git commit -m "chore: prepare for public release"
    git push origin main
    ```
- [ ] **Repo Settings (GitHub)**:
    - [ ] Enable "Require Login" for Issues (Anti-Spam).
    - [ ] Add "compliance" tag.
    - [ ] Enable Dependabot.
