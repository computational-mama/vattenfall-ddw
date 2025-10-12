# vattenfall-supply-chain

This template should help get you started developing with Vue 3 in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Install test for touchscreen

Run is from the folder directory

```script
#!/bin/bash
cd /path/to/your/app/dist
serve -p 8080 &
sleep 3
open -a "Google Chrome" --args --kiosk http://localhost:5678
```
