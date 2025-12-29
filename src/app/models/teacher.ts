import { Group } from "./group";

export class Teacher {

constructor(){
    this.id = null;
    this.surname = '';
    this.name = '';
    this.patronymic = '';
    this.teacherGroups = new Array();
    }

  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  teacherGroups: Array<Group> | null;
}
