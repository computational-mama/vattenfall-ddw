# Vattenfall Kiosk - Complete Setup Guide

## File Locations & Contents

### 1. Kiosk Launch Script
**Location:** `/home/vattenfall/kiosk.sh`

```bash
#!/bin/bash

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide cursor
xdotool mousemove 3000 3000 &

# Clean up crash dialogs
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/'Local State' 2>/dev/null
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences 2>/dev/null
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences 2>/dev/null

# Rotate touchscreen (includes 5 second sleep)
sleep 5
/usr/local/bin/rotate-touchscreen.sh

sleep 10
# Launch browser
chromium-browser \
  --app=http://localhost:8080 \
  --start-fullscreen \
  --touch-events=enabled \
  --incognito \
  --noerrdialogs \
  --no-first-run \
  --disable-infobars \
2>/dev/null &

# Wait 15 seconds for Chromium to fully load, then force fullscreen
sleep 15
for i in {1..5}; do
  xdotool key F11
  sleep 1
done
```

**Permissions:** `chmod +x ~/kiosk.sh`

**Timing breakdown:**
- Touchscreen rotation: 5 seconds
- Chromium startup wait: 15 seconds
- F11 fullscreen forcing: 5 seconds (5 presses × 1 second)
- **Total startup time: ~35 seconds**

---

### 2. Touchscreen Rotation Script
**Location:** `/usr/local/bin/rotate-touchscreen.sh`

```bash
#!/bin/bash
sleep 5

xinput set-prop "Silicon Integrated System Co. SiS HID Touch Controller" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1
```

**Rotation:** Portrait Left (270°) to match display orientation

**Permissions:** `chmod +x /usr/local/bin/rotate-touchscreen.sh`

---

### 3. Kiosk Autostart Desktop Entry
**Location:** `/home/vattenfall/.config/autostart/kiosk.desktop`

```ini
[Desktop Entry]
Type=Application
Name=Kiosk Mode
Exec=/home/vattenfall/kiosk.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
```

---

### 4. Caddy Web Server Configuration
**Location:** `/etc/caddy/Caddyfile`

```
:8080 {
    root * /var/www/kiosk
    file_server
    try_files {path} /index.html
}
```

**Why Caddy:**
- Simple 3-line configuration
- Automatic SPA routing with `try_files`
- Modern, efficient web server
- Perfect for serving static Vue apps
- Handles Vue Router client-side routing automatically

**Service Management:**
```bash
# Check status
sudo systemctl status caddy

# Start/stop/restart
sudo systemctl start caddy
sudo systemctl stop caddy
sudo systemctl restart caddy

# View logs
sudo journalctl -u caddy -f

# Enable auto-start on boot
sudo systemctl enable caddy
```

---

### 5. Vue App Directories

**Production Files (Served by Caddy):**
`/var/www/kiosk/`
Contains the deployed Vue application served by Caddy web server.

**Source Code:**
`/home/vattenfall/Documents/vattenfall-ddw/`
Contains Vue project source with `.env.local` file:

```bash
VITE_GOOEY_API_KEY=sk-2wFYfZLrbBp.....
```

---

### 6. Manual Update Script
**Location:** `/home/vattenfall/update-kiosk.sh`

```bash
#!/bin/bash

echo "=========================================="
echo "Kiosk Update Script"
echo "=========================================="
echo ""

# Stop kiosk
echo "Stopping kiosk..."
pkill chromium-browser

# Pull latest code
echo "Pulling latest code from git..."
cd /home/vattenfall/Documents/vattenfall-ddw
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    echo "Press any key to exit..."
    read
    exit 1
fi

echo "✓ Git pull successful"
echo ""

# Clean and rebuild
echo "Cleaning old build..."
rm -rf dist/ node_modules/.vite

echo "Building Vue app (this may take 1-2 minutes)..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    echo "Press any key to exit..."
    read
    exit 1
fi

echo "✓ Build successful"
echo ""

# Deploy to web server directory
echo "Deploying to /var/www/kiosk..."
sudo rm -rf /var/www/kiosk/*
sudo cp -r dist/* /var/www/kiosk/
sudo chown -R www-data:www-data /var/www/kiosk

echo "✓ Deployment complete"
echo ""

# Restart Caddy
echo "Restarting Caddy server..."
sudo systemctl restart caddy
sleep 2

echo ""
echo "=========================================="
echo "✓ Update completed successfully!"
echo "=========================================="
echo ""
echo "The kiosk will start automatically in ~25 seconds"
echo "Or press Ctrl+C and run: ./kiosk.sh"
echo ""
```

