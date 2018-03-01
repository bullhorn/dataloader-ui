import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadHeaderComponent } from './load-header.component';

describe('LoadHeaderComponent', () => {
  let component: LoadHeaderComponent;
  let fixture: ComponentFixture<LoadHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadHeaderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
