export class User {
  constructor() {
    this.id = User.idCounter++;
    this.name = '';
    this.username = '';
    this.email = '';
    this.address = { city: '', };
  }

  static idCounter: number = 11;
  id: number | null;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
  }
}