**Permissions:** `chmod +x ~/update-kiosk.sh`

**Usage:** Right-click and run, or execute `./update-kiosk.sh` from terminal

---

## System Configuration

### Auto-login
**Location:** `/etc/gdm3/custom.conf`

```ini
[daemon]
AutomaticLoginEnable=true
AutomaticLogin=vattenfall

WaylandEnable=false
```


### Pre-configured WiFi

**Network Name:** Vattenfall
**Password:** circular

The system will automatically connect to this network when in range.

**View saved WiFi connections:**
```bash
nmcli connection show
```

**Add additional WiFi network:**
```bash
sudo nmcli connection add \
  type wifi \
  con-name "NetworkName" \
  ifname wlan0 \
  ssid "SSID" \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "password"

sudo nmcli connection modify "NetworkName" connection.autoconnect yes
```

**Connect to a different network manually:**
```bash
sudo nmcli dev wifi connect "SSID" password "PASSWORD"
```

---

## Directory Structure

```
/home/vattenfall/
├── kiosk.sh                          # Main kiosk launch script
├── update-kiosk.sh                   # Manual update script
├── KIOSK-README.md                   # This file
├── Documents/
│   └── vattenfall-ddw/               # Vue source code
│       ├── .env.local                # API keys (VITE_GOOEY_API_KEY)
│       ├── package.json
│       ├── src/
│       └── dist/                     # Build output
└── .config/
    └── autostart/
        └── kiosk.desktop             # Auto-start configuration

/var/www/
└── kiosk/                            # Production Vue app (served by Caddy)
    ├── index.html
    └── assets/

/etc/caddy/
└── Caddyfile                         # Caddy web server configuration

/usr/local/bin/
└── rotate-touchscreen.sh             # Touchscreen rotation script
```

---

## Boot Sequence & Timing

1. **System boots**
2. **Auto-login** to `vattenfall` user (~10 seconds)
3. **Caddy web server** starts → serves Vue app on localhost:8080 (~2 seconds)
4. **kiosk.desktop** triggers → runs `kiosk.sh`
5. **Touchscreen rotation** → 5 second sleep → applies matrix
6. **Chromium launches** in fullscreen with touch enabled
7. **Wait 15 seconds** for Chromium to fully load
8. **F11 hammer** → presses F11 five times to ensure fullscreen (~5 seconds)
9. **Kiosk ready** → fully operational

**Total boot to ready: ~37 seconds**

---

## Common Commands

### Kiosk Control

```bash
# Stop kiosk
pkill chromium-browser

# Start kiosk manually
~/kiosk.sh

# Check if Vue app is accessible
curl http://localhost:8080
```

### Caddy Web Server Management

```bash
# Caddy status
sudo systemctl status caddy

# Restart Caddy
sudo systemctl restart caddy

# Stop Caddy
sudo systemctl stop caddy

# Start Caddy
sudo systemctl start caddy

# View Caddy logs
sudo journalctl -u caddy -f

# Validate Caddy configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy configuration without restart
sudo systemctl reload caddy
```

### Updates & Maintenance

```bash
# Manual update (pulls git, rebuilds, deploys)
~/update-kiosk.sh

# Or update manually step-by-step:
cd ~/Documents/vattenfall-ddw
git pull origin main
npm run build
sudo rm -rf /var/www/kiosk/*
sudo cp -r dist/* /var/www/kiosk/
sudo chown -R www-data:www-data /var/www/kiosk
sudo systemctl restart caddy
```

### System Management

```bash
# Reboot system
sudo reboot

# View daily reboot schedule
sudo crontab -l

# Edit reboot schedule
sudo crontab -e

# Check system resources
htop

# View system logs
journalctl -xe
```

---

## Venue Deployment

### Pre-configured Network
The system is pre-configured to connect to:
- **SSID:** Vattenfall
- **Password:** circular

**The kiosk will automatically connect when powered on at the venue.**


---

## Troubleshooting

### Kiosk doesn't start

