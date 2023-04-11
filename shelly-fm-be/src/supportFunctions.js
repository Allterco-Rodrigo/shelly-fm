
export function yesterday(date) {
    const yesterdayDate = new Date(date);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const year = String(yesterdayDate.getFullYear());
    const month = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
    const day = String(yesterdayDate.getDate()).padStart(2, '0');
    return { year: year, month: month, day: day };
  }

export function presentDate() {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return { year: year, month: month, day: day };
  }

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  