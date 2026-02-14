import { MoreVertical, ChevronLeft } from "lucide-react";

interface PhoneMockupProps {
  message: string;
  contactPhone?: string;
}

export default function PhoneMockup({ message, contactPhone = "890720" }: PhoneMockupProps) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="phone-mockup">
      <div className="phone-screen flex flex-col">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-8 pb-2">
          <span className="text-[10px] font-medium text-muted-foreground">{timeStr}</span>
          <div className="flex gap-1">
            <div className="w-3 h-2 rounded-sm bg-muted-foreground/40" />
            <div className="w-3 h-2 rounded-sm bg-muted-foreground/40" />
            <div className="w-4 h-2 rounded-sm bg-primary" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-sm flex-1">{contactPhone}</span>
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Date */}
        <div className="text-center py-3">
          <span className="text-[10px] text-muted-foreground">{dateStr}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 pb-4">
          {message.trim() ? (
            <div className="sms-bubble">
              {message}
              <div className="text-right mt-1">
                <span className="text-[9px] text-muted-foreground">{timeStr}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-muted-foreground text-center">
                Escribe un mensaje para ver la vista previa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
