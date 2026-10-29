<template>
  <AdminDashboard v-if="isAdmin" />
  <ReportPage v-else-if="isReport" />
  <template v-else>
    <TheHeader />
    <main>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <PromoSection />
      <FacilitySection />
      <TeamSection />
      <TestimonialsSection />
      <PricingSection />
      <MapSection />
      <FaqSection />
      <BookingFormSection />
    </main>
    <TheFooter />
    <FloatingContact />
    <PromoPopup />
  </template>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue";
import HeroSection from "./components/HeroSection.vue";
import IntroSection from "./components/IntroSection.vue";
import ServicesSection from "./components/ServicesSection.vue";
import PromoSection from "./components/PromoSection.vue";
import FacilitySection from "./components/FacilitySection.vue";
import TeamSection from "./components/TeamSection.vue";
import TestimonialsSection from "./components/TestimonialsSection.vue";
import PricingSection from "./components/PricingSection.vue";
import MapSection from "./components/MapSection.vue";
import FaqSection from "./components/FaqSection.vue";
import BookingFormSection from "./components/BookingFormSection.vue";
import TheFooter from "./components/TheFooter.vue";
import FloatingContact from "./components/FloatingContact.vue";
import PromoPopup from "./components/PromoPopup.vue";
import AdminDashboard from "./components/AdminDashboard.vue";
import ReportPage from "./components/ReportPage.vue";

// Route đơn giản không cần thư viện: /admin -> trang quản trị, còn lại -> trang chính.
const path = window.location.pathname.replace(/\/$/, "");
const isAdmin = path === "/admin";
const isReport = path === "/bao-cao";
</script>
