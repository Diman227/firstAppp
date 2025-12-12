export class Student{
  constructor(){
    this.id = null;
    this.name = '';
    this.surname = '';
    this.patronymic = '';
    this.group = '';
  }
  static idCounter: number = 3;
  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  group: string;
}
