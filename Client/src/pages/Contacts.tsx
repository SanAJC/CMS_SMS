import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, Contact } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, User, Phone, Mail, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getContacts(page, 10);
      const items = (data && (data as any).items) ?? (Array.isArray(data) ? data : []);
      const pages = (data && (data as any).pages) ?? 1;
      const totalCount = (data && (data as any).total) ?? items.length;
      setContacts(items);
      setTotalPages(pages);
      setTotal(totalCount);
    } catch {
      // demo data
      setContacts([
        { id: "1", name: "María García", phone: "+57 300 258 9448", email: "maria@example.com", created_at: "2025-01-15" },
        { id: "2", name: "Carlos López", phone: "+57 310 261 2270", email: "carlos@example.com", created_at: "2025-01-14" },
        { id: "3", name: "Ana Rodríguez", phone: "+57 300 217 5959", email: "ana@example.com", created_at: "2025-01-13" },
        { id: "4", name: "Pedro Martínez", phone: "+57 300 249 6948", email: "pedro@example.com", created_at: "2025-01-12" },
        { id: "5", name: "Laura Sánchez", phone: "+57 311 261 6292", email: "laura@example.com", created_at: "2025-01-11" },
      ]);
      setTotal(5);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast({ title: "Error", description: "Solo se permiten archivos CSV", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const result = await api.uploadContacts(file);
      toast({ title: "¡Éxito!", description: `${result.uploaded} contactos importados` });
      loadContacts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const filtered = contacts.filter((c) =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-muted-foreground mt-1">{total} contactos en total</p>
        </div>
        <label>
          <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
          <Button asChild variant="default" disabled={uploading}>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Subir CSV
            </span>
          </Button>
        </label>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contacto..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className={cn("flex-1 space-y-2", selectedContact && "hidden lg:block")}>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No se encontraron contactos</div>
          ) : (
            filtered.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 text-left transition-all hover:shadow-sm",
                  selectedContact?.id === contact.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </button>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Detail */}
        {selectedContact && (
          <div className="w-full lg:w-96 rounded-xl bg-card p-6 border border-border/50 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Detalle del contacto</h3>
              <button onClick={() => setSelectedContact(null)} className="lg:hidden">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold">{selectedContact.name}</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium">{selectedContact.phone}</p>
                </div>
              </div>
              {selectedContact.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedContact.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Registrado</p>
                  <p className="text-sm font-medium">{new Date(selectedContact.created_at).toLocaleDateString("es")}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
