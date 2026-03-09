# appflyte-frontend
node v v22.11.0
 
### Trivy issue ####
OS (not fixable right now):
libc-bin/libc6 — CVE-2026-0861: affected, no fix in Debian yet
zlib1g — CVE-2023-45853: will_not_fix, Debian explicitly won't patch this

Debian OS packages (90 total): LOW + MEDIUM only
Most of these are well-known, long-standing Debian issues (glibc CVEs from 2010–2019, systemd, util-linux etc.) that Debian has intentionally not backported fixes for. Several are marked will_not_fix, meaning upstream won't patch them. There's nothing actionable.