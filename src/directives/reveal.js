// Directive v-reveal: cho phần tử mờ dần + trượt lên khi cuộn tới.
// Dùng: <div v-reveal> hoặc <div v-reveal="{ delay: 120 }"> (delay tính bằng ms).
// Tự tắt khi người dùng bật "reduce motion" (đã xử lý qua CSS trong style.css).

const observer =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      )
    : null;

export const revealDirective = {
  mounted(el, binding) {
    el.classList.add("reveal");
    const delay = binding.value?.delay ?? 0;
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
    if (observer) {
      observer.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  },
};
