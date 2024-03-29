<img src="./public/logo.png" width="100" style="display: block; margin: 0 auto;" />

# @furina/app [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rainbow-dust/app/blob/main/LICENSE)  [![build status](https://github.com/rainbow-dust/app/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/rainbow-dust/app/actions/workflows/build.yml) ![release](https://img.shields.io/github/v/release/rainbow-dust/app?color=blueviolet&include_prereleases) ![issues](https://img.shields.io/github/issues/rainbow-dust/app.svg) ![pulls](https://img.shields.io/github/issues-pr/rainbow-dust/app.svg)

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
  - comment/collect/uncollect to note
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

screenshots:
<div style="display: flex; justify-content: space-between;">
  <img src="./screenshots/2024-2-20 183908.gif" width="45%" />
  <img src="./screenshots/2024-2-20%20141410.jpg" width="45%" />
</div>

<details>
  <summary>more screenshots:</summary>

  <div style="display: flex; justify-content: space-between;">
    <img src="./screenshots/2024-2-20%20141427.jpg" width="45%" />
    <img src="./screenshots/2024-2-20%20141416.jpg" width="45%" />
  </div>

  <div style="display: flex; justify-content: space-between;">
    <img src="./screenshots/2024-2-20%20141422.jpg" width="45%" />
    <img src="./screenshots/screenshot-20240303-232109.png" width="45%" />
  </div>
  <div style="display: flex; justify-content: space-between;">
    <img src="./screenshots/screenshot-20240219-144512.png" />
  </div>
    <div style="display: flex; justify-content: space-between;">
    <img src="./screenshots/screenshot-20240303-232002.png" />
  </div>

</details>



## deployment

pnpm i  
pnpm build  

nginx config:  
(mainly remind CORS and react history mode routing, gzip and cache is also recommended)

```conf
server {
    # gzip
    gzip on;
    gzip_buffers 32 4K;
    gzip_comp_level 6;
    gzip_min_length 100;
    gzip_types application/javascript text/css text/xml;
    gzip_disable "MSIE [1-6]\."; #配置禁用gzip条件，支持正则。此处表示ie6及以下不启用gzip（因为ie低版本不支持）
    gzip_vary on;
    
    listen       80;
    server_name yourdomain.com;
    
    location / {
        root   /github/app-static;
        index  index.html index.htm;
        try_files $uri /index.html;
        # js、css、字体、图片等资源启用强缓存
        if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
          add_header Cache-Control "public, max-age=25920000";#非html缓存1个月
          add_header Expires "30d";
        }
        # HTML 启用协商缓存
        if ($request_filename ~* ^.*[.](html|htm)$) {
          add_header Cache-Control "public, no-cache";
        }
    }

    # for backend api, CORS
    location /api {
      # rewrite /api/xxx to /api/v1/xxx
      rewrite ^/api/(.*)$ /api/v1/$1 break;
      proxy_pass http://127.0.0.1:9527;
    }
}
```

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
