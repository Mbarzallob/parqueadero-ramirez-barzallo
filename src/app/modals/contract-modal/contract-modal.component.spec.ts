import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractModalComponent } from './contract-modal.component';

describe('ContractModalComponent', () => {
  let component: ContractModalComponent;
  let fixture: ComponentFixture<ContractModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
