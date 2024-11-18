import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLotsComponent } from './parking-lots.component';

describe('ParkingLotsComponent', () => {
  let component: ParkingLotsComponent;
  let fixture: ComponentFixture<ParkingLotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingLotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParkingLotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
