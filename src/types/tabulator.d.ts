declare module 'tabulator-tables' {
  export class TabulatorFull {
    constructor(element: HTMLElement | string, options: any);
    setData(data: any[]): void;
    setGroupBy(field: string): void;
    setGroupHeader(callback: (value: any, count: number, data: any[], group: any) => string): void;
    destroy(): void;
  }
  
  export interface RowComponent {
    getData(): any;
    getElement(): HTMLElement;
  }
  
  export interface CellComponent {
    getValue(): any;
    getData(): any;
    getRow(): RowComponent;
  }
}
