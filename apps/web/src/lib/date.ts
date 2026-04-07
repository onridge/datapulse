export const getGreeting = (firstName: string) => {
  const hour = new Date().getHours();

  if (hour < 12) return `Good morning, ${firstName} 👋`;
  if (hour < 17) return `Good afternoon, ${firstName} 👋`;
  return `Good evening, ${firstName} 👋`;
};
