const portfolioData = {
  name: "Pedro Matheus",
  role: "Desenvolvedor Full Stack",
  availability: "Disponivel para novos projetos em 2026",
  email: "pedromatheus.developer@gmail.com",
  whatsappDisplay: "+55 (47) 9 9648-2391",
  whatsappNumber: "5547996482391",
  site: "https://pedromatheus-dev.vercel.app",
  siteLabel: "pedromatheus-dev.vercel.app",
  profileImage: "assets/icon_perfil.jpg",
};

const syncText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const buildGmailUrl = ({ subject = "", body = "" } = {}) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: portfolioData.email,
  });

  if (subject) {
    params.set("su", subject);
  }

  if (body) {
    params.set("body", body);
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
};

const buildWhatsAppUrl = (message = "") => {
  const baseUrl = `https://wa.me/${portfolioData.whatsappNumber}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

syncText("[data-name]", portfolioData.name);
syncText("[data-role]", portfolioData.role);
syncText("[data-availability]", portfolioData.availability);
syncText("[data-email]", portfolioData.email);
syncText("[data-whatsapp-display]", portfolioData.whatsappDisplay);
syncText("[data-site-label]", portfolioData.siteLabel);

document.querySelectorAll("[data-gmail-link]").forEach((link) => {
  link.href = buildGmailUrl();
});

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.href = buildWhatsAppUrl("Ola, Pedro. Vim pelo seu site e quero conversar sobre um projeto.");
});

document.querySelectorAll("[data-site-link]").forEach((link) => {
  link.href = portfolioData.site;
});

const profileImage = document.querySelector("[data-profile-image]");
const avatarFallback = document.querySelector("[data-avatar-fallback]");

if (profileImage && avatarFallback && portfolioData.profileImage) {
  profileImage.src = portfolioData.profileImage;
  profileImage.hidden = false;

  profileImage.addEventListener("load", () => {
    avatarFallback.hidden = true;
  });

  profileImage.addEventListener("error", () => {
    profileImage.hidden = true;
    avatarFallback.hidden = false;
  });
}

const themeButtons = document.querySelectorAll("[data-set-theme]");
const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const headerPanel = document.getElementById("header-panel");
const menuToggle = document.querySelector(".menu-toggle");
const currentPage = document.body.dataset.page || "";
const themeColors = {
  dark: "#050706",
  light: "#f8fff9",
};

document.querySelectorAll("[data-nav-page]").forEach((link) => {
  const isCurrentPage = link.dataset.navPage === currentPage;
  link.classList.toggle("is-current", isCurrentPage);
  if (isCurrentPage) {
    link.setAttribute("aria-current", "page");
  }
});

const setTheme = (theme) => {
  const selectedTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = selectedTheme;

  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.setTheme === selectedTheme);
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.setTheme === selectedTheme)
    );
  });

  if (themeMeta) {
    themeMeta.setAttribute("content", themeColors[selectedTheme]);
  }

  try {
    window.localStorage.setItem("portfolio-theme", selectedTheme);
  } catch (error) {
    // Ignore storage failures and keep the selected theme in memory only.
  }
};

let savedTheme = "dark";

try {
  savedTheme = window.localStorage.getItem("portfolio-theme") || "dark";
} catch (error) {
  savedTheme = "dark";
}

setTheme(savedTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTheme(button.dataset.setTheme);
  });
});

if (menuToggle && headerPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = headerPanel.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  headerPanel.querySelectorAll("a, button[data-set-theme]").forEach((element) => {
    element.addEventListener("click", () => {
      if (window.innerWidth <= 760) {
        headerPanel.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
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
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
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
      company ? `Empresa ou projeto: ${company}` : "",
      "",
      "Detalhes do projeto:",
      message,
    ].filter(Boolean);

    const gmailUrl = buildGmailUrl({
      subject,
      body: bodyLines.join("\n"),
    });

    formFeedback.textContent = "Abrindo o Gmail com a mensagem preenchida...";
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  });
}
