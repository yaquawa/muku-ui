# Muku-UI
### "UI frameworks do too much"

**Muku-UI** is a set of Vue 3 components that completely decoupled from styling. Each UI component only provides the most essential functions and independent of each other.
How it looks and behaves completely up to you.

Most suitable for people who would like to build their own highly customized UI components rather than "mass-produced" ones.

The goal of this package is that keep it as simple as it could be.
On the other hand, provides powerful and uniformed APIs and reusable utils, so that it can handle various situations according to the user's needs. 

## Installation
```shell script
npm i muku-ui
```

## Usage
Here is an example to install the **modal** component.

```js
import { createApp } from 'vue'
import { installModal } from 'muku-ui'

// for those who only need styles for animation
import '@muku-ui/modal/assets/_animation.scss'

const app = createApp({
  template: `<modal name="foo">Hi</modal>`
}).use(installModal);
```

For the detailed usage of each component, please refer their respective `README.md` under `packages` directory.

## Styling
Each component comes with its minimum styles out of the box under `assets/*.scss` or bundled version in `dist/style.css`. 
Feel free to use it or just replace with yours.

## Contribution
Contribution is always welcome. Feel free to send PRs 🖐🏼
