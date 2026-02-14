import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Send,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Contactos", path: "/contacts" },
  { icon: Send, label: "Nuevo Mensaje", path: "/messages/new" },
  { icon: MessageSquare, label: "Historial", path: "/messages" },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center bg-sidebar py-6">
      {/* Logo */}
      <div className="mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
        <MessageSquare className="h-5 w-5 text-primary-foreground" />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        title="Cerrar sesión"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-sidebar-muted transition-colors hover:bg-destructive/20 hover:text-destructive"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
