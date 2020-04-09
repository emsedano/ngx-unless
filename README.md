# Nopalws

## ngx-unless

Angular library which is the opposite to `*ngIf`, it also preserves the same context

```html
<p *ngxUnless="Conditions.falsy; then thenRef; else elseRef"> Alien exists</p>

<!-- assuming ->
<ng-template #thenRef>Templated Alien exists<ng-template>
<ng-template #elseRef>Else Alien DOES NOT exists<ng-template>
```

Since falsy evaluated condition will be using the thenRef, then your you might get as output will be
> Templated Alien Exists

**please note** if we didn't get `Alien exits` (the text inside the `<p>` tag is because we added the `then` context. that means if we don't provide then context like:
```html
<p *ngxUnless="Conditions.falsy"> Alien exists</p>
```

Then the output will be
> Alien exists

Therefore
> This Directive is an opposite version of ngIf, code of ngIf directive was taken as base to make this version.


Positive statements enhance readability so instead of doing `*ngIf="!isReady"` you use `*ngxUnless="isReady`


