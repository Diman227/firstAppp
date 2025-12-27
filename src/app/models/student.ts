export class Student{
  constructor(){
    this.id = null;
    this.name = '';
    this.surname = '';
    this.patronymic = '';
    this.groupId = null;
  }
  static idCounter: number = 3;
  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  groupId: number | null;
}
