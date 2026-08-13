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
  const schedule: any[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    if (config.daysOfWeek.includes(dayOfWeek)) {
      const slots: string[] = [];
      let currentMin = timeToMin(config.startTime);
      const endMin = timeToMin(config.endTime);
      const duration = config.slotDuration;
      const interval = config.minInterval || 0;
      while (currentMin + duration <= endMin) {
        const slotStart = currentMin;
        const slotEnd = currentMin + duration;
        let isDuringBreak = false;
        if (config.breaks.lunch.active) {
          const lStart = timeToMin(config.breaks.lunch.start);
          const lEnd = timeToMin(config.breaks.lunch.end);
          if (!(slotEnd <= lStart || slotStart >= lEnd)) isDuringBreak = true;
        }
        if (config.breaks.snack.active) {
          const sStart = timeToMin(config.breaks.snack.start);
          const sEnd = timeToMin(config.breaks.snack.end);
          if (!(slotEnd <= sStart || slotStart >= sEnd)) isDuringBreak = true;
        }
        if (!isDuringBreak) slots.push(minToTime(currentMin));
        currentMin += duration + interval;
      }
      if (slots.length > 0) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const label = `${labels[dayOfWeek]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        schedule.push({ date: dateStr, label: label, slots: slots });
      }
    }
  }
  return schedule;
};
