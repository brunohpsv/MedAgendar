export const timeToMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const minToTime = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
};

export const generateScheduleFromConfig = (config: any) => {
  if (!config) return [];
  const schedule: any[] = [];
  const today = new Date();
  const daysOfWeek = config.daysOfWeek || [];
  const specificDates = config.specificDates || [];

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayNum = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;

    const isDayOfWeekMatch = daysOfWeek.includes(dayOfWeek);
    const isSpecificDateMatch = specificDates.includes(dateStr);

    if (isDayOfWeekMatch || isSpecificDateMatch) {
      const slots: string[] = [];
      let currentMin = timeToMin(config.startTime || "08:00");
      const endMin = timeToMin(config.endTime || "18:00");
      const duration = config.slotDuration || 30;
      const interval = config.minInterval || 0;
      while (currentMin + duration <= endMin) {
        const slotStart = currentMin;
        const slotEnd = currentMin + duration;
        let isDuringBreak = false;
        if (config.breaks?.lunch?.active) {
          const lStart = timeToMin(config.breaks.lunch.start || "12:00");
          const lEnd = timeToMin(config.breaks.lunch.end || "13:30");
          if (!(slotEnd <= lStart || slotStart >= lEnd)) isDuringBreak = true;
        }
        if (config.breaks?.snack?.active) {
          const sStart = timeToMin(config.breaks.snack.start || "16:00");
          const sEnd = timeToMin(config.breaks.snack.end || "16:30");
          if (!(slotEnd <= sStart || slotStart >= sEnd)) isDuringBreak = true;
        }
        if (!isDuringBreak) slots.push(minToTime(currentMin));
        currentMin += duration + interval;
      }
      if (slots.length > 0) {
        const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const label = `${labels[dayOfWeek]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        schedule.push({ date: dateStr, label: label, slots: slots });
      }
    }
  }
  return schedule;
};
