import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PhoneMockup from "@/components/PhoneMockup";
import { api, Contact } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewMessage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getContacts(1, 100);
        const items = (data && (data as any).items) ?? (Array.isArray(data) ? data : []);
        setContacts(items);
      } catch {
        setContacts([
          { id: "1", name: "María García", phone: "+57 300 258 9448", created_at: "" },
          { id: "2", name: "Carlos López", phone: "+57 310 261 2270", created_at: "" },
          { id: "3", name: "Ana Rodríguez", phone: "+57 300 217 5959", created_at: "" },
          { id: "4", name: "Pedro Martínez", phone: "+57 300 249 6948", created_at: "" },
          { id: "5", name: "Laura Sánchez", phone: "+57 311 261 6292", created_at: "" },
        ]);
      }
    }
    load();
  }, []);

  const selectedContactData = contacts?.find?.((c) => c.id === selectedContact);
  const charCount = content.length;
  const maxChars = 160;

  const handleSend = async () => {
    if (!selectedContact || !content.trim()) {
      toast({ title: "Error", description: "Selecciona un contacto y escribe un mensaje", variant: "destructive" });
      return;
    }
    if (content.length > maxChars) {
      toast({ title: "Error", description: `El mensaje no puede exceder ${maxChars} caracteres`, variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await api.sendMessage(content, selectedContact);
      setSent(true);
      toast({ title: "¡Mensaje enviado!", description: `SMS enviado a ${selectedContactData?.name}` });
      setTimeout(() => {
        setContent("");
        setSelectedContact("");
        setSent(false);
      }, 3000);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo enviar el mensaje", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nuevo Mensaje</h1>
        <p className="text-muted-foreground mt-1">Redacta y envía un mensaje SMS</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-6">
          <div className="rounded-xl bg-card p-6 border border-border/50 shadow-sm space-y-5">
            <div className="space-y-2">
              <Label>Destinatario</Label>
              <Select value={selectedContact} onValueChange={setSelectedContact}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un contacto" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mensaje</Label>
                <span className={`text-xs ${charCount > maxChars ? "text-destructive" : "text-muted-foreground"}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <Textarea
                placeholder="Escribe tu mensaje SMS aquí..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSend}
              disabled={sending || !selectedContact || !content.trim() || sent}
            >
              {sent ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  ¡Enviado!
                </>
              ) : sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Phone preview */}
        <div className="flex justify-center lg:justify-start">
          <div className="sticky top-8">
            <p className="text-sm font-medium text-muted-foreground mb-4 text-center">Vista previa</p>
            <PhoneMockup
              message={content}
              contactPhone={selectedContactData?.phone || "SMS"}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
