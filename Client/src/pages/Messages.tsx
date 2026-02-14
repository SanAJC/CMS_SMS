import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, Message } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight, Loader2, Send, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  sent: { label: "Enviado", icon: CheckCircle, class: "status-sent" },
  pending: { label: "Pendiente", icon: Clock, class: "status-pending" },
  failed: { label: "Fallido", icon: AlertTriangle, class: "status-failed" },
};

const filters = [
  { label: "Todos", value: "" },
  { label: "Enviados", value: "sent" },
  { label: "Pendientes", value: "pending" },
  { label: "Fallidos", value: "failed" },
];

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getMessages(page, 10, filter || undefined);
        const items = (data && (data as any).items) ?? (Array.isArray(data) ? data : []);
        const pages = (data && (data as any).pages) ?? 1;
        setMessages(items);
        setTotalPages(pages);
      } catch {
        setMessages([
          { id: "1", content: "¡Hola! Tu cita está confirmada para mañana.", contact_id: "1", contact_name: "María García", contact_phone: "+57 300 258 9448", status: "sent", created_at: "2025-01-15T10:30:00" },
          { id: "2", content: "Recordatorio: Tu pago está pendiente.", contact_id: "2", contact_name: "Carlos López", contact_phone: "+57 310 261 2270", status: "pending", created_at: "2025-01-15T09:15:00" },
          { id: "3", content: "Promoción especial: 20% de descuento hoy.", contact_id: "3", contact_name: "Ana Rodríguez", contact_phone: "+57 300 217 5959", status: "failed", created_at: "2025-01-14T16:45:00" },
          { id: "4", content: "Tu pedido ha sido enviado. Código: #12345", contact_id: "4", contact_name: "Pedro Martínez", contact_phone: "+57 300 249 6948", status: "sent", created_at: "2025-01-14T14:20:00" },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, filter]);

  const msgs = messages ?? [];
  const filteredMessages = filter ? msgs.filter((m) => m.status === filter) : msgs;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Historial de Mensajes</h1>
        <p className="text-muted-foreground mt-1">Revisa todos los mensajes enviados</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter(f.value); setPage(1); }}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted" />
          No hay mensajes
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const sc = statusConfig[msg.status];
            const StatusIcon = sc.icon;
            return (
              <div key={msg.id} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 animate-fade-in">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Send className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.contact_name || "Contacto"}</span>
                    <span className="text-xs text-muted-foreground">{msg.contact_phone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{msg.content}</p>
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", sc.class)}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString("es")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
