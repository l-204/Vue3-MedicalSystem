function formatting(timeString:string){
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTime(list:[]) {
    list.forEach((item: { [x: string]: any; }) => {
        for (const key in item) {
            if (key.endsWith('_at')) {
            item[key] = formatting(item[key]);
            }
        }
  })
}