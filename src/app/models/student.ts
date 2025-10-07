export class Student{
  constructor(){
    this.id = null;
    this.name = '';
    this.surname = '';
  }
  static idCounter: number = 3;
  id: number | null;
  name: string;
  surname: string;
}
