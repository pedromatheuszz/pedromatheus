// Atualize estes dados com seus links e contatos reais.
const portfolioData = {
  name: "Pedro Matheus",
  role: "Desenvolvedor Full Stack",
  availability: "Disponível para novos projetos em 2026",
  email: "contato@pedromatheus.dev",
  github: "https://github.com/pedromatheus",
  githubLabel: "github.com/pedromatheus",
  linkedin: "https://linkedin.com/in/pedromatheus",
  linkedinLabel: "linkedin.com/in/pedromatheus",
};

const syncText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

syncText("[data-name]", portfolioData.name);
syncText("[data-role]", portfolioData.role);
syncText("[data-availability]", portfolioData.availability);
syncText("[data-email]", portfolioData.email);
syncText("[data-github-label]", portfolioData.githubLabel);
syncText("[data-linkedin-label]", portfolioData.linkedinLabel);

const emailLink = document.querySelector("[data-email-link]");
const githubLink = document.querySelector("[data-github-link]");
const linkedinLink = document.querySelector("[data-linkedin-link]");

if (emailLink) {
  emailLink.href = `mailto:${portfolioData.email}`;
}

if (githubLink) {
  githubLink.href = portfolioData.github;
}

if (linkedinLink) {
  linkedinLink.href = portfolioData.linkedin;
}

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 280)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `Novo projeto para ${portfolioData.name}`;
    const bodyLines = [
      `Nome: ${name}`,
      company ? `Empresa ou marca: ${company}` : "",
      "",
      "Objetivo do projeto:",
      message,
    ].filter(Boolean);

    const mailtoUrl =
      `mailto:${portfolioData.email}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    formFeedback.textContent = "Abrindo seu aplicativo de e-mail com a mensagem pronta...";
    window.location.href = mailtoUrl;
  });
}
