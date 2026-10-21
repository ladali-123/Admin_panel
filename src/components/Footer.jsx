import { Link } from 'react-router-dom'
import { site } from '../lib/siteConfig'

/* ---------- Icons ---------- */
const YouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.500 0-9.400.500A3 3 0 0 0 .5 6.200C0 8.100 0 12 0 12s0 3.900.500 5.800a3 3 0 0 0 2.100 2.100c1.900.500 9.400.500 9.400.500s7.500 0 9.400-.500a3 3 0 0 0 2.100-2.100c.500-1.900.500-5.800.500-5.800s0-3.900-.500-5.800ZM9.600 15.600V8.400l6.200 3.600-6.200 3.600Z" />
  </svg>
)

const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

const Facebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path d="M14 8.500V7c0-.700.200-1 1.200-1H17V3h-2.600C11.500 3 10 4.600 10 7v1.500H8V12h2v9h4v-9h2.800l.4-3.500H14Z" />
  </svg>
)

const Pin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="mt-1 h-6 w-6 shrink-0 text-brand-gold">
    <path d="M12 2C8.130 2 5 5.130 5 9c0 5.250 7 13 7 13s7-7.750 7-13c0-3.870-3.130-7-7-7Zm0 9.500a2.500 2.500 0 0 1 0-5 2.500 2.500 0 0 1 0 5Z" />
  </svg>
)

const Phone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="mt-1 h-6 w-6 shrink-0 text-brand-gold">
    <path d="M6.620 10.790c1.440 2.830 3.760 5.140 6.590 6.590l2.200-2.200c.270-.270.670-.360 1.020-.240 1.120.370 2.330.570 3.570.570.550 0 1 .450 1 1V20c0 .550-.450 1-1 1-9.390 0-17-7.610-17-17 0-.550.450-1 1-1h3.500c.550 0 1 .450 1 1 0 1.250.200 2.450.570 3.570.110.350.030.740-.250 1.020l-2.200 2.200Z" />
  </svg>
)

const Mail = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="mt-1 h-6 w-6 shrink-0 text-brand-gold">
    <path d="M20 4H4c-1.100 0-2 .900-2 2v12c0 1.100.900 2 2 2h16c1.100 0 2-.900 2-2V6c0-1.100-.900-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
  </svg>
)

/* ---------- Data ---------- */
const socials = [
  { label: 'YouTube', href: site.youtube, Icon: YouTube, bg: '#FF0000' },
  {
    label: 'Instagram',
    href: site.instagram,
    Icon: Instagram,
    bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
  },
  { label: 'Facebook', href: site.facebook, Icon: Facebook, bg: '#1877F2' },
]

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/class/11', label: 'Class 11' },
  { to: '/class/12', label: 'Class 12' },
]

function Heading({ children }) {
  return (
    <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-brand-gold">
      <span className="h-0.5 w-8 bg-brand-gold" />
      {children}
    </h3>
  )
}

/* ---------- Footer ---------- */
export default function Footer() {
  return (
    <footer className="mt-12 border-t-4 border-brand-gold bg-brand-maroon-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1.4fr]">
        {/* Address */}
        <div>
          <Heading>Our Address</Heading>
          <ul className="space-y-4 text-base leading-relaxed text-white/90">
            <li className="flex gap-3">
              <Pin />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone />
              <span>
                {site.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && ' / '}
                    <a href={`tel:+91${p}`} className="hover:text-brand-gold">{p}</a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail />
              <a href={`mailto:${site.email}`} className="break-all hover:text-brand-gold">
                {site.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon, bg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ background: bg }}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Useful links */}
        <div>
          <Heading>Useful Links</Heading>
          <ul className="space-y-3 text-base">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-white/90 transition hover:text-brand-gold">
                  › {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="md:col-span-2 lg:col-span-1">
          <Heading>We On Map</Heading>
          <div className="overflow-hidden rounded-xl border border-white/20 shadow-lg">
            <iframe
              title="Dr. Madhuresh Chemistry Class location"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0 sm:h-64"
            />
          </div>
          <a
            href={site.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-base font-medium text-brand-gold hover:underline"
          >
           Open in Google Maps ↗
          </a>
        </div>
      </div>

      <div className="bg-black/25 py-4 text-center text-sm text-white/70">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  )
}