```bash
# Check if Caddy is running
sudo systemctl status caddy

# If not running, start it
sudo systemctl start caddy

# Check if files exist in web directory
ls -la /var/www/kiosk

# Test if app is accessible
curl http://localhost:8080

# Check for errors in kiosk script
cat ~/.xsession-errors

# Run kiosk manually to see errors
~/kiosk.sh
```

### Caddy/Web server issues

```bash
# Check Caddy status
sudo systemctl status caddy

# View Caddy error logs
sudo journalctl -u caddy -xe

# Test Caddy configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Restart Caddy
sudo systemctl restart caddy

# Check file permissions in web directory
ls -la /var/www/kiosk

# If permission issues:
sudo chown -R www-data:www-data /var/www/kiosk
sudo chmod -R 755 /var/www/kiosk
```

### Vue Router / Page Navigation Issues

```bash
# If routes like /choose don't work, check Caddyfile has:
# try_files {path} /index.html

# View current Caddyfile
cat /etc/caddy/Caddyfile

# After any Caddyfile changes:
sudo systemctl restart caddy
```

### Touchscreen not responding

```bash
# Check if xinput matrix is applied
xinput list-props "Silicon Integrated System Co. SiS HID Touch Controller" | grep "Coordinate Transformation Matrix"

# Manually apply rotation
xinput set-prop "Silicon Integrated System Co. SiS HID Touch Controller" "Coordinate Transformation Matrix" 0 -1 1 1 0 0 0 0 1

# Or run rotation script
/usr/local/bin/rotate-touchscreen.sh

# Test touch by tapping corners of screen
```

### Not fullscreen / Browser chrome visible

```bash
# Manually press F11
# Or restart kiosk
pkill chromium-browser
~/kiosk.sh

# Check if F11 loop is running
ps aux | grep xdotool
```

### API calls failing (401/403 errors)

```bash
# Check if API key is in the build
cd /var/www/kiosk
grep -r "sk-2wFYfZ" assets/

# If not found, rebuild:
cd ~/Documents/vattenfall-ddw

# Ensure .env.local exists with key
cat .env.local

# Should show: VITE_GOOEY_API_KEY=sk-2wFYfZLrbBp7r...

# Rebuild and deploy
npm run build
sudo rm -rf /var/www/kiosk/*
sudo cp -r dist/* /var/www/kiosk/
sudo chown -R www-data:www-data /var/www/kiosk
sudo systemctl restart caddy
```

### Display rotation incorrect

```bash
# Check current display rotation
xrandr --query

# Should show: HDMI-2 connected primary 1080x1920+0+0 left

# If incorrect, use GNOME Display Settings to rotate
```

### WiFi not connecting

```bash
# List available networks
nmcli dev wifi list

# Check saved connections
nmcli connection show

# Try connecting manually
sudo nmcli dev wifi connect "Vattenfall" password "circular"

# Check WiFi status
nmcli device status

# If still not working, check hardware
ip link show

# Restart NetworkManager
sudo systemctl restart NetworkManager
```

### System performance issues

```bash
# Check system resources
htop

# View system logs
journalctl -xe

# Check for errors
sudo journalctl -p err -b

# Check memory usage
free -h

# Check disk space
df -h

# Reboot system
sudo reboot
```

### Chromium crashes or freezes

```bash
# Kill all Chromium processes
pkill -9 chromium-browser

# Clear Chromium cache
rm -rf ~/.config/chromium/Default/Cache
rm -rf ~/.config/chromium/Default/Code\ Cache

# Restart kiosk
~/kiosk.sh
```

---

## Features Summary

✅ **Auto-start on boot** - Kiosk launches automatically after ~37 seconds
✅ **Fullscreen kiosk mode** - No browser UI visible
✅ **Touchscreen enabled** - Portrait left orientation (270°)
✅ **Pre-configured WiFi** - Auto-connects to "Vattenfall" network
✅ **Daily 4 AM reboot** - Keeps system fresh
✅ **API key secured** - Baked into Vue build
✅ **Manual updates** - `update-kiosk.sh` for easy deployment
✅ **No crash dialogs** - Automatically cleaned on startup
✅ **Cursor hidden** - Clean kiosk experience
✅ **Reliable fullscreen** - Multiple F11 presses ensure full coverage
✅ **SPA routing** - Caddy handles Vue Router properly
✅ **Production-grade web server** - Caddy for reliable static file serving

---

## Technical Specifications

