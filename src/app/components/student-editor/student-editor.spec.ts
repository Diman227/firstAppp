import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditor } from './student-editor';

describe('StudentEditor', () => {
  let component: StudentEditor;
  let fixture: ComponentFixture<StudentEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
