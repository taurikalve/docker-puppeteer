# Docker Puppeteer

Simple(ish) dockerized puppeteer browser(s). Browsers are created for connection and closed on disconnect. If there are more connections an `MAX_BROWSERS` allows to run concurrently, they'll be added to a waiting queue.

Example command:

`docker run -d -e MAX_BROWSERS=2 -p 5000:3000 --security-opt seccomp=/my/path/to/securityOpts.json --shm-size=2g docker-puppeteer`

## Env:

- `PORT` - default 3000
- `MAX_BROWSERS` - **required**
- `TZ` - example "Europe/Tallinn"

## Security opts

You need to add seccomp file for appropriate permissions, ie:
`--security-opt seccomp=/path/to/securityOpts.json`

The one provided at the project root is from:
`https://raw.githubusercontent.com/jfrazelle/dotfiles/master/etc/docker/seccomp/chrome.json`

(_Less safe_) Alternatively launch browser with `--no-sandbox` arg.

## Shm-size

Necessary to set `--shm-size` during run. Recommended to have at least 1GB (`1G`) to 2GB `2G`, depending on job intensity.

## User data

User datas will be stored at `/docker-puppeteer/userDatas`. A volume can be used for retention.

You can specify with a puppeteer.connect header `x-user-data`, which user data directory it will use, ie: `{ headers: { 'x-user-data': 'my-user-data' } }` - here the folder in `/docker-puppeteer/userDatas/my-user-data` will be used.

If not specified a browser lifetime one will be used.

## Versioning

Check puppeteer version match:

- https://pkgs.alpinelinux.org/
- https://pptr.dev/chromium-support
