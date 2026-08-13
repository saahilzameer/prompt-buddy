const now = new Date();
const days = {};
for (let i = 29; i >= 0; i--) {
  const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
  const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  days[formattedDate] = { users: 0, matches: 0, name: formattedDate };
}
console.log(Object.values(days).slice(0, 3));
