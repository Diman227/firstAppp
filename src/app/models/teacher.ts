import { Group } from "./group";

export class Teacher {

constructor(){
    this.id = null;
    this.surname = '';
    this.name = '';
    this.patronymic = '';
    this.role = "TEACHER";
    this.teacherGroups = new Array();
    }

  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  role: string;
  teacherGroups: Array<Group> | null;
}
