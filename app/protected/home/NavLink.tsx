import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, SVGProps } from "react";

interface NavLinkProps {
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  label?: string;
}

const NavLink: FC<NavLinkProps> = ({ href, icon: Icon, label }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 hover:bg-foreground/10 ${
        pathname.includes(href.split("/").pop()!)
          ? `bg-primary/10 text-primary`
          : `text-foreground`
      }`}
    >
      <div className="flex flex-row items-center gap-2">
        <Icon className="fill-current" width={24} height={24} />
        {label && <p className="text-md">{label}</p>}
      </div>
    </Link>
  );
};

export default NavLink;
