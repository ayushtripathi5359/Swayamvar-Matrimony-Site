import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mx-auto mt-12 md:mt-24 min-h-[429px] w-full max-w-[1280px] overflow-hidden rounded-t-[32px] bg-[#131313] px-4 md:px-[60px] py-8 md:py-[60px]">
      {/* Background decorative grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 h-full w-full">
          {/* Horizontal lines */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px w-full"
              style={{
                top: `${i * 90}px`,
                background:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 255, 255, 0.16) 50%, rgba(0, 0, 0, 0.00) 100%)",
                opacity: i === 0 || i === 14 ? 0.4 : i === 1 || i === 13 ? 0.6 : 1,
              }}
            />
          ))}
          {/* Vertical lines */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${i * 90}px`,
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 255, 255, 0.16) 50%, rgba(0, 0, 0, 0.00) 100%)",
                opacity: i === 0 || i === 14 ? 0.4 : i === 1 || i === 13 ? 0.6 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer content */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-[241px] items-start justify-between gap-8 md:gap-4">
        {/* Logo and disclaimer */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-start justify-center gap-3">
            <div className="relative h-[108px] w-[91px]">
              <div className="absolute left-0 top-0 h-[108px] w-[108px] rounded-[20px] bg-[#3452FF]" />
              <svg
                className="absolute left-[25px] top-[26px]"
                width="57"
                height="55"
                viewBox="0 0 57 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M57 18.5495H37.6871V0H19.1788C19.1788 10.2476 10.5953 18.5495 0 18.5495V36.4505H19.1788V55H37.6871C37.6871 44.7524 46.4047 36.4505 57 36.4505V18.5495Z"
                  fill="#181818"
                />
              </svg>
            </div>
            <div className="font-outfit text-3xl md:text-[50px] font-medium leading-normal text-white">
              Swayamvar
            </div>
            <div className="font-jakarta text-base md:text-lg font-normal leading-normal text-white">
              These tools are for personal finance management,
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>not for legal advice.
            </div>
          </div>
        </div>

        {/* Company links */}
        <div className="flex flex-col items-start gap-4">
          <div className="font-jakarta text-lg font-semibold leading-normal text-white">
            Company
          </div>
          <div className="flex flex-col items-start gap-2 self-stretch">
            <Link
              to="/"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              About
            </Link>
            <Link
              to="/service"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Service
            </Link>
            <Link
              to="/testimonials"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Testimonials
            </Link>
            <Link
              // to="/pricing"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              to="/career"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Career
            </Link>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-col items-start gap-4">
          <div className="font-jakarta text-lg font-semibold leading-normal text-white">
            Legal Links
          </div>
          <div className="flex flex-col items-start gap-2 self-stretch">
            <Link
              to="/privacy"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookie"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Cookie Policy
            </Link>
            <Link
              to="/disclaimer"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Disclaimer
            </Link>
            <Link
              to="/copyright"
              className="font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              Copyright
            </Link>
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-[98px] font-jakarta text-lg font-semibold leading-normal text-white">
            Social
          </div>
          <div className="flex flex-col items-start gap-2 self-stretch">
            <a
              href="mailto:support@Swayamvar.com"
              className="w-[247px] font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              support@Swayamvar.com
            </a>
            <a
              href="tel:+1023722742444"
              className="w-[203px] font-jakarta text-lg font-normal leading-normal text-white/60 hover:text-white"
            >
              +102 372 274 2444
            </a>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-[32px] bg-[#333] p-3 hover:bg-[#444]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8004 2.39844H7.20039C4.56063 2.39844 2.40039 4.55772 2.40039 7.19844V16.7984C2.40039 19.4382 4.56063 21.5984 7.20039 21.5984H16.8004C19.4402 21.5984 21.6004 19.4382 21.6004 16.7984V7.19844C21.6004 4.55772 19.4402 2.39844 16.8004 2.39844ZM12.0004 15.9983C9.79095 15.9983 8.00031 14.2069 8.00031 11.9984C8.00031 9.789 9.79095 7.99836 12.0004 7.99836C14.2089 7.99836 16.0005 9.789 16.0005 11.9984C16.0005 14.2069 14.2089 15.9983 12.0004 15.9983ZM17.2005 7.99836C16.5371 7.99836 16.0005 7.461 16.0005 6.79836C16.0005 6.13572 16.5371 5.59836 17.2005 5.59836C17.8638 5.59836 18.4005 6.13572 18.4005 6.79836C18.4005 7.461 17.8638 7.99836 17.2005 7.99836Z"
                    fill="white"
                  />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-[32px] bg-[#333] p-3 hover:bg-[#444]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 4H7C4 4 2 6 2 9V15C2 18 4 20 7 20H17C20 20 22 18 22 15V9C22 6 20 4 17 4ZM13.89 13.03L11.42 14.51C10.42 15.11 9.59998 14.65 9.59998 13.48V10.51C9.59998 9.34001 10.42 8.88001 11.42 9.48001L13.89 10.96C14.84 11.54 14.84 12.46 13.89 13.03Z"
                    fill="white"
                  />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-[32px] bg-[#333] p-3 hover:bg-[#444]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.19C22 19.83 19.83 22 16.19 22H15C14.45 22 14 21.55 14 21V15.23C14 14.96 14.22 14.73 14.49 14.73L16.25 14.7C16.39 14.69 16.51 14.59 16.54 14.45L16.89 12.54C16.92 12.36 16.78 12.19 16.59 12.19L14.46 12.22C14.18 12.22 13.96 12 13.95 11.73L13.91 9.28C13.91 9.12 14.04 8.98001 14.21 8.98001L16.61 8.94C16.78 8.94 16.91 8.81001 16.91 8.64001L16.87 6.23999C16.87 6.06999 16.74 5.94 16.57 5.94L13.87 5.98001C12.21 6.01001 10.89 7.37 10.92 9.03L10.97 11.78C10.98 12.06 10.76 12.28 10.48 12.29L9.28 12.31C9.11 12.31 8.98001 12.44 8.98001 12.61L9.01001 14.51C9.01001 14.68 9.14 14.81 9.31 14.81L10.51 14.79C10.79 14.79 11.01 15.01 11.02 15.28L11.11 20.98C11.12 21.54 10.67 22 10.11 22H7.81C4.17 22 2 19.83 2 16.18V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81V16.19Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative md:absolute md:bottom-[46px] left-1/2 md:-translate-x-1/2 mt-8 md:mt-0 inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(19,19,19,0.1)] bg-white px-4 py-2 mx-auto">
        <div className="font-jakarta text-sm md:text-lg font-medium leading-normal text-[#131313] text-center">
          © Swayamvar All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
