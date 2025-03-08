import { Equipment, Site, IPRange, NetworkConnection, DashboardStats, EquipmentStatus, EquipmentType, NetworkConnectionType, NetworkConnectionStatus } from "../types/types";

export const mockEquipment: Equipment[] = [
  {
    id: "e1",
    name: "Server-01",
    siteId: "s1",
    type: "server",
    model: "Dell PowerEdge R740",
    manufacturer: "Dell",
    ipAddress: "192.168.1.10",
    macAddress: "00:1A:2B:3C:4D:5E",
    firmware: "iDRAC 9",
    installDate: "2023-01-15",
    status: "active",
    netbios: "SERVER01",
    configMarkdown: `# Configuration du serveur Server-01
    
    - **Système d'exploitation:** Ubuntu Server 20.04 LTS
    - **Processeur:** 2 x Intel Xeon Gold 6130
    - **Mémoire:** 128 GB DDR4 ECC
    - **Stockage:**
        - 2 x 480GB SSD (RAID 1 pour l'OS)
        - 4 x 4TB HDD (RAID 5 pour les données)
    - **Réseau:**
        - 2 x 10GbE
    
    ## Services installés
    
    - Serveur Web Apache
    - Base de données MySQL
    - Serveur de fichiers Samba
    - Serveur de messagerie Postfix
    
    ## Notes
    
    Ce serveur héberge les applications critiques de l'entreprise. La surveillance continue est essentielle.
    `
  },
  {
    id: "e2",
    name: "Workstation-05",
    siteId: "s2",
    type: "workstation",
    model: "HP EliteDesk 800 G5",
    manufacturer: "HP",
    ipAddress: "192.168.2.25",
    macAddress: "00:A1:B2:C3:D4:E5",
    firmware: "HP BIOS",
    installDate: "2023-02-20",
    status: "active",
    netbios: "WS05",
    configMarkdown: `# Configuration de la workstation Workstation-05
    
    - **Système d'exploitation:** Windows 10 Pro
    - **Processeur:** Intel Core i7-9700
    - **Mémoire:** 32 GB DDR4
    - **Stockage:**
        - 512GB NVMe SSD
        - 1TB HDD
    - **Réseau:**
        - 1 x 1GbE
    
    ## Logiciels installés
    
    - Microsoft Office Suite
    - Adobe Creative Cloud
    - Outils de développement (Visual Studio Code, etc.)
    
    ## Notes
    
    Cette workstation est utilisée par l'équipe de développement. Assurez-vous que tous les outils sont à jour.
    `
  },
  {
    id: "e3",
    name: "Printer-01",
    siteId: "s3",
    type: "printer",
    model: "Brother MFC-L3750CDW",
    manufacturer: "Brother",
    ipAddress: "192.168.3.15",
    macAddress: "00:F1:E2:D3:C4:B5",
    firmware: "Brother Firmware",
    installDate: "2023-03-10",
    status: "active",
    netbios: "PRINTER01",
    configMarkdown: `# Configuration de l'imprimante Printer-01
    
    - **Type:** Imprimante multifonction couleur
    - **Connectivité:** Réseau Ethernet, Wi-Fi
    - **Fonctionnalités:** Impression, copie, numérisation, fax
    - **Pilotes:** Installés sur tous les postes de travail
    
    ## Notes
    
    L'imprimante est partagée par plusieurs utilisateurs. Surveillez les niveaux de toner et effectuez la maintenance régulière.
    `
  },
  {
    id: "e4",
    name: "Switch-Core",
    siteId: "s1",
    type: "switch",
    model: "Cisco Catalyst 9300",
    manufacturer: "Cisco",
    ipAddress: "192.168.1.1",
    macAddress: "00:2A:3B:4C:5D:6F",
    firmware: "IOS XE 17.3.2",
    installDate: "2023-04-01",
    status: "active",
    netbios: "SWITCHCORE",
    configMarkdown: `# Configuration du switch Switch-Core
    
    - **Type:** Switch de cœur de réseau
    - **Ports:** 48 x 1GbE, 4 x 10GbE
    - **VLANs:** Configurés pour segmenter le réseau
    - **Protocoles:** STP, RSTP, MSTP
    
    ## Notes
    
    Ce switch est essentiel pour le fonctionnement du réseau. La surveillance et la maintenance sont critiques.
    `
  },
  {
    id: "e5",
    name: "Router-Edge",
    siteId: "s2",
    type: "router",
    model: "Juniper MX104",
    manufacturer: "Juniper",
    ipAddress: "192.168.2.1",
    macAddress: "00:3A:4B:5C:6D:7E",
    firmware: "Junos OS 20.4R3",
    installDate: "2023-05-01",
    status: "active",
    netbios: "ROUTEREDGE",
    configMarkdown: `# Configuration du routeur Router-Edge
    
    - **Type:** Routeur de périphérie
    - **Interfaces:** 4 x 10GbE, 8 x 1GbE
    - **Protocoles:** BGP, OSPF, MPLS
    - **Politiques:** Configurées pour le routage et la sécurité
    
    ## Notes
    
    Ce routeur connecte le réseau local à Internet. La surveillance et la sécurité sont essentielles.
    `
  },
  {
    id: "e6",
    name: "WiFi-AP-01",
    siteId: "s3",
    type: "wifi",
    model: "Ubiquiti UniFi AP AC Pro",
    manufacturer: "Ubiquiti",
    ipAddress: "192.168.3.10",
    macAddress: "00:4A:5B:6C:7D:8F",
    firmware: "UniFi Firmware 5.43.56",
    installDate: "2023-06-01",
    status: "active",
    netbios: "WIFIAP01",
    configMarkdown: `# Configuration du point d'accès WiFi WiFi-AP-01
    
    - **Type:** Point d'accès WiFi
    - **Normes:** 802.11ac
    - **Bandes:** 2.4 GHz, 5 GHz
    - **Sécurité:** WPA2-Enterprise
    
    ## Notes
    
    Ce point d'accès fournit une connectivité WiFi aux utilisateurs. La surveillance et la sécurité sont importantes.
    `
  },
  {
    id: "e7",
    name: "Hub-01",
    siteId: "s4",
    type: "hub",
    model: "Netgear GS108",
    manufacturer: "Netgear",
    ipAddress: "192.168.4.10",
    macAddress: "00:5A:6B:7C:8D:9E",
    firmware: "N/A",
    installDate: "2023-07-01",
    status: "inactive",
    netbios: "HUB01",
    configMarkdown: `# Configuration du hub Hub-01
    
    - **Type:** Hub réseau
    - **Ports:** 8 x 1GbE
    - **Fonctionnement:** Simple répétiteur de signal
    
    ## Notes
    
    Ce hub est utilisé pour connecter des appareils dans une petite zone. Il est recommandé de le remplacer par un switch pour de meilleures performances.
    `
  },
  {
    id: "e8",
    name: "Other-Device",
    siteId: "s5",
    type: "other",
    model: "Custom Device",
    manufacturer: "Unknown",
    ipAddress: "192.168.5.10",
    macAddress: "00:6A:7B:8C:9D:AF",
    firmware: "N/A",
    installDate: "2023-08-01",
    status: "unknown",
    netbios: "OTHERDEVICE",
    configMarkdown: `# Configuration de l'appareil inconnu Other-Device
    
    - **Type:** Appareil non identifié
    - **Informations:** Inconnues
    
    ## Notes
    
    Cet appareil nécessite une investigation pour déterminer son rôle et sa configuration.
    `
  },
  {
    id: "e9",
    name: "Server-02",
    siteId: "s2",
    type: "server",
    model: "HP ProLiant DL380 Gen10",
    manufacturer: "HP",
    ipAddress: "192.168.2.10",
    macAddress: "00:7A:8B:9C:AD:BE",
    firmware: "iLO 5",
    installDate: "2023-09-01",
    status: "maintenance",
    netbios: "SERVER02",
    configMarkdown: `# Configuration du serveur Server-02
    
    - **Système d'exploitation:** Windows Server 2019
    - **Processeur:** 2 x Intel Xeon Silver 4210
    - **Mémoire:** 64 GB DDR4 ECC
    - **Stockage:**
        - 2 x 240GB SSD (RAID 1 pour l'OS)
        - 4 x 2TB HDD (RAID 5 pour les données)
    - **Réseau:**
        - 2 x 1GbE
    
    ## Services installés
    
    - Active Directory
    - Serveur DNS
    - Serveur DHCP
    
    ## Notes
    
    Ce serveur est en maintenance pour une mise à niveau du système d'exploitation.
    `
  },
  {
    id: "e10",
    name: "Workstation-01",
    siteId: "s1",
    type: "workstation",
    model: "Dell OptiPlex 7080",
    manufacturer: "Dell",
    ipAddress: "192.168.1.20",
    macAddress: "00:8A:9B:AC:BD:CE",
    firmware: "Dell BIOS",
    installDate: "2023-10-01",
    status: "failure",
    netbios: "WS01",
    configMarkdown: `# Configuration de la workstation Workstation-01
    
    - **Système d'exploitation:** Windows 10 Pro
    - **Processeur:** Intel Core i5-10500
    - **Mémoire:** 16 GB DDR4
    - **Stockage:**
        - 256GB NVMe SSD
        - 1TB HDD
    - **Réseau:**
        - 1 x 1GbE
    
    ## Logiciels installés
    
    - Microsoft Office Suite
    - Logiciels spécifiques à l'entreprise
    
    ## Notes
    
    Cette workstation a rencontré une panne matérielle et nécessite une réparation.
    `
  },
  {
    id: "e11",
    name: "Printer-02",
    siteId: "s2",
    type: "printer",
    model: "HP LaserJet Pro M404dn",
    manufacturer: "HP",
    ipAddress: "192.168.2.15",
    macAddress: "00:9A:AB:BC:CD:DE",
    firmware: "HP Firmware",
    installDate: "2023-11-01",
    status: "active",
    netbios: "PRINTER02",
    configMarkdown: `# Configuration de l'imprimante Printer-02
    
    - **Type:** Imprimante laser monochrome
    - **Connectivité:** Réseau Ethernet
    - **Fonctionnalités:** Impression
    - **Pilotes:** Installés sur les postes de travail concernés
    
    ## Notes
    
    Cette imprimante est utilisée pour l'impression de documents en noir et blanc.
    `
  },
  {
    id: "e12",
    name: "Switch-Access-01",
    siteId: "s3",
    type: "switch",
    model: "Cisco Catalyst 2960-X",
    manufacturer: "Cisco",
    ipAddress: "192.168.3.1",
    macAddress: "00:AA:BB:CC:DD:EE",
    firmware: "IOS 15.2",
    installDate: "2023-12-01",
    status: "active",
    netbios: "SWITCHACCESS01",
    configMarkdown: `# Configuration du switch Switch-Access-01
    
    - **Type:** Switch d'accès
    - **Ports:** 24 x 1GbE
    - **VLANs:** Configurés pour les différents services
    - **Sécurité:** Port security activé
    
    ## Notes
    
    Ce switch fournit une connectivité réseau aux utilisateurs finaux.
    `
  },
  {
    id: "e13",
    name: "Router-Branch",
    siteId: "s4",
    type: "router",
    model: "Cisco ISR 4331",
    manufacturer: "Cisco",
    ipAddress: "192.168.4.1",
    macAddress: "00:BB:CC:DD:EE:FF",
    firmware: "IOS XE 16.9.4",
    installDate: "2024-01-01",
    status: "active",
    netbios: "ROUTERBRANCH",
    configMarkdown: `# Configuration du routeur Router-Branch
    
    - **Type:** Routeur de branche
    - **Interfaces:** 3 x 1GbE
    - **Protocoles:** BGP, OSPF
    - **VPN:** Site-to-site VPN configuré
    
    ## Notes
    
    Ce routeur connecte la branche au siège social via un VPN.
    `
  },
  {
    id: "e14",
    name: "WiFi-AP-02",
    siteId: "s4",
    type: "wifi",
    model: "Ubiquiti UniFi AP AC LR",
    manufacturer: "Ubiquiti",
    ipAddress: "192.168.4.10",
    macAddress: "00:CC:DD:EE:FF:00",
    firmware: "UniFi Firmware 5.43.56",
    installDate: "2024-02-01",
    status: "active",
    netbios: "WIFIAP02",
    configMarkdown: `# Configuration du point d'accès WiFi WiFi-AP-02
    
    - **Type:** Point d'accès WiFi
    - **Normes:** 802.11ac
    - **Bandes:** 2.4 GHz, 5 GHz
    - **Sécurité:** WPA2-Personal
    
    ## Notes
    
    Ce point d'accès fournit une connectivité WiFi aux utilisateurs de la branche.
    `
  },
  {
    id: "e15",
    name: "Hub-02",
    siteId: "s5",
    type: "hub",
    model: "TP-Link TL-SG1008D",
    manufacturer: "TP-Link",
    ipAddress: "192.168.5.10",
    macAddress: "00:DD:EE:FF:00:11",
    firmware: "N/A",
    installDate: "2024-03-01",
    status: "inactive",
    netbios: "HUB02",
    configMarkdown: `# Configuration du hub Hub-02
    
    - **Type:** Hub réseau
    - **Ports:** 8 x 1GbE
    - **Fonctionnement:** Simple répétiteur de signal
    
    ## Notes
    
    Ce hub est utilisé pour connecter des appareils dans une petite zone. Il est recommandé de le remplacer par un switch pour de meilleures performances.
    `
  },
  {
    id: "e16",
    name: "Other-Device-02",
    siteId: "s1",
    type: "other",
    model: "Raspberry Pi 4",
    manufacturer: "Raspberry Pi Foundation",
    ipAddress: "192.168.1.30",
    macAddress: "00:EE:FF:00:11:22",
    firmware: "Raspberry Pi OS",
    installDate: "2024-04-01",
    status: "active",
    netbios: "RASPBERRYPI",
    configMarkdown: `# Configuration de l'appareil Raspberry Pi 4
    
    - **Type:** Ordinateur monocarte
    - **Processeur:** Broadcom BCM2711
    - **Mémoire:** 4 GB
    - **Stockage:** 32GB SD Card
    - **Réseau:** Ethernet, WiFi
    
    ## Notes
    
    Ce Raspberry Pi est utilisé pour des tests de développement.
    `
  },
  {
    id: "e17",
    name: "Server-03",
    siteId: "s3",
    type: "server",
    model: "Dell PowerEdge R750",
    manufacturer: "Dell",
    ipAddress: "192.168.3.10",
    macAddress: "00:FF:00:11:22:33",
    firmware: "iDRAC 9",
    installDate: "2024-05-01",
    status: "active",
    netbios: "SERVER03",
    configMarkdown: `# Configuration du serveur Server-03
    
    - **Système d'exploitation:** Ubuntu Server 22.04 LTS
    - **Processeur:** 2 x Intel Xeon Gold 6330
    - **Mémoire:** 128 GB DDR4 ECC
    - **Stockage:**
        - 2 x 480GB SSD (RAID 1 pour l'OS)
        - 4 x 4TB HDD (RAID 5 pour les données)
    - **Réseau:**
        - 2 x 10GbE
    
    ## Services installés
    
    - Serveur Web Nginx
    - Base de données PostgreSQL
    - Serveur de cache Redis
    
    ## Notes
    
    Ce serveur héberge les nouvelles applications de l'entreprise.
    `
  },
  {
    id: "e18",
    name: "Workstation-02",
    siteId: "s3",
    type: "workstation",
    model: "HP EliteDesk 800 G6",
    manufacturer: "HP",
    ipAddress: "192.168.3.20",
    macAddress: "00:11:22:33:44:55",
    firmware: "HP BIOS",
    installDate: "2024-06-01",
    status: "active",
    netbios: "WS02",
    configMarkdown: `# Configuration de la workstation Workstation-02
    
    - **Système d'exploitation:** Windows 11 Pro
    - **Processeur:** Intel Core i7-10700
    - **Mémoire:** 32 GB DDR4
    - **Stockage:**
        - 512GB NVMe SSD
        - 2TB HDD
    - **Réseau:**
        - 1 x 1GbE
    
    ## Logiciels installés
    
    - Microsoft Office Suite
    - Adobe Creative Cloud
    - Outils de développement (IntelliJ IDEA, etc.)
    
    ## Notes
    
    Cette workstation est utilisée par l'équipe de conception graphique.
    `
  },
  {
    id: "e19",
    name: "Printer-03",
    siteId: "s4",
    type: "printer",
    model: "Epson EcoTank ET-4760",
    manufacturer: "Epson",
    ipAddress: "192.168.4.15",
    macAddress: "00:22:33:44:55:66",
    firmware: "Epson Firmware",
    installDate: "2024-07-01",
    status: "active",
    netbios: "PRINTER03",
    configMarkdown: `# Configuration de l'imprimante Printer-03
    
    - **Type:** Imprimante multifonction couleur à réservoirs d'encre
    - **Connectivité:** Réseau Ethernet, Wi-Fi
    - **Fonctionnalités:** Impression, copie, numérisation, fax
    - **Pilotes:** Installés sur tous les postes de travail
    
    ## Notes
    
    Cette imprimante est économique en termes de coût d'encre.
    `
  },
  {
    id: "e20",
    name: "Switch-Access-02",
    siteId: "s5",
    type: "switch",
    model: "Netgear GS308E",
    manufacturer: "Netgear",
    ipAddress: "192.168.5.1",
    macAddress: "00:33:44:55:66:77",
    firmware: "Netgear Firmware",
    installDate: "2024-08-01",
    status: "active",
    netbios: "SWITCHACCESS02",
    configMarkdown: `# Configuration du switch Switch-Access-02
    
    - **Type:** Switch d'accès
    - **Ports:** 8 x 1GbE
    - **VLANs:** Non configurés
    - **Sécurité:** Aucune
    
    ## Notes
    
    Ce switch fournit une connectivité réseau de base.
    `
  },
  {
    id: "e21",
    name: "Router-Backup",
    siteId: "s5",
    type: "router",
    model: "Ubiquiti EdgeRouter X",
    manufacturer: "Ubiquiti",
    ipAddress: "192.168.5.2",
    macAddress: "00:44:55:66:77:88",
    firmware: "EdgeOS",
    installDate: "2024-09-01",
    status: "active",
    netbios: "ROUTERBACKUP",
    configMarkdown: `# Configuration du routeur Router-Backup
    
    - **Type:** Routeur de secours
    - **Interfaces:** 5 x 1GbE
    - **Protocoles:** OSPF
    - **VPN:** Site-to-site VPN configuré
    
    ## Notes
    
    Ce routeur est utilisé comme solution de secours en cas de panne du routeur principal.
    `
  },
  {
    id: "e22",
    name: "WiFi-AP-03",
    siteId: "s1",
    type: "wifi",
    model: "TP-Link EAP225",
    manufacturer: "TP-Link",
    ipAddress: "192.168.1.15",
    macAddress: "00:55:66:77:88:99",
    firmware: "TP-Link Firmware",
    installDate: "2024-10-01",
    status: "active",
    netbios: "WIFIAP03",
    configMarkdown: `# Configuration du point d'accès WiFi WiFi-AP-03
    
    - **Type:** Point d'accès WiFi
    - **Normes:** 802.11ac
    - **Bandes:** 2.4 GHz, 5 GHz
    - **Sécurité:** WPA3-Personal
    
    ## Notes
    
    Ce point d'accès fournit une connectivité WiFi sécurisée.
    `
  },
  {
    id: "e23",
    name: "Hub-03",
    siteId: "s2",
    type: "hub",
    model: "D-Link DGS-1008A",
    manufacturer: "D-Link",
    ipAddress: "192.168.2.10",
    macAddress: "00:66:77:88:99:AA",
    firmware: "N/A",
    installDate: "2024-11-01",
    status: "inactive",
    netbios: "HUB03",
    configMarkdown: `# Configuration du hub Hub-03
    
    - **Type:** Hub réseau
    - **Ports:** 8 x 1GbE
    - **Fonctionnement:** Simple répétiteur de signal
    
    ## Notes
    
    Ce hub est utilisé pour connecter des appareils dans une petite zone. Il est recommandé de le remplacer par un switch pour de meilleures performances.
    `
  },
  {
    id: "e24",
    name: "Other-Device-03",
    siteId: "s2",
    type: "other",
    model: "Arduino Uno",
    manufacturer: "Arduino",
    ipAddress: "192.168.2.30",
    macAddress: "00:77:88:99:AA:BB",
    firmware: "Arduino IDE",
    installDate: "2024-12-01",
    status: "active",
    netbios: "ARDUINO",
    configMarkdown: `# Configuration de l'appareil Arduino Uno
    
    - **Type:** Microcontrôleur
    - **Processeur:** ATmega328P
    - **Mémoire:** 32 KB Flash
    - **Réseau:** Non applicable
    
    ## Notes
    
    Cet Arduino est utilisé pour des projets d'automatisation.
    `
  },
  {
    id: "e25",
    name: "Server-04",
    siteId: "s4",
    type: "server",
    model: "Supermicro SuperServer",
    manufacturer: "Supermicro",
    ipAddress: "192.168.4.10",
    macAddress: "00:88:99:AA:BB:CC",
    firmware: "IPMI",
    installDate: "2025-01-01",
    status: "active",
    netbios: "SERVER04",
    configMarkdown: `# Configuration du serveur Server-04
    
    - **Système d'exploitation:** CentOS 7
    - **Processeur:** 2 x Intel Xeon E5-2680 v4
    - **Mémoire:** 64 GB DDR4 ECC
    - **Stockage:**
        - 2 x 240GB SSD (RAID 1 pour l'OS)
        - 4 x 2TB HDD (RAID 5 pour les données)
    - **Réseau:**
        - 2 x 1GbE
    
    ## Services installés
    
    - Serveur de fichiers NFS
    - Serveur d'impression CUPS
    
    ## Notes
    
    Ce serveur fournit des services de fichiers et d'impression.
    `
  },
  {
    id: "e26",
    name: "Workstation-03",
    siteId: "s4",
    type: "workstation",
    model: "Lenovo ThinkStation P340",
    manufacturer: "Lenovo",
    ipAddress: "192.168.4.20",
    macAddress: "00:99:AA:BB:CC:DD",
    firmware: "Lenovo BIOS",
    installDate: "2025-02-01",
    status: "active",
    netbios: "WS03",
    configMarkdown: `# Configuration de la workstation Workstation-03
    
    - **Système d'exploitation:** Windows 10 Pro
    - **Processeur:** Intel Core i7-10700K
    - **Mémoire:** 32 GB DDR4
    - **Stockage:**
        - 512GB NVMe SSD
        - 1TB HDD
    - **Réseau:**
        - 1 x 1GbE
    
    ## Logiciels installés
    
    - Microsoft Office Suite
    - Logiciels de CAO
    
    ## Notes
    
    Cette workstation est utilisée pour la conception assistée par ordinateur.
    `
  },
  {
    id: "e27",
    name: "Printer-04",
    siteId: "s5",
    type: "printer",
    model: "Canon imageCLASS MF445dw",
    manufacturer: "Canon",
    ipAddress: "192.168.5.15",
    macAddress: "00:AA:BB:CC:DD:EE",
    firmware: "Canon Firmware",
    installDate: "2025-03-01",
    status: "active",
    netbios: "PRINTER04",
    configMarkdown: `# Configuration de l'imprimante Printer-04
    
    - **Type:** Imprimante multifonction laser monochrome
    - **Connectivité:** Réseau Ethernet, Wi-Fi
    - **Fonctionnalités:** Impression, copie, numérisation
    - **Pilotes:** Installés sur les postes de travail concernés
    
    ## Notes
    
    Cette imprimante est utilisée pour l'impression de documents en noir et blanc.
    `
  },
  {
    id: "e28",
    name: "Switch-Core-02",
    siteId: "s5",
    type: "switch",
    model: "Juniper EX2300",
    manufacturer: "Juniper",
    ipAddress: "192.168.5.1",
    macAddress: "00:BB:CC:DD:EE:FF",
    firmware: "Junos OS",
    installDate: "2025-04-01",
    status: "active",
    netbios: "SWITCHCORE02",
    configMarkdown: `# Configuration du switch Switch-Core-02
    
    - **Type:** Switch de cœur de réseau
    - **Ports:** 24 x 1GbE, 4 x 10GbE
    - **VLANs:** Configurés pour segmenter le réseau
    - **Protocoles:** STP, RSTP, MSTP
    
    ## Notes
    
    Ce switch est essentiel pour le fonctionnement du réseau. La surveillance et la maintenance sont critiques.
    `
  },
  {
    id: "e29",
    name: "Router-Edge-02",
    siteId: "s1",
    type: "router",
    model: "Fortinet FortiGate 60E",
    manufacturer: "Fortinet",
    ipAddress: "192.168.1.1",
    macAddress: "00:CC:DD:EE:FF:00",
    firmware: "FortiOS",
    installDate: "2025-05-01",
    status: "active",
    netbios: "ROUTEREDGE02",
    configMarkdown: `# Configuration du routeur Router-Edge-02
    
    - **Type:** Routeur de périphérie
    - **Interfaces:** 5 x 1GbE
    - **Protocoles:** BGP, OSPF, MPLS
    - **Politiques:** Configurées pour le routage et la sécurité
    
    ## Notes
    
    Ce routeur connecte le réseau local à Internet. La surveillance et la sécurité sont essentielles.
    `
  },
  {
    id: "e30",
    name: "WiFi-AP-04",
    siteId: "s2",
    type: "wifi",
    model: "Aruba Instant On AP11",
    manufacturer: "Aruba",
    ipAddress: "192.168.2.15",
    macAddress: "00:DD:EE:FF:00:11",
    firmware: "Aruba Instant On",
    installDate: "2025-06-01",
    status: "active",
    netbios: "WIFIAP04",
    configMarkdown: `# Configuration du point d'accès WiFi WiFi-AP-04
    
    - **Type:** Point d'accès WiFi
    - **Normes:** 802.11ac
    - **Bandes:** 2.4 GHz, 5 GHz
    - **Sécurité:** WPA2-Personal
    
    ## Notes
    
    Ce point d'accès fournit une connectivité WiFi aux utilisateurs. La surveillance et la sécurité sont importantes.
    `
  },
  {
    id: "e31",
    name: "Hub-04",
    siteId: "s3",
    type: "hub",
    model: "TRENDnet TEG-S
