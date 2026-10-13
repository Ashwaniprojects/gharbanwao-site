export const Logo = ({ className = "", size = "h-14 md:h-16" }) => (
  <a href="/" className={`inline-flex items-center shrink-0 ${className}`} data-testid="site-logo" aria-label="GharBanwao.com home">
    <img src="/logo.png" alt="GharBanwao.com® — Quality Service" className={`${size} w-auto max-w-none object-contain`} />
  </a>
);
