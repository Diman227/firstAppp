import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditUser } from './dialog-edit-user';

describe('DialogEditUser', () => {
  let component: DialogEditUser;
  let fixture: ComponentFixture<DialogEditUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
