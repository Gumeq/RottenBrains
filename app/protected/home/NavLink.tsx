import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, SVGProps } from "react";

interface NavLinkProps {
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  icon_fill?: FC<SVGProps<SVGSVGElement>>;
  label?: string;
}

const NavLink: FC<NavLinkProps> = ({
  href,
  icon: Icon,
  icon_fill: IconFill,
  label,
}) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href.split("/").pop()!);

  return (
    <Link
      href={href}
      className={`rounded-[8px] p-2 hover:bg-foreground/10 ${
        isActive ? `bg-secondary/20 text-accent` : `text-foreground`
      }`}
    >
      <div className="flex flex-row items-center gap-6">
        {isActive && IconFill ? (
          <IconFill className="fill-current" width={24} height={24} />
        ) : (
          <Icon className="fill-current" width={24} height={24} />
        )}
        {label && <p className="w-max pr-4 text-sm text-foreground">{label}</p>}
      </div>
    </Link>
  );
};

export default NavLink;
