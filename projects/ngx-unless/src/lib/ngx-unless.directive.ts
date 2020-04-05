import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  Input,
  EmbeddedViewRef,
  ɵstringify as stringify,
} from '@angular/core';

/**
 * @publicApi
 */
export class NgxUnlessContext<T = any> {
  public $implicit: T = null!;
  public ngxUnless: T = null!;
}

@Directive({
  selector: '[ngxUnless]',
})
export class NgUnlessDirective<T = any> {
  private _context: NgxUnlessContext<T> = new NgxUnlessContext<T>();
  private _thenTemplateRef: TemplateRef<NgxUnlessContext<T>> | null = null;
  private _elseTemplateRef: TemplateRef<NgxUnlessContext<T>> | null = null;
  private _thenViewRef: EmbeddedViewRef<NgxUnlessContext<T>> | null = null;
  private _elseViewRef: EmbeddedViewRef<NgxUnlessContext<T>> | null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgxUnlessContext<T>>) {
    this._thenTemplateRef = templateRef;
  }

  /**
   * The Boolean expression to evaluate as the condition for showing a template.
   */
  @Input()
  set ngxUnless(condition: T) {
    this._context.$implicit = this._context.ngxUnless = condition;
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to true.
   */
  @Input()
  set ngxUnlessThen(templateRef: TemplateRef<NgxUnlessContext<T>> | null) {
    assertTemplate('ngxUnlessThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null; // clear previous view if any.
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to false.
   */
  @Input()
  set ngxUnlessElse(templateRef: TemplateRef<NgxUnlessContext<T>> | null) {
    assertTemplate('ngxUnlessElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null; // clear previous view if any.
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
        }
      }
    } else {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        }
      }
    }
  }
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}
