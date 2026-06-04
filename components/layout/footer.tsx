import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import links from "@/lib/data/raw/links";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export default function Footer() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();
  const pathname = usePathname();

  const enabled = (href: string) => {
    return pathname == href;
  };

  const year = new Date().getFullYear()

  return (
    <Skeleton emuted={isloading}>
      <footer className="bg-accent text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <Link href={isloadingAuth || isloading ? "#" : "/"}>
              <div className="flex flex-col gap-4 justify-start items-center ">
                <Skeleton emuted={isloadingAuth || isloading}>
                  <h3 className="font-bold text-lg">TAT GLOBAL</h3>
                </Skeleton>
                <div className="w-24 h-24 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-background font-extrabold text-5xl">
                    TG
                  </span>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <div>
              <Skeleton emuted={isloadingAuth || isloading}>
                <h4 className="font-semibold mb-4">Navigation</h4>
              </Skeleton>
              <ul className="space-y-2 text-sm text-foreground">
                {links.navigation.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={isloadingAuth || isloading ? "#" : link.href}
                      className={cn(
                        "hover:text-primary-dark",
                        enabled(link.href) && "text-primary",
                      )}
                    >
                      <Skeleton emuted={isloadingAuth || isloading}>
                        {link.title}
                      </Skeleton>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* services */}
            <div>
              <Skeleton emuted={isloadingAuth || isloading}>
                <h4 className="font-semibold mb-4">Services</h4>
              </Skeleton>

              <ul className="space-y-2 text-sm text-foreground">
                {links.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={isloadingAuth || isloading ? "#" : link.href}
                      className={cn(
                        "hover:text-primary-dark",
                        enabled(link.href) && "text-primary",
                      )}
                    >
                      <Skeleton emuted={isloadingAuth || isloading}>
                        {link.title}
                      </Skeleton>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex max-md:flex-col md:flex-col justify-between md:gap-4 max-sm:gap-4 lg:flex">
              {/* Support */}
              <div>
                <Skeleton emuted={isloadingAuth || isloading}>
                  <h4 className="font-semibold mb-4">Support</h4>
                </Skeleton>
                <ul className="space-y-2 text-sm text-foreground">
                  {links.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={isloadingAuth || isloading ? "#" : link.href}
                        className={cn(
                          "hover:text-primary-dark",
                          enabled(link.href) && "text-primary",
                        )}
                      >
                        <Skeleton emuted={isloadingAuth || isloading}>
                          {link.title}
                        </Skeleton>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <Skeleton emuted={isloadingAuth || isloading}>
                  <h4 className="font-semibold mb-4">Suivez-nous</h4>
                </Skeleton>

                <div className="flex gap-4">
                  {links.socialNetworks.map((link, index) => (
                    <a
                      key={index}
                      href={isloadingAuth || isloading ? "#" : link.href}
                      target="_blank"
                      className={cn(
                        "hover:text-primary-dark  transition",
                        enabled(link.href) && "text-primary",
                      )}
                    >
                      <Skeleton emuted={isloadingAuth || isloading}>
                        <link.icon className="w-5 h-5" />
                      </Skeleton>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "border-t border-gray-500 pt-8 text-center text-sm",
              !isloading && "text-gray-500",
            )}
          >
            <Skeleton emuted={isloading}>
              <p>&copy; {year} TAT GLOBAL. Tous droits réservés.</p>
            </Skeleton>
          </div>
        </div>
      </footer>
    </Skeleton>
  );
}
