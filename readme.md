## Installation ## 

Plattformunabhängig muss zuallererst sichergestellt werden, dass Docker auf dem System installiert ist. Dazu geben wir in der Konsole folgenden Befehl ein.

```bash
docker system info
```

Sollte dieser Befehl fehlschlagen, muss Docker zuerst installiert werden.  
Hierfür verweisen wir an dieser Stelle auf die ausführliche Dokumentation von Docker selbst.

> https://docs.docker.com/install/

Daraufhin sollte die öffentliche IP Adresse des Systems herausgefunden werden.

```bash
ipconfig (Windows) bzw. ifconfig(Linux) 
```

Im Anschluss muss das Git-Repository auf das System geklont werden.
Sollte auf dem Server eine Linux Distribution laufen ist dies ganz einfach.
Im Zielverzeichnis wird für das klonen des Repositorys lediglich folgender Befehl benötigt.

```bash
git clone https://github.com/riskysciolism/Social30
```

Dank der Verwendung von Docker Compose sind wir zu diesem Zeitpunkt beinahe fertig.
Als letztes müssen die Docker Container nämlich lediglich hochgefahren werden.

```bash
docker-compose up
```

Ab diesem Zeitpunkt ist der Server unter der zuvor heraus gefundenen IP mit dem Port 3000 erreichbar und einsatzbereit.

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