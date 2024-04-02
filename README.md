This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Caveats

### webkit version mismatch on linux

use

```
export WEBKIT_DISABLE_DMABUF_RENDERER=1 && pnpm tauri dev
```

or add the variable as `.env`
