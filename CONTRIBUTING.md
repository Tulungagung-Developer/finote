# Contributing to CONTRIBUTING.md

Thanks so much for taking the time to contribute! We really appreciate it. 🤗

We love seeing all types of contributions! Check out the [Table of Contents](#table-of-contents) to see all the
different ways you can help and get the lowdown on how this project handles them. Before you contribute, make sure you
read the relevant section. It'll make it a breeze for us maintainers and a great experience for everyone involved. We
can't wait to see what you contribute! 🎉

> If you like the project but don't have time to contribute, no problem! There are other easy ways to support it and
> show your appreciation, which we'd love to see:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Style Guides](#styleguides)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by the
[Code of Conduct](blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <ivanazis.id@gmail.com>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](/README.md).

We've made it easy for you to find the answers you're looking for! Before you ask a question, simply search for existing
[Issues](/issues) that might help you. If you've found a suitable issue and still need clarification, you can write your
question in this issue. And don't forget to search the internet for answers first!

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice
> By contributing to this project, you agree that you are 100% the author of the content, that you have the necessary
> rights to the content, and that the content you contribute can be made available under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

We're so excited to hear from you about any bugs you find! We just ask that you take a moment to investigate, collect
information, and describe the issue in detail in your report. This will help us fix any potential bugs as fast as
possible!

- You must use the latest version.
- Determine if your bug is a genuine issue or if it's something you've done wrong, such as using incompatible
  environments, components, or versions.
  > You must read the [Documentation](/README.md). If you need support, go to [this section](#i-have-a-question).
- Check if other users have reported the same issue. If so, check if it's already been solved. If not, create a bug
  report in the bug tracker. Also search the internet (including Stack Overflow) to see if users outside of the GitHub
  community have discussed the issue.
- Collect the following information about the bug:
    - Stack trace (Traceback)
    - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
    - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
    - Your input and the output
- Whether you can reliably reproduce the issue and whether you can reproduce it with older versions.

#### How Do I Submit a Good Bug Report?

> We kindly ask that you refrain from reporting any security-related issues, vulnerabilities, or bugs, including any
> sensitive information, to the issue tracker or elsewhere in public. Instead, we recommend that you send sensitive bugs
> via email to <ivanazis.id@gmail.com>.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Please create a new issue by clicking on the [Issue](/issues/new). As we are not yet certain whether this is a bug, we
  kindly request that you refrain from discussing it and from labeling the issue.
- Please describe the expected behavior and the actual behavior.
- Please provide as much context as possible and describe the steps that someone else can follow to recreate the issue
  on their own. This usually includes your code. For optimal bug reports, please isolate the problem and create a
  reduced test case.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no
  obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs
  with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as
  `help wanted`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Suggesting Enhancements

This section shows you how to submit an enhancement suggestion for CONTRIBUTING.md. You can suggest new features or
minor improvements to existing functionality. **Following these guidelines will help maintainers and the community**
understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

- Just a heads-up: Make sure you're using the latest version.
- Take a look at the documentation [README](/README.md) and see if the functionality is already covered, maybe by an
  individual configuration.
- Check if the enhancement has already been suggested by doing a search [Issues](/issues). If it's already been
  suggested, just add a comment to the existing issue instead of opening a new one.
- Make sure your idea fits with the project's scope and aims. It's up to you to make a strong case to convince the
  developers of the feature's merits. Keep in mind that we want features that will be useful to most of our users, not
  just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point
  you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part
  which the suggestion is related to.
- **Explain why this enhancement would be useful** to most CONTRIBUTING.md users. You may also want to point out the
  other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

This section is here to help you get ready and contribute to this project.

- This is a monorepo project. Before contributing, focus on one service, such as an API, web app, or others. Use [git
  sparse checkout](https://git-scm.com/docs/sparse-checkout) to minimize the amount of data copied to local and
  focus the files according to the service.
- Fork the repo and create a branch labeled according to the issue being worked on.
    - The "bug-number-of-issue" (ex: "bug-1") indicates that this branch will resolve the bug in issue number 1.
    - Specify the number of the issue you are enhancing with the "enhance-number-of-issue", e.g., "enhance-2".
    - Fix-number-of-issue (ex: fix-3), specifies that this branch is a fix for issue number 3, neither a bug nor an
      enhancement.
    - You can use a different naming convention, but the **branch name must be recognizable and organized** for the
      issues.
- Run code formatting, do testing, and try to build before committing.
- Before you do a "Push" and make a "Pull Request," you must ensure that your branch is synchronized with the project's
  default branch, "develop."
- When you push and create a pull request, your PR must match the [template](/.github/PULL_REQUEST_TEMPLATE.md). Explain
  in detail what changes you have made (if possible, explain the changes to each file).
- Be open to discussion. Every PR must stay within the corridor of the project roadmap.

### Improving The Documentation

This section to help you improve the project's documentation.

- The all documentation
  follows [GitHub community health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- We don't accept any PR that only change typo or change some wording.
- If you have idea to improve the documentation please elaborate as clear as possible what change is required.

## Style Guides

> We kindly ask that you will follow our styling guides when contributing to the project.

### Code Styling

- For the server side we use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). Please before
  submitting a PR, run `yarn --cwd server format` and `yarn --cwd server lint` or use IDE automation to run every
  saving.

### Commit Messages

Every commiting must have a commit message following
the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). For easy way use `yarn cz` to
running [commitizen](https://commitizen-tools.github.io/commitizen/)

## Last But Not Least

> We always appreciate your contributions, so please don't hesitate to contact us if you have any questions or
> suggestions.
