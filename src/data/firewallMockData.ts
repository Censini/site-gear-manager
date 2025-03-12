
// Types pour les règles de pare-feu
export type FirewallRule = {
  id: number;
  name: string;
  source: string;
  destination: string;
  service: string;
  action: "allow" | "deny";
  enabled: boolean;
};

// Types pour l'analyse de redondance
export type RedundantRule = {
  id: number;
  type: "Redondance" | "Conflit";
  rule1: string;
  rule2: string;
  description: string;
  impact: "Élevé" | "Moyen" | "Faible";
};

// Données fictives pour les règles de pare-feu
export const mockFirewallRules: FirewallRule[] = [
  {
    id: 1,
    name: "Accès Web Internet",
    source: "Interne",
    destination: "Externe",
    service: "HTTP, HTTPS",
    action: "allow",
    enabled: true
  },
  {
    id: 2,
    name: "Accès SSH Serveurs",
    source: "Admin",
    destination: "Serveurs",
    service: "SSH",
    action: "allow",
    enabled: true
  },
  {
    id: 3,
    name: "Blocage P2P",
    source: "Interne",
    destination: "Externe",
    service: "BitTorrent, P2P",
    action: "deny",
    enabled: true
  },
  {
    id: 4,
    name: "Accès DNS",
    source: "Interne",
    destination: "Externe",
    service: "DNS",
    action: "allow",
    enabled: true
  },
  {
    id: 5,
    name: "Serveurs DMZ vers BDD",
    source: "DMZ",
    destination: "Database",
    service: "MySQL, PostgreSQL",
    action: "allow",
    enabled: true
  },
  {
    id: 6,
    name: "Accès SMTP",
    source: "Interne",
    destination: "Mail Servers",
    service: "SMTP",
    action: "allow",
    enabled: true
  },
  {
    id: 7,
    name: "Blocage Streaming",
    source: "Guests",
    destination: "Externe",
    service: "Streaming Media",
    action: "deny",
    enabled: false
  },
  {
    id: 8,
    name: "Accès Admin Équipements",
    source: "IT",
    destination: "Réseau",
    service: "HTTPS, SSH, Telnet",
    action: "allow",
    enabled: true
  },
  {
    id: 9,
    name: "Accès VPN",
    source: "Externe",
    destination: "VPN Gateway",
    service: "IPSEC, SSL VPN",
    action: "allow",
    enabled: true
  },
  {
    id: 10,
    name: "Accès DMZ Public",
    source: "Externe",
    destination: "DMZ",
    service: "HTTP, HTTPS",
    action: "allow",
    enabled: true
  },
  {
    id: 11,
    name: "Blocage Malware",
    source: "Any",
    destination: "Any",
    service: "Any",
    action: "deny",
    enabled: true
  },
  {
    id: 12,
    name: "Accès RDP Limité",
    source: "Admin",
    destination: "Serveurs Windows",
    service: "RDP",
    action: "allow",
    enabled: true
  }
];

// Données fictives pour l'analyse de redondance
export const mockRedundantRules: RedundantRule[] = [
  {
    id: 1,
    type: "Redondance",
    rule1: "Rule 23",
    rule2: "Rule 45",
    description: "Règles avec sources/destinations identiques mais services différents",
    impact: "Moyen"
  },
  {
    id: 2,
    type: "Conflit",
    rule1: "Rule 12",
    rule2: "Rule 89",
    description: "La règle 89 bloque le trafic autorisé par la règle 12",
    impact: "Élevé"
  },
  {
    id: 3,
    type: "Redondance",
    rule1: "Rule 56",
    rule2: "Rule 57",
    description: "Règles identiques avec des objets différents",
    impact: "Faible"
  },
  {
    id: 4,
    type: "Redondance",
    rule1: "Rule 124",
    rule2: "Rule 38",
    description: "La règle 124 est un sous-ensemble de la règle 38",
    impact: "Moyen"
  },
  {
    id: 5,
    type: "Conflit",
    rule1: "Rule 92",
    rule2: "Rule 17",
    description: "Actions contradictoires sur le même trafic",
    impact: "Élevé"
  }
];
