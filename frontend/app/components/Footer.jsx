import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f7f5f2] text-[#4a4a4a] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand / About */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4 tracking-wide">
              OpenBazar
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              A curated fashion marketplace bringing premium quality,
              timeless design, and effortless style together.
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-black mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm">
              {["About Us", "Contact", "FAQs", "Shipping Info"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-black transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-black mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Return Policy",
                "Cookie Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-black transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-black mb-5">
              Follow Us
            </h4>
            <div className="flex gap-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-16 pt-8 text-center">
          <p className="text-xs tracking-wide text-gray-500">
            © 2026 OpenBazar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