**Hardware:**
- NUC (Intel NUC14RVKB)
- Touchscreen display (Portrait orientation, 1080×1920)
- WiFi enabled

**Software:**
- Ubuntu 24.04 LTS
- Chromium browser (kiosk mode)
- Caddy web server v2
- Vue.js 3 application
- Node.js (for building)

**Display:**
- Resolution: 1080×1920 (portrait)
- Rotation: Left (270°)
- Output: HDMI-2

**Network:**
- Pre-configured: Vattenfall WiFi
- Auto-connect enabled

**Web Server:**
- Caddy v2
- Listening on: localhost:8080
- Document root: /var/www/kiosk
- SPA routing: Enabled

---

## Deployment Checklist

Before shipping to venue:

- [ ] Caddy web server running: `sudo systemctl status caddy`
- [ ] Files deployed to /var/www/kiosk: `ls -la /var/www/kiosk`
- [ ] Kiosk auto-start configured: `cat ~/.config/autostart/kiosk.desktop`
- [ ] Auto-login enabled: `grep AutomaticLogin /etc/gdm3/custom.conf`
- [ ] Daily reboot scheduled: `sudo crontab -l`
- [ ] Touchscreen working: Test touch in all corners
- [ ] API key in build: `grep -r "sk-2wFYfZ" /var/www/kiosk/assets/`
- [ ] Update script ready: `ls -la ~/update-kiosk.sh`
- [ ] WiFi configured: `nmcli connection show | grep Vattenfall`
- [ ] Fullscreen working: Reboot and verify no browser chrome visible
- [ ] Vue Router working: Test navigation between routes
- [ ] Test full boot: `sudo reboot` and time to ready

---

## Support & Maintenance

**For updates during deployment:**
1. Run `~/update-kiosk.sh` to pull latest code and rebuild
2. Or manually: `cd ~/Documents/vattenfall-ddw && git pull && npm run build && sudo cp -r dist/* /var/www/kiosk/ && sudo systemctl restart caddy`

**For issues:**
1. Check Caddy logs: `sudo journalctl -u caddy -f`
2. Check browser console: Open with DevTools enabled
3. Restart Caddy: `sudo systemctl restart caddy`
4. Reboot system: `sudo reboot`

---

## Emergency Procedures

### Complete System Reset

If kiosk is completely broken:

```bash
# 1. Stop everything
pkill chromium-browser
sudo systemctl stop caddy

# 2. Clear Chromium config
rm -rf ~/.config/chromium

# 3. Redeploy Vue app
cd ~/Documents/vattenfall-ddw
git pull origin main
npm run build
sudo rm -rf /var/www/kiosk/*
sudo cp -r dist/* /var/www/kiosk/
sudo chown -R www-data:www-data /var/www/kiosk

# 4. Restart services
sudo systemctl restart caddy

# 5. Test manually
curl http://localhost:8080
~/kiosk.sh
```

### Factory Reset Network Settings

```bash
# Remove all WiFi connections
nmcli connection show | grep wifi | awk '{print $1}' | xargs -I {} sudo nmcli connection delete {}

# Re-add venue WiFi
sudo nmcli connection add type wifi con-name "Vattenfall" ifname wlan0 ssid "Vattenfall" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "circular"
sudo nmcli connection modify "Vattenfall" connection.autoconnect yes
```

---

## 10-Day Deployment Ready ✅

This kiosk is configured for reliable 10-day operation with:
- Automatic startup and recovery
- Daily maintenance reboots
- Pre-configured networking
- Touch-enabled fullscreen interface
- Easy manual updates when needed
- Production-grade web server (Caddy)
- Proper SPA routing support

**Deployment Status: PRODUCTION READY 🚀**

---

## Quick Reference Card

**Stop Kiosk:** `pkill chromium-browser`
**Start Kiosk:** `~/kiosk.sh`
**Update App:** `~/update-kiosk.sh`
**Restart Web Server:** `sudo systemctl restart caddy`
**Check Web Server:** `sudo systemctl status caddy`
**Test App Access:** `curl http://localhost:8080`
**WiFi Setup:** `sudo nmcli dev wifi connect "SSID" password "PASSWORD"`
**Reboot System:** `sudo reboot`

---

*Last Updated: October 16, 2025*
*Configuration for: Vattenfall Digital Design Week Kiosk*
*Web Server: Caddy v2*
*Deployed Location: /var/www/kiosk*
