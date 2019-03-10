# Anforderungsdokumentation #

Jeder kommentar im Dokument ist mir eine Hilfe.
https://docs.google.com/document/d/1vvRm_NTy4QUYKYIB3qHDK87ALiySdbvNTvioZAqokQk/edit?usp=sharing


# Installation #

Vor dem ersten start oder bei Änderungen an package.json sollten die node_modules geupdatet werden.

```bash
npm install
```

Dank der Verwendung von Docker lässt sich das Projekt sehr einfach aufsetzten. Es reicht die Verwendung von docker-compose:

```bash
docker-compose up
```

Ab diesem Zeitpunkt ist der Server unter der Docker IP (docker-machine ip) mit dem Port 3000 erreichbar und einsatzbereit.

Wenn der Server heruntergefahren werden soll reicht die Eingabe von:

```bash
docker-compose down
```

Sollte sich etwas an den Quelldateien geändert haben, müssen die Docker Container neu gebaut werden. 

```bash
docker-compose up -d --force-recreate --build
```

Dies baut alle Container neu und bezieht auch neue bzw. geänderte Dateien mit ein.
Die Datenbank wird hierbei nicht gelöscht!

# WebStorm Run Configurations #

## Docker ##
Docker required, setup config.database

Compose Files: .\docker-compose.yml; 

Options: force build images

## Node (Local) ##
Local MongoDB required, setup config.local_database

JavaScript files: expressApp.js

Enviroment variables: NODE_ENV=local


## Mocha (Local) ##
Local MongoDB required, setup config.test_database

User interface: bdd

Choose 'Test file': /test/test.js

Enviroment variables: NODE_ENV=test
