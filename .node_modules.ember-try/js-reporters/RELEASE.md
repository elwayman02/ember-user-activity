# Release Process

1. Update `CHANGELOG.md` using `git changelog` from the [`git-extras`](https://github.com/tj/git-extras) package.
2. Commit changelog updates with message: `CHANGELOG: Update for x.x.x release`
3. Update `package.json` version and tag it using `npm version x.x.x -m "Release: vx.x.x"`
4. Push the two new commits to GitHub
5. Run `npm publish`
