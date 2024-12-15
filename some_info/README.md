# SETUP podman quadlet
[Unit]
Description=Backend container
After=network-online.target

[Container]
Image=ghcr.io/nikitkrsk/barakholka_bot/barakholka_bot:latest
ContainerName=baraholka
EnvironmentFile=/etc/baraholka
Volume=/var/lib/baraholka/subscriptions.json:/usr/src/app/subscriptions.json:z
LogDriver=journald
Pull=always
User=root

[Install]
# Start by default on boot
WantedBy=multi-user.target default.target

[Service]
Restart=always


# Manual update
after push:  
```bash ssh root@<host> systemctl restart baraholkabot```

logs: 
```bash journalctl -u baraholkabot```