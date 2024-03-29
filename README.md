# MAAP EDAV

Source code for the ESA Multi-Mission Algorithm and Analysis Platform (MAAP) Enhanced Data Visualization (EDAV) client

The application is avaiable here: https://liferay.val.esa-maap.org/web/guest/explore

## Building

This project requires a [Node version 16.13.1 or later](https://nodejs.org/en/download/) for build

First install the project dependencies by running

```bash
npm install
```

Then build by running

```bash
npm run build
```

The output will be available in the 'dist' directory ready to be served by a web server (e.g. Apache or NGINX)

To run a local development server run the command

```bash
npm run start
```

The client will be available at http://locahost:8449

## Docker image generation

Build the client sources by running

```bash
npm run build -- --env baseUrl='{{ getenv "BASE_URL"}}'
```

Then to generate the docker image run

```bash
docker build -t maap-ui .
```

To run the image then

```bash
 docker run -d -p 8449:80 maap-ui
```

The client will be available at http://locahost:8449

## License

MIT (See [LICENSE.md](LICENSE.md))
