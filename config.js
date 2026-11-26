const plans = [
  {
    id: "base",
    name: "Base",
    status: "Demo disponibile",
    features: [
      "Assistente AI per le email",
      "Risposte basate sui contenuti approvati",
      "Riconoscimento delle richieste frequenti",
      "Raccolta e classificazione dei contatti",
      "Bozze controllabili prima dell’invio",
      "Monitoraggio e assistenza ordinaria"
    ]
  },
  {
    id: "plus",
    name: "Plus",
    status: "In fase di sviluppo",
    features: [
      "Tutto ciò che include Base",
      "Integrazione con Instagram",
      "Chatbot intelligente per il sito",
      "Richieste di appuntamento automatizzate",
      "Sincronizzazione con Google Sheets o CRM",
      "Statistiche e report sulle richieste",
      "Assistenza prioritaria"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    status: "In fase di sviluppo",
    features: [
      "Tutto ciò che include Plus",
      "Assistente telefonico AI",
      "Gestione coordinata di email, chat e chiamate",
      "Automazioni avanzate tra più strumenti",
      "Integrazione con calendario e CRM",
      "Promemoria e follow-up automatici",
      "Flussi e integrazioni personalizzati",
      "Monitoraggio avanzato e supporto prioritario"
    ]
  }
];

const prices = {
  quoteLabel: "Richiedi un preventivo personalizzato",
  approved: {
    base: { setup: 250, monthly: 50 },
    plus: { setup: 399, monthly: 100 },
    pro: { setup: 699, monthly: 200 }
  }
};

const contact = {
  email: "veltrix.ito@gmail.com",
  endpoint: "",
  privacyNotice: ""
};

const legal = [
  { label: "Privacy policy", url: "" },
  { label: "Cookie policy", url: "" },
  { label: "Condizioni del servizio", url: "" }
];

