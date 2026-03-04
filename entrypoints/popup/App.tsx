import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-w-[300px] min-h-[200px] p-6 bg-background text-foreground flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">YouTube Comment Exporter</h1>
      <p className="text-muted-foreground text-sm">
        Current theme: {dark ? 'Dark' : 'Light'}
      </p>
      <Button onClick={() => setDark(!dark)} variant="outline">
        {dark ? 'Switch to Light' : 'Switch to Dark'}
      </Button>
    </div>
  );
}

export default App;
