"use client";

import CartButton from "@/components/cart/cart-button";
import ThemeButton from "@/components/theme/theme-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { ROLE_USER, STATUS_USER } from "@/lib/constants/constants";
import links from "@/lib/data/raw/links";
import { APP } from "@/lib/data/raw/routes";
import { RoleUser } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  StepForward,
  User,
  UserCog,
  UserPlus2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const { isloading } = useTheme();
  const { logout, status, isLoggedIn, user, isloadingAuth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

  const enabled = (href: string) => {
    return pathname === href;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Skeleton emuted={isloading}>
      <nav
        className={cn(
          "fixed left-0 right-0 top-0 z-50 w-full shadow-sm shadow-foreground bg-background ",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-4  ">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link
              href={isloadingAuth || isloading ? "#" : APP.public.home}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">TG</span>
              </div>{" "}
              <Skeleton emuted={isloadingAuth || isloading}>
                <span className="font-bold text-lg max-lg:hidden inline">
                  TAT GLOBAL
                </span>
              </Skeleton>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 md:gap-4 lg:gap-8">
              {links.app.map((link, index) => {
                if (link.title == "Services" && link.href == null)
                  return (
                    <div key={index} className="relative group">
                      <Skeleton emuted={isloadingAuth || isloading}>
                        <button
                          className={cn(
                            "text-sm hover:text-primary group-hover:text-primary transition flex items-center gap-1",
                          )}
                          disabled={isloadingAuth || isloading}
                        >
                          <Skeleton emuted={isloadingAuth || isloading}>
                            {link.title}
                          </Skeleton>
                          <Skeleton emuted={isloadingAuth || isloading}>
                            <ChevronDown className="w-4 h-4" />
                          </Skeleton>
                        </button>
                      </Skeleton>
                      <div
                        className={cn(
                          "hidden absolute left-0 mt-0 w-48 bg-background border border-border rounded-lg shadow-lg",
                          !isloadingAuth && !isloading && "group-hover:block",
                        )}
                      >
                        {link?.services?.map((service, index) => (
                          <Link
                            key={index}
                            href={
                              isloadingAuth || isloading ? "#" : service?.href
                            }
                            className={cn(
                              "block px-4 py-2 hover:bg-accent hover:text-primary text-sm",
                              enabled(service?.href) &&
                                "text-primary-dark hover:text-primary",
                            )}
                          >
                            <Skeleton emuted={isloadingAuth || isloading}>
                              {service?.title}
                            </Skeleton>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                else if (link.href !== null)
                  return (
                    <Link
                      key={index}
                      href={isloadingAuth || isloading ? "#" : link.href}
                      className={cn(
                        "text-sm hover:text-primary transition",
                        enabled(link.href) &&
                          "text-primary-dark hover:text-primary",
                      )}
                    >
                      <Skeleton emuted={isloadingAuth || isloading}>
                        {link.title}
                      </Skeleton>
                    </Link>
                  );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-1 lg:gap-2 ">
              {/* Cart Button */}
              <CartButton emuted={isloading || isloadingAuth} />

              {/* Theme Button */}
              <ThemeButton emuted={isloading} />

              {/*  Admin Button , Account Button , In progress Button , Logout Button , Login Button and Signup Button  */}
              <Skeleton emuted={isloadingAuth || isloading}>
                <div className="flex items-center gap-2 md:gap-1 lg:gap-2">
                  {isLoggedIn ? (
                    <>
                      {user?.status === STATUS_USER.online ? (
                        <>
                          {/* Admin Button */}
                          {user?.role !== RoleUser.USER && (
                            <Link
                              href={
                                isloadingAuth || isloading
                                  ? "#"
                                  : user?.role === RoleUser.ADMIN
                                    ? APP.admin.dashboard
                                    : "#"
                              }
                            >
                              <Button
                                size="sm"
                                variant={
                                  isloadingAuth || isloading
                                    ? "emuted"
                                    : "default"
                                }
                                disabled={isloadingAuth || isloading}
                                className={cn(
                                  isloadingAuth || isloading
                                    ? "bg-muted-foreground text-muted-foreground hover:bg-muted-foreground"
                                    : "bg-foreground text-background hover:bg-primary-dark",
                                  enabled(
                                    user?.role === RoleUser.ADMIN
                                      ? APP.admin.dashboard
                                      : "",
                                  ) &&
                                    !isloadingAuth &&
                                    !isloading &&
                                    "bg-primary-dark hover:bg-primary",
                                )}
                              >
                                <UserCog />
                              </Button>
                            </Link>
                          )}
                          {/* Account Button */}
                          <Link
                            href={
                              isloadingAuth || isloading
                                ? "#"
                                : APP.private.account
                            }
                            className="hover:text-primary"
                          >
                            <Button
                              size="sm"
                              variant={
                                isloadingAuth || isloading ? "emuted" : "ghost"
                              }
                              disabled={isloadingAuth || isloading}
                            >
                              <User
                                className={cn(
                                  "w-4 h-4 hover:text-primary ",
                                  enabled(APP.private.account) &&
                                    !isloadingAuth &&
                                    !isloading &&
                                    "text-primary-dark hover:text-primary",
                                )}
                              />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          {/* In progress Button */}
                          {user?.status === STATUS_USER.in_progress && (
                            <Link
                              href={
                                isloadingAuth || isloading
                                  ? "#"
                                  : APP.private.formCompletion
                              }
                            >
                              <Button
                                size="sm"
                                disabled={isloadingAuth || isloading}
                                className={cn(
                                  " max-lg:hidden",
                                  isloadingAuth || isloading
                                    ? "text-muted-foreground bg-muted-foreground"
                                    : "bg-foreground text-background hover:bg-primary-dark",
                                )}
                              >
                                Prochaine étape
                              </Button>
                              <Button
                                size="sm"
                                disabled={isloadingAuth || isloading}
                                className={cn(
                                  " lg:hidden",
                                  isloadingAuth || isloading
                                    ? "text-muted-foreground bg-muted-foreground"
                                    : "bg-foreground text-background hover:bg-primary-dark",
                                )}
                              >
                                <StepForward className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                      {/* Logout Button */}
                      <Button
                        size="sm"
                        variant={
                          isloadingAuth || isloading ? "emuted" : "ghost"
                        }
                        disabled={isloadingAuth || isloading}
                        onClick={handleLogout}
                      >
                        <LogOut
                          className={cn(
                            "w-4 h-4 ",
                            isloadingAuth || isloading
                              ? "text-muted-foreground"
                              : "text-destructive",
                          )}
                        />
                      </Button>
                    </>
                  ) : (
                    status === STATUS_USER.offline && (
                      <div className="flex gap-2">
                        <Link
                          href={
                            isloadingAuth || isloading ? "#" : APP.auth.login
                          }
                        >
                          <Button
                            size="sm"
                            variant={
                              isloadingAuth || isloading ? "emuted" : "outline"
                            }
                            disabled={isloadingAuth || isloading}
                            className="max-lg:hidden"
                          >
                            Connexion
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              isloadingAuth || isloading ? "emuted" : "outline"
                            }
                            disabled={isloadingAuth || isloading}
                            className="lg:hidden"
                          >
                            <LogIn className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          href={
                            isloadingAuth || isloading ? "#" : APP.auth.signup
                          }
                        >
                          <Button
                            size="sm"
                            disabled={isloadingAuth || isloading}
                            className={cn(
                              " max-lg:hidden",
                              isloadingAuth || isloading
                                ? "text-muted-foreground bg-muted-foreground"
                                : "bg-foreground text-background hover:bg-primary-dark",
                            )}
                          >
                            Inscription
                          </Button>
                          <Button
                            size="sm"
                            disabled={isloadingAuth || isloading}
                            className={cn(
                              " lg:hidden",
                              isloadingAuth || isloading
                                ? "text-muted-foreground bg-muted-foreground"
                                : "bg-foreground text-background hover:bg-primary-dark",
                            )}
                          >
                            <UserPlus2 className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </Skeleton>

              {/* Mobile Menu Button */}
              <Skeleton emuted={isloading}>
                <button
                  disabled={isloading}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "md:hidden p-2 rounded-lg",
                    !isloading && "hover:bg-accent",
                  )}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </Skeleton>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border">
              {links.app.map((link, index) => {
                if (link.title == "Services" && link.href === null)
                  return (
                    <div key={index} className="relative group">
                      <Skeleton emuted={isloadingAuth || isloading}>
                        <button
                          disabled={isloadingAuth || isloading}
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="w-full text-left px-4 py-2 hover:bg-accent rounded flex items-center justify-between hover:text-primary "
                        >
                          <Skeleton emuted={isloadingAuth || isloading}>
                            {link.title}
                          </Skeleton>
                          <Skeleton emuted={isloadingAuth || isloading}>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition",
                                isServicesOpen && "rotate-180",
                                isloadingAuth ||
                                  (isloading && "text-muted-foreground"),
                              )}
                            />
                          </Skeleton>
                        </button>
                      </Skeleton>
                      {isServicesOpen && (
                        <div className="pl-4 space-y-2">
                          {link?.services?.map((service, index) => (
                            <Link
                              key={index}
                              href={
                                isloadingAuth || isloading ? "#" : service?.href
                              }
                              className={cn(
                                "block px-4 py-2 hover:bg-accent hover:text-primary rounded text-sm",
                                enabled(service?.href) &&
                                  "text-primary-dark hover:text-primary",
                              )}
                            >
                              <Skeleton emuted={isloadingAuth || isloading}>
                                {service?.title}
                              </Skeleton>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                else if (link.href !== null && link.title !== "Services")
                  return (
                    <Link
                      key={index}
                      href={isloadingAuth || isloading ? "#" : link.href}
                      className={cn(
                        "block px-4 py-2 hover:bg-accent hover:text-primary rounded",
                        enabled(link.href) &&
                          "text-primary-dark hover:text-primary",
                      )}
                    >
                      <Skeleton emuted={isloadingAuth || isloading}>
                        {link.title}
                      </Skeleton>
                    </Link>
                  );
              })}
            </div>
          )}
        </div>
      </nav>
    </Skeleton>
  );
}
