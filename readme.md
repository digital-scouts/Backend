## Installation ## 

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

Dies baut beide Container neu und bezieht auch neue bzw. geänderte Dateien mit ein.
Die Datenbank wird hierbei nicht gelöscht!
