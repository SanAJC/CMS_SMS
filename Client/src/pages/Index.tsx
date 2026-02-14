import DashboardLayout from "@/components/DashboardLayout";
import { Send, Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import welcomeIllustration from "@/assets/welcome-illustration.png";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-card border border-border/50 shadow-sm p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 mb-8 animate-fade-in">
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            ¡Hola, bienvenido! 👋
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Gestiona tus contactos y envía mensajes de forma rápida y sencilla desde tu panel de control.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate("/contacts")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              <Users className="h-4 w-4" />
              Ver Contactos
            </button>
            <button
              onClick={() => navigate("/messages/new")}
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground shadow-sm hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
              Nuevo Mensaje
            </button>
          </div>
        </div>
        <img
          src={welcomeIllustration}
          alt="Bienvenida"
          className="w-40 h-40 md:w-52 md:h-52 object-contain"
        />
      </div>

      {/* Quick access cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        <QuickCard
          title="Contactos"
          description="Sube archivos CSV y gestiona tu lista de contactos."
          icon={Users}
          onClick={() => navigate("/contacts")}
        />
        <QuickCard
          title="Enviar Mensaje"
          description="Redacta y envía SMS a tus contactos registrados."
          icon={Send}
          onClick={() => navigate("/messages/new")}
        />
        <QuickCard
          title="Historial"
          description="Revisa el estado de todos los mensajes enviados."
          icon={MessageSquare}
          onClick={() => navigate("/messages")}
        />
      </div>
    </DashboardLayout>
  );
}

function QuickCard({
  title,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 rounded-xl bg-card border border-border/50 p-6 shadow-sm text-left hover:border-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </button>
  );
}
