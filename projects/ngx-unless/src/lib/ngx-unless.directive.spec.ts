import { TestBed } from '@angular/core/testing';
import { NgUnlessDirective } from './ngx-unless.directive';
import { Component, NO_ERRORS_SCHEMA, ViewContainerRef, EmbeddedViewRef, TemplateRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  template: `
    <ng-container *ngxUnless="false; then thenRef; else elseRef"></ng-container>
    <ng-container *ngxUnless="true; then thenRef; else elseRef">Alien exists</ng-container>
    <ng-container *ngxUnless="false">
      <p>Alien exists</p>
    </ng-container>
    <ng-template #thenRef>
      <p>Templated Alien Exists</p>
    </ng-template>
    <ng-template #elseRef>
      <p>Templated Else Alien does not Exists</p>
    </ng-template>
  `,
})
class TestComponent {}

describe('NgUnlessDirective', () => {
  let fixture;
  let results;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TestComponent, NgUnlessDirective],
      providers: [NgUnlessDirective, ViewContainerRef, EmbeddedViewRef, TemplateRef],
      schemas: [NO_ERRORS_SCHEMA],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    results = fixture.debugElement.queryAll(By.css('p'));
  });

  it('should be created', () => {
    const directive: NgUnlessDirective = TestBed.get(NgUnlessDirective);
    expect(directive).toBeTruthy();
  });

  it('should be 2 results"', () => {
    expect(results.length).toBe(3);
  });

  it('first should display then template"', () => {
    // given
    const [thenTemplate] = results;
    // when
    const text = thenTemplate.nativeElement.textContent.trim();
    // then
    expect(text).toEqual('Templated Alien Exists');
  });

  it('first should display else template"', () => {
    // given
    const [, elseTemplate] = results;
    // when
    const text = elseTemplate.nativeElement.textContent.trim();
    // then
    expect(text).toEqual('Templated Else Alien does not Exists');
  });

  it('first should display work without template"', () => {
    // given
    const [, , noTemplate] = results;
    // when
    const text = noTemplate.nativeElement.textContent.trim();
    // then
    expect(text).toEqual('Alien exists');
  });
});
