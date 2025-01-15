import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, SVGProps } from "react";

interface NavLinkProps {
  href: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  icon_fill?: FC<SVGProps<SVGSVGElement>>;
  label?: string;
}

const NavLinkMobile: FC<NavLinkProps> = ({
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
      className={`flex flex-1 flex-col items-center justify-center gap-1 opacity-80`}
    >
      <div
        className={`flex w-full flex-col items-center justify-center rounded-full ${
          isActive ? `bg-secondary/20 text-accent` : `text-foreground`
        }`}
      >
        {isActive && IconFill ? (
          <IconFill className="m-1 fill-current" width={28} height={28} />
        ) : (
          <Icon className="m-1 fill-current" width={28} height={28} />
        )}
      </div>
      {label && <p className="text-xs">{label}</p>}
    </Link>
  );
};

export default NavLinkMobile;

// <Link
//   href="/protected/watch-list"
//   className="flex flex-1 flex-col items-center justify-center gap-1 opacity-80"
// >
//   <div className="flex w-full items-center justify-center rounded-full bg-accent/20">
//     <img
//       src="/assets/icons/library-svg.svg"
//       alt="Lists"
//       width={40}
//       height={40}
//       className="invert-on-dark p-2"
//     />
//   </div>
//   <p className="text-xs">Library</p>
// </Link>;
