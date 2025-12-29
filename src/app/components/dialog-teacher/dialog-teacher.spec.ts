import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTeacher } from './dialog-teacher';

describe('DialogTeacher', () => {
  let component: DialogTeacher;
  let fixture: ComponentFixture<DialogTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTeacher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
