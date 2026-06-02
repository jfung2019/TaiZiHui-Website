import Image from "next/image";

const navigationLinks = ["Our Story", "Menu", "Private Events", "Reservations"];

export default function HeroSection() {
  return (
    <section className="relative min-h-svh overflow-hidden isolate">
      <Image
        src="/placeholders/7208.jpg"
        alt="Plated Chinese tasting course"
        fill
        priority
        className="object-cover object-center md:object-[center_42%]"
      />

      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.12)_40%,rgba(0,0,0,0.32)_100%)]" />

      <div className="absolute left-2 top-2 z-3 sm:left-4 sm:top-4">
        <div>
          <Image
            src="/logo/tzh_logo_vertical.png"
            alt="Tai Zi Hui logo"
            width={172}
            height={218}
            className="h-auto w-[88px] object-contain sm:w-[120px] lg:w-[156px]"
            priority
          />
        </div>
      </div>

      <nav
        className="absolute right-4 top-5 z-3 hidden gap-3 text-[0.72rem] uppercase tracking-[0.08rem] md:flex lg:right-[4vw] lg:top-[35px] lg:gap-5 lg:text-sm lg:tracking-[0.1rem]"
        aria-label="Main navigation"
      >
        {navigationLinks.map((item) => (
          <a
            href="#"
            key={item}
            className="relative opacity-85 transition-opacity duration-200 hover:opacity-100 after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[8px] after:w-full after:origin-left after:scale-x-75 after:rounded-[18px_3px_14px_5px] after:bg-[#b3201d]/85 after:opacity-0 after:blur-[0.2px] after:content-[''] after:transition-all after:duration-200 hover:after:scale-x-100 hover:after:opacity-100"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="relative z-2 mx-4 max-w-[760px] pb-10 pt-[170px] sm:mx-6 sm:pt-[210px] md:pt-[240px] lg:mx-0 lg:ml-[170px] lg:pt-[31vh]">
        <p className="m-0 text-[0.7rem] uppercase tracking-[0.12rem] opacity-85 sm:text-[0.78rem] sm:tracking-[0.14rem]">
          Hong Kong . Private Chinese Kitchen
        </p>
        <h1 className="mb-4 mt-3 max-w-[16ch] font-['Times_New_Roman','DFKai-SB',Georgia,serif] text-[clamp(1.8rem,7vw,4.6rem)] leading-[1.08] font-medium sm:max-w-[14ch]">
          An intimate Cantonese and Chiu Chow dining journey.
        </h1>
        <p className="m-0 max-w-[60ch] text-[0.88rem] leading-[1.55] text-white/90 sm:text-[0.95rem] lg:text-base">
          Seasonal ingredients, chef-led tasting menus, and bespoke hospitality for a memorable evening.
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-[30px] sm:gap-3">
          <a
            href="#"
            className="inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-white/10 px-4 text-[0.7rem] uppercase tracking-[0.08rem] transition-colors duration-200 hover:bg-white/15 sm:h-[45px] sm:min-w-[156px] sm:px-[18px] sm:text-[0.82rem]"
          >
            Reserve a Table
          </a>
          <a
            href="#"
            className="inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-black/10 px-4 text-[0.7rem] uppercase tracking-[0.08rem] transition-colors duration-200 hover:bg-black/20 sm:h-[45px] sm:min-w-[156px] sm:px-[18px] sm:text-[0.82rem]"
          >
            View Menu
          </a>
        </div>
      </div>
    </section>
  );
}
