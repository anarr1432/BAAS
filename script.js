const year = document.getElementById("year");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");

year.textContent = new Date().getFullYear();

const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      let current = 0;
      const step = Math.max(1, Math.round(target / 24));
      const timer = window.setInterval(() => {
        current = Math.min(target, current + step);
        el.textContent = current;
        if (current === target) window.clearInterval(timer);
      }, 34);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((item) => countObserver.observe(item));

const services = {
  construction: {
    label: "حاويات 20 ياردة",
    title: "مخلفات الهدم والبناء",
    text: "توريد ورفع سريع لحاويات تتحمل الخرسانة والطوب وبقايا البناء مع تنظيم موقع العمل.",
    image: "assets/construction-container.jpg",
    message: "أرغب بطلب حاوية هدم وبناء 20 ياردة",
  },
  scrap: {
    label: "حاويات 30 ياردة",
    title: "سكراب ومعادن ثقيلة",
    text: "حلول مخصصة لجمع ونقل الخردة والمعادن من المواقع الصناعية والتجارية بأمان.",
    image: "assets/scrap-container.jpg",
    message: "أرغب بطلب حاوية سكراب 30 ياردة",
  },
  sand: {
    label: "نقل مواد",
    title: "رمل وبحص للمشاريع",
    text: "حاويات تساعد على توريد الرمل والبحص داخل الموقع وتقليل الوقت الضائع في النقل.",
    image: "assets/sand-container.jpg",
    message: "أرغب بطلب حاويات رمل وبحص",
  },
  water: {
    label: "تأجير مؤقت",
    title: "توانك ماء نظيفة وآمنة",
    text: "توريد توانك مياه لمواقع البناء والمزارع والمشاريع المؤقتة حسب احتياج التشغيل.",
    image: "assets/water-tank.jpg",
    message: "أرغب بطلب تأجير تانك ماء",
  },
};

const servicePreview = document.getElementById("servicePreview");
const serviceLabel = document.getElementById("serviceLabel");
const serviceTitle = document.getElementById("serviceTitle");
const serviceText = document.getElementById("serviceText");
const serviceLink = document.getElementById("serviceLink");

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    const service = services[button.dataset.service];
    document.querySelectorAll("[data-service]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    servicePreview.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 320, easing: "ease" });
    servicePreview.src = service.image;
    serviceLabel.textContent = service.label;
    serviceTitle.textContent = service.title;
    serviceText.textContent = service.text;
    serviceLink.href = `https://wa.me/966594368198?text=${encodeURIComponent(service.message)}`;
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeLightbox = lightbox.querySelector("button");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const hideLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
};

closeLightbox.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideLightbox();
});

const planService = document.getElementById("planService");
const planQty = document.getElementById("planQty");
const planNote = document.getElementById("planNote");
const qtyOutput = document.getElementById("qtyOutput");
const plannerWhatsapp = document.getElementById("plannerWhatsapp");

const updatePlanner = () => {
  qtyOutput.textContent = planQty.value;
  const note = planNote.value.trim() || "لا توجد ملاحظات إضافية";
  const message = `السلام عليكم، أرغب بطلب ${planService.value}. العدد: ${planQty.value}. الملاحظات: ${note}`;
  plannerWhatsapp.href = `https://wa.me/966594368198?text=${encodeURIComponent(message)}`;
};

[planService, planQty, planNote].forEach((field) => field.addEventListener("input", updatePlanner));
updatePlanner();

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});
