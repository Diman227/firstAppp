import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGroup } from './dialog-group';

describe('DialogGroup', () => {
  let component: DialogGroup;
  let fixture: ComponentFixture<DialogGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
