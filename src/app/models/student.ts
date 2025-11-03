export class Student{
  constructor(){
    this.id = null;
    this.name = '';
    this.surname = '';
    this.patronymic = '';
    this.group = '';
    this.phoneNumber = '';
  }
  static idCounter: number = 3;
  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  group: string;
  phoneNumber: string;
}
