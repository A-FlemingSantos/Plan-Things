import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

export default function Calendario() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchAllItems();
  }, [userId]);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const planosRes = await api.get(`/planos/perfil/${userId}`);
      const planos = planosRes.data;

      const allEventos = [];
      const allTarefas = [];

      for (const plano of planos) {
        const listasRes = await api.get(
          `/listas/perfil/${userId}/plano/${plano.id}`
        );
        for (const lista of listasRes.data) {
          try {
            const eventosRes = await api.get(
              `/eventos/perfil/${userId}/lista/${lista.id}`
            );
            allEventos.push(
              ...eventosRes.data.map((e) => ({
                ...e,
                planoNome: plano.nome,
                listaNome: lista.nome,
              }))
            );
          } catch {
            // no events in this list
          }
          try {
            const tarefasRes = await api.get(
              `/tarefas/perfil/${userId}/lista/${lista.id}`
            );
            allTarefas.push(
              ...tarefasRes.data.map((t) => ({
                ...t,
                planoNome: plano.nome,
                listaNome: lista.nome,
              }))
            );
          } catch {
            // no tasks in this list
          }
        }
      }
      setEventos(allEventos);
      setTarefas(allTarefas);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const getItemsForDay = (day) => {
    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0);

    const dayEventos = eventos.filter((e) => {
      const start = new Date(e.dataInicio);
      const end = new Date(e.dataFim);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return dayDate >= start && dayDate <= end;
    });

    const dayTarefas = tarefas.filter((t) => {
      if (!t.dataConclusao) return false;
      const d = new Date(t.dataConclusao);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });

    return [
      ...dayEventos.map((e) => ({ ...e, _type: "evento" })),
      ...dayTarefas.map((t) => ({ ...t, _type: "tarefa" })),
    ];
  };

  const selectedItems = selectedDay ? getItemsForDay(selectedDay) : [];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Calendario</h2>
        <p className="text-muted-foreground mt-1">
          Visualize seus eventos e tarefas em um so lugar
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-[500px] glass rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="glass rounded-2xl border-white/20">
              <CardContent className="p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="rounded-xl hover:bg-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <h3 className="text-xl font-semibold">
                    {monthNames[month]} {year}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMonth}
                    className="rounded-xl hover:bg-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-muted-foreground py-2"
                    >
                      {d}
                    </div>
                  ))}

                  {/* Calendar Days */}
                  {calendarDays.map((day, idx) => {
                    if (!day)
                      return (
                        <div key={`empty-${idx}`} className="min-h-[80px]" />
                      );

                    const items = getItemsForDay(day);
                    const isToday =
                      today.getFullYear() === year &&
                      today.getMonth() === month &&
                      today.getDate() === day;
                    const isSelected = selectedDay === day;

                    return (
                      <div
                        key={day}
                        className={`min-h-[80px] p-1.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-primary/40 glass-strong shadow-glow-primary"
                            : "border-transparent hover:bg-white/10"
                        } ${isToday ? "bg-primary/10" : ""}`}
                        onClick={() =>
                          setSelectedDay(day === selectedDay ? null : day)
                        }
                      >
                        <span
                          className={`text-sm ${
                            isToday
                              ? "text-primary font-bold"
                              : "font-medium"
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {items.slice(0, 2).map((item, i) => (
                            <div
                              key={i}
                              className="text-[10px] leading-tight truncate rounded-md px-1 py-0.5"
                              style={{
                                backgroundColor:
                                  (item.cor || "#3B82F6") + "20",
                                color: item.cor || "#3B82F6",
                              }}
                            >
                              {item.nome}
                            </div>
                          ))}
                          {items.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{items.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Day Details */}
          <div>
            <Card className="glass rounded-2xl border-white/20 sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  {selectedDay
                    ? `${selectedDay} de ${monthNames[month]}`
                    : "Selecione um dia"}
                </h3>

                {selectedDay && selectedItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum evento ou tarefa neste dia.
                  </p>
                )}

                {!selectedDay && (
                  <div className="text-center py-8">
                    <div className="glass-subtle inline-flex p-4 rounded-2xl mb-3">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Clique em um dia do calendario para ver os detalhes
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl glass-subtle border border-white/10"
                      style={{
                        borderLeftColor: item.cor || "#3B82F6",
                        borderLeftWidth: "3px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {item._type === "evento" ? (
                          <CalendarIcon className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        )}
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full glass-subtle border-white/15"
                        >
                          {item._type === "evento" ? "Evento" : "Tarefa"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.planoNome}
                        </span>
                      </div>
                      <p className="font-medium text-sm mt-1">{item.nome}</p>
                      {item.descricao && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.descricao}
                        </p>
                      )}
                      {item._type === "evento" && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(item.dataInicio).toLocaleDateString(
                            "pt-BR"
                          )}{" "}
                          &mdash;{" "}
                          {new Date(item.dataFim).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                      {item._type === "tarefa" && item.dataConclusao && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Prazo:{" "}
                          {new Date(item.dataConclusao).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/50 mt-1">
                        Lista: {item.listaNome}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Legend */}
      {!loading && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-full">
            <CalendarIcon className="w-4 h-4 text-green-600" />
            <span>Eventos ({eventos.length})</span>
          </div>
          <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-full">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span>Tarefas ({tarefas.length})</span>
          </div>
        </div>
      )}
    </div>
  );
}
