const navigationLinks = ["Our Story", "Menu", "Private Events", "Reservations"];

export default function Navbar() {
  return (
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
  );
}
