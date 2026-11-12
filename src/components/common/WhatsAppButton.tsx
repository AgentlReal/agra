const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || '6281234567890'
).replace(/\D/g, '');
const WHATSAPP_MESSAGE =
  'Hallo admin Agra, saya butuh bantuan untuk [isi kendala] mohon bantuannya terimakasih';

/**
 * Floating WhatsApp action button anchored to the bottom-right corner on all pages.
 */
export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Admin Agra via WhatsApp"
      title="Hubungi Admin Agra via WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] transition-all hover:scale-105 hover:bg-[#20BD5A] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B68FF]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path d="M12.031 2C6.504 2 2.008 6.496 2.008 12.023c0 1.768.462 3.495 1.34 5.018L2 22l5.083-1.333a9.985 9.985 0 0 0 4.948 1.304h.004c5.526 0 10.023-4.496 10.023-10.023C22.058 6.496 17.558 2 12.031 2zm5.83 14.234c-.245.69-1.425 1.318-1.976 1.4-.503.075-1.158.107-1.868-.118-.43-.137-.983-.32-1.694-.627-2.98-1.287-4.926-4.294-5.075-4.493-.148-.2-1.21-1.611-1.21-3.073 0-1.462.767-2.181 1.038-2.478.272-.298.594-.372.792-.372.198 0 .396.002.569.01.183.009.428-.07.67.512.248.596.842 2.056.916 2.205.075.149.124.323.025.522-.099.198-.149.322-.297.496-.149.173-.312.387-.446.52-.149.148-.304.309-.13.607.173.297.77 1.27 1.653 2.058 1.135 1.012 2.092 1.326 2.389 1.475.297.148.471.124.644-.074.173-.198.743-.867.941-1.164.198-.298.396-.248.668-.149.272.099 1.733.817 2.03.966.297.149.495.223.569.347.075.124.075.719-.17 1.409z" />
      </svg>
    </a>
  );
}

