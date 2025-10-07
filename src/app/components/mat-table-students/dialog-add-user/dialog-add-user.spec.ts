import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddUser } from './dialog-add-user';

describe('DialogAddUser', () => {
  let component: DialogAddUser;
  let fixture: ComponentFixture<DialogAddUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
