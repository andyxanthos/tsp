# tsp

This script quickly scaffolds a TypeScript project. I was sick of running the same set of commands and making the same edits to config files every time I wanted to experiment with something, so I wrote this.

`tsp` is fairly opinionated. It scaffolds projects in a way that *I* would. It installs NPM packages that *I* typically use. That said, I think it uses common-sense defaults and that others may be able to save some time using it. Editing the source should be pretty straightforward -- this is not a groundbreaking automation script.

---

### To install:

1. Clone this repository

2. `cd tsp`

3. `npm link` (may require `sudo`)

You should now be able to run the `tsp` command anywhere.

---

### To create a project:

*Note: Projects are created in the parent directory of the `tsp` directory.*

```
// To create a project called 'example':
tsp example

// To create a web project called 'webExample':
tsp webExample web
```

The `web` argument automatically installs a variety of NPM packages that I often use when building web apps. Their type declarations are installed as dev dependencies.