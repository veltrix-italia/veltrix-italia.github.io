const select = (selector) => document.querySelector(selector);

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

const service = select('[name="service"]');
service.replaceChildren(new Option("Seleziona", ""));
const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
for (const plan of plans) {
  service.add(new Option(plan.name + " · " + plan.status.toLowerCase(), plan.id));
  const card = element("article", "", "card");
  const list = element("ul");
  for (const feature of plan.features) list.append(element("li", feature));

  const approved = prices.approved?.[plan.id];
  const price = approved
    ? euro.format(approved.setup) + " di configurazione + " + euro.format(approved.monthly) + "/mese"
    : prices.quoteLabel;
  const action = element("a", plan.id === "base" ? "Prova la demo" : "Parliamone", "button outline");
  action.href = plan.id === "base" ? "#demo" : "#contatti";
  if (plan.id !== "base") {
    action.addEventListener("click", () => { service.value = plan.id; });
  }
  card.append(element("p", plan.status, "pill"), element("h3", plan.name), list, element("p", price, "price"), action);
  select("#plans").append(card);
}
service.add(new Option("Da definire", "altro"));

const menu = select(".menu");
const nav = select("#nav");
function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
}
menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") === "false"));
nav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  if (menu.getAttribute("aria-expanded") === "true") menu.focus({ preventScroll: true });
  setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});
matchMedia("(max-width: 700px)").addEventListener("change", () => setMenu(false));

const request = select("#request");
const answer = select("#answer");
const copyAnswer = select("#copy-answer");
const copyStatus = select("#copy-status");
copyAnswer.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(answer.textContent);
    copyStatus.textContent = "Risposta copiata.";
  } catch {
    copyStatus.textContent = "Copia automatica non disponibile. Puoi selezionare il testo della bozza.";
  }
});
for (const sample of document.querySelectorAll(".samples button")) {
  sample.addEventListener("click", () => {
    request.value = sample.textContent;
    request.setCustomValidity("");
    request.focus();
  });
}

const topics = [
  { pattern: /\b(?:orari?[oa]?|apr[ei]|chiud\w*|apertura|chiusura|sabato|domenica)\b/,
    reply: "La palestra è aperta dal lunedì al venerdì dalle 7:00 alle 21:00 e il sabato dalle 9:00 alle 14:00. La domenica è chiusa." },
  { pattern: /\b(?:cors[oi]|yoga|pilates|allenament\w*|lezion\w*|attivit\w*)\b/,
    reply: "Offriamo corsi di yoga, Pilates e allenamento funzionale. Se ci dici quale corso ti interessa, possiamo indicarti le fasce disponibili." },
  { pattern: /\b(?:prov\w*|gratuit\w*)\b/,
    reply: "Puoi richiedere una sessione di prova gratuita. Indicaci due giorni e orari in cui sei disponibile e ti confermeremo uno slot." },
  { pattern: /\b(?:cost\w*|prezz\w*|tariff\w*|abbonament\w*)\b/,
    reply: "L’abbonamento mensile alla sala costa 39 €. Possiamo aiutarti a scegliere la formula più adatta se ci dici quali attività ti interessano." }
];

request.addEventListener("input", () => request.setCustomValidity(""));
select("#demo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = request.value.trim();
  if (!value) {
    request.setCustomValidity("Inserisci una richiesta di esempio.");
    request.reportValidity();
    return;
  }
  const normalized = value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const replies = topics.filter(({ pattern }) => pattern.test(normalized)).map(({ reply }) => reply);
  if (!replies.length) {
    replies.push("Passo la tua richiesta alla reception. Se riguarda orari, corsi, prova gratuita o abbonamenti, puoi indicare quale informazione ti serve.");
  }
  answer.textContent = ["Ciao! Grazie per aver contattato la palestra Futura Fit.", ...replies, "A presto,\nIl team di Futura Fit"].join("\n\n");
  copyStatus.textContent = "";
  copyAnswer.hidden = !navigator.clipboard;
});

for (const documentInfo of legal) {
  const item = element(documentInfo.url ? "a" : "span", documentInfo.label);
  if (documentInfo.url) item.href = documentInfo.url;
  else item.textContent += " · in preparazione";
  select("#legal").append(item);
}

if (contact.email) {
  const address = select("#contact-email");
  const link = element("a", contact.email);
  link.href = "mailto:" + contact.email;
  address.append(link);
  address.hidden = false;
}

const form = select("#contact-form");
const fields = select("#contact-fields");
const notice = select("#contact-note");
const status = select("#contact-status");
const submit = select("#contact-submit");
const privacy = legal.find(({ label }) => label === "Privacy policy");
const contactReady = Boolean(contact.endpoint && contact.privacyNotice && privacy?.url);
const mailtoReady = Boolean(contact.email);
if (contactReady || mailtoReady) {
  fields.disabled = false;
  if (contactReady) {
    const privacyLink = element("a", "Leggi l’informativa sulla privacy");
    privacyLink.href = privacy.url;
    notice.replaceChildren(contact.privacyNotice, " ", privacyLink, ".");
  } else {
    notice.textContent = "Compila i campi. Si aprirà la tua app email con il messaggio pronto: controllalo e premi Invia.";
  }
} else {
  notice.append(" Puoi comunque ", element("a", "provare la simulazione"), ".");
  notice.querySelector("a").href = "#demo";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if ((!contactReady && !mailtoReady) || submit.disabled) return;
  if (!form.reportValidity()) return;
  if (!contactReady) {
    const data = new FormData(form);
    const subject = "Richiesta dal sito Veltrix — " + data.get("company");
    const message = [
      "Nome: " + data.get("name"),
      "Azienda: " + data.get("company"),
      "Email: " + data.get("email"),
      "Settore: " + data.get("sector"),
      "Servizio di interesse: " + data.get("service"),
      "",
      "Messaggio:",
      data.get("message")
    ].join("\n");
    const mailto = "mailto:" + contact.email
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(message);
    status.replaceChildren(
      "Se la tua app email non si apre, scrivi direttamente a ",
      element("a", contact.email),
      "."
    );
    status.querySelector("a").href = "mailto:" + contact.email;
    window.location.href = mailto;
    return;
  }
  submit.disabled = true;
  status.textContent = "Invio in corso…";
  try {
    const data = new FormData(form);
    const response = await fetch(contact.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(data))
    });
    if (!response.ok || (await response.json()).delivered !== true) throw new Error("Invio non verificato");
    form.reset();
    status.textContent = "Richiesta inviata.";
  } catch {
    status.textContent = "Non siamo riusciti a verificare l’invio. I campi compilati sono ancora disponibili.";
  } finally {
    submit.disabled = false;
  }
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  for (const section of document.querySelectorAll(".section")) observer.observe(section);
}

