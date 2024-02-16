# @furina/app [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rainbow-dust/app/blob/main/LICENSE)  
<!-- [![build status](https://github.com/rainbow-dust/server/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/rainbow-dust/server/actions/workflows/build.yml) -->

## description

this repo is the front-end part of the furina, base on react, react-router, vite, swr... building for user interface.

related repos:

- [app](https://github.com/rainbow-dust/app)
- [server](https://github.com/rainbow-dust/server)
- [manage](https://github.com/rainbow-dust/manage)

## features
<!-- may be some screenshots here is better... -->

- content
  - note feed
  - note detail
  - user profile
  - user relations
  - collect
- interaction
  - like/unlike to note/comment
  - follow/unfollow to user
  - create/modify note
  - search base on tags
- visual
  - dark mode
  - responsive
  - animation
- others
  - user action track
  - pwa
...

## development

### start the project

```bash
pnpm install
pnpm dev
```

### project structure

```yaml
.
├── src
│   ├── pages             # pages, main part of the app
│   ├── components
│   ├── hooks
│   ├── services          # services, for fetching data
│   └── router
└── README.md
```
