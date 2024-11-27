import { router } from "../main.js";

export function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      router.handleRoute();
    } else {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      router.handleRoute();
    }
  }

export function formatDate(isoDateString) {
    const date = new Date(isoDateString);
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }