import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioManagementComponent } from './horario-management.component';

describe('HorarioManagementComponent', () => {
  let component: HorarioManagementComponent;
  let fixture: ComponentFixture<HorarioManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
