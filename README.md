# Nopalws

## ngx-unless

Angular library which is the opposite to `*ngIf`, it also preserves the same context

```html
<p>*ngxUnless="Conditions.falsy; then thenRef; else elseRef"> Alien exists</p>
```

Positive statements enhance readability so instead of doing `*ngIf="!isReady"` you use `*ngxUnless="isReady`.

> This Directive is an opposite version of ngIf, code of ngIf directive was taken as base to make this version.
