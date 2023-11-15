export function translateSchedulesStatus(status: string) {
  const statusProps: Record<string, string> = {
    scheduled: "Agendados",
    confirmed: "Confirmados",
    awaiting_service: "Aguard. Atend.",
    attend: "Em Atendimento",
    finished: "Finalizados",
    canceled: "Cancelados",
  };

  return statusProps[status];
}
