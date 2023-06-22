// localStorage
export function setLocalStorage(key: string, value: string): void {
  window.localStorage.setItem(key, value);
}

export function getLocalStorage(key: string): string | null {
  return window.localStorage.getItem(key);
}

export function formatLog(logStr: string): void {
  console.log(`[Bilibili Random Play]: ${logStr}`);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}