import { Group } from "./group";

export class Teacher {

constructor(){
    this.id = null;
    this.surname = '';
    this.name = '';
    this.patronymic = '';
    this.groupsOfStudents = new Array();
    }

  id: number | null;
  surname: string;
  name: string;
  patronymic: string;
  groupsOfStudents: Array<Group> | null;
}
