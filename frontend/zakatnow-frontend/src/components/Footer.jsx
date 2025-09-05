// src/components/Footer.jsx
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();

  // Pindahkan array ke dalam komponen untuk akses ke fungsi `t`
  const socialLinks = [
    { icon: <FaFacebook />, href: "*", label: t("footer.socials.facebook") },
    { icon: <FaTwitter />, href: "*", label: t("footer.socials.twitter") },
    { icon: <FaInstagram />, href: "*", label: t("footer.socials.instagram") },
    { icon: <FaLinkedin />, href: "www.linkedin.com/in/muhamad-alwan-fadhlurrohman-238034315", label: t("footer.socials.linkedin") },
  ];

  return (
    <footer className="bg-green-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t("footer.brandName")}</h3>
            <p className="text-green-200">{t("footer.description")}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-green-200">
              <li><a href="/about" className="hover:text-white transition-colors">{t("footer.about")}</a></li>
              <li><a href="*" className="hover:text-white transition-colors">{t("footer.contact")}</a></li>
              <li><a href="*" className="hover:text-white transition-colors">{t("footer.faq")}</a></li>
              <li><a href="*" className="hover:text-white transition-colors">{t("footer.privacy")}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.contactUs")}</h3>
            <address className="not-italic text-green-200 space-y-2">
              <p>{t("footer.addressLine1")}</p>
              <p>{t("footer.addressLine2")}</p>
              <p>
                {t("footer.emailPrefix")} 
                <a href={`mailto:${t("footer.emailAddress")}`} className="hover:text-white">
                  {t("footer.emailAddress")}
                </a>
              </p>
            </address>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.followUs")}</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  aria-label={link.label}
                  className="text-green-200 hover:text-white transition-colors text-2xl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-green-600 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-green-200">
          <p>&copy; {new Date().getFullYear()} {t("footer.brandName")}. {t("footer.rights")}</p>
          <p className="mt-4 sm:mt-0">{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}