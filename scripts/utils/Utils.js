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

  export function formatDateForProfile(isoDateString) {
    const date = new Date(isoDateString);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

export function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');


    let formatted = '+7 ';
    if (cleaned.length > 1) {
      formatted += '(' + cleaned.slice(1, 4);
    }
    if (cleaned.length > 4) {
      formatted += ') ' + cleaned.slice(4, 7);
    }
    if (cleaned.length > 7) {
      formatted += '-' + cleaned.slice(7, 9);
    }
    if (cleaned.length > 9) {
      formatted += '-' + cleaned.slice(9, 11);
    }

    return formatted;
  }

  export function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }