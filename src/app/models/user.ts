export class User{

  constructor(){
    this.id = null;
    this.username = '';
    this.password = '';
    this.surname = '';
    this.name = '';
    this.patronymic = '';
    this.role = '';
    this.groupId = null;
    }

  id: number | null;
  username: string;
  password: string;
  surname: string;
  name: string;
  patronymic: string;
  role: string;
  groupId: number | null;
}
