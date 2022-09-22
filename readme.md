## Set up

This a basic [Vite](https://vitejs.dev/) app react/typescript flavor, so after cloning  
just `cd to folder project` then run `npm install` and `npm run dev`  
to have the dev server running

## Polymorphic React Components

Since I came across these components in libraries like chakra ui and react bootstrap,  
I was curious about this component that accepts this "as" property or  
other name like "element" or "component" to allow the user to render a custom element,  
I procrastinated researching this until I came across this article:  
[– How to Build Strongly Typed Polymorphic Components](https://www.freecodecamp.org/news/build-strongly-typed-polymorphic-components-with-react-and-typescript/) by author [Emmanuel Ohans](https://twitter.com/OhansEmmanuel)

So with this project, what I'll try to do is an implementation of some tricks I learned  
from reading 👆️ that article.

### Starting from common ground

Having a _reusable_ React component(Typescript):

```tsx
type MyComponentProps = {....}
const MyComponent = (props:PropsWithChildren<MyComponentProps>) => {
  const {children,...restButtonProps} = props
  return (
    <button {...restButtonProps}>
      {children}
    </button>
  )
}
```

This Function component will return a **ReactElement** that finally renders  
the **button** element(jsx) into the corresponding DOM element, that all cool right  
But **what if** you really want to provide your users with a **flexible**, **reusable**
component.  
What if you let the user decide whether the rendered DOM node will be an "a" a "p" or  
any other native DOM element that fits the user's context instead of your choice(button)?

_This is the functionality that will be provided by a polymorphic component_

In the React neighborhood slang, a **polymorphic** is a component that can be rendered  
with a list of different container elements.

I've personally encountered such components in my daily work with UI libraries  
like [Chakra UI](https://chakra-ui.com/) and [React-Bootstrap](https://react-bootstrap.github.io/).
<br />
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/pt00bqb.png" style="max-width:600px"  />
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/vl10bip.png" style="max-width:600px"  />
<br />

<details>
  <summary>
    Version 0: Basic Start
  </summary>

```ts
type PolyButtonV0Props = {
  as: any;
};
const PolyButtonV0 = ({ as, children }: PropsWithChildren<PolyButtonV0Props>) => {
  const PolyButton = as ?? "button";
  return <PolyButton>{children}</PolyButton>;
};
```

notice:

- Here the "as" prop let user to pass the element of choice: "div","p","a"...
- "as" prop isn't rendered directly we used a capitalised var (jsx rules);

**Implementation:**
`src/App.tsx`

```tsx
function App() {
  return (
    <div className="App">
      <PolyButtonV0 as="div">Poly as div</PolyButtonV0>
      <PolyButtonV0 as="a">Poly as anchor</PolyButtonV0>
    </div>
  );
}
```

render this:
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/6g00fyo.png" style="max-width:600px" />
<br />
Apparently it's ok... pass "div" renders `<div>`, pass "a" renders `<a>`  
but when you start playing with this find issues like:  
if pass a wrong html element like 'magic'

```tsx
<PolyButtonV0 as="magic">Poly as div</PolyButtonV0>
```

will render:
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/9800szd.png" style="max-width:600px" />
<br />
🥀 Not too promising...

No attribute support, e.g:
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/wt00urc.png" style="max-width:600px" />
<br />

</details>

<details >
  <summary>
    Version 1: Generic types
  </summary>

**New Requirements:**

- "as" prop should not receive invalid HTML Element strings
- Typescript types must detect incorrect attributes of valid elements

🤔 So **as** prop will only accept elements like: "div","p","a", so we can not know;
seems like type "unknown" will fit the bill  
meh, I pass "unknown" as Generic type:

<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/ww00yeq.gif"  />
<br />

React expects **C** to be an instance of `React.Element`, and C could be typed **React.ElementType**

```tsx
type PolyButtonV1Props<C extends ElementType> = {
  as?: C;
};
const PolyButtonV1 = <C extends ElementType>({ as, children }: PropsWithChildren<PolyButtonV1Props<C>>) => {
  const PolyButton = as ?? "button";
  return <PolyButton>{children}</PolyButton>;
};
```

That fix previous error 'does not have any construct or call signature'
and when the component is implemented, we got a **good intellisense**:

<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/be00ikr.gif"  />
<br />

- The prop string "as" will only accept valid HTML elements: "p", "h1", "a", etc and yells when  
  pass "fake" 🎉
- But if use as="a" href="https://....." typescript tell you that "href" props is not a valid prop

**Make component capable of take valid attributes**
Ok, what we need is our component to _accept the set of valid props based on "as" element selection_
React actually have a generic type named: **ComponentProps**  
If we check react `index.d.ts`:

```ts
/**
 * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
 * or ComponentPropsWithoutRef when refs are not supported.
 */
type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  T extends JSXElementConstructor<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};
```

As you can see, types docs recommend use **ComponentPropsWithoutRef** instead of **ComponentProps**
Do the refactor for that...

```tsx
type PolyButtonV1Props<C extends ElementType> = {
  as?: C;
} & ComponentPropsWithoutRef<C>;
const PolyButtonV1 = <C extends ElementType>({
  as,
  children,
  ...restProps
}: PropsWithChildren<PolyButtonV1Props<C>>) => {
  const PolyButton = as ?? "button";
  return <PolyButton {...restProps}>{children}</PolyButton>;
};
```

<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/oz003hv.gif"  />
<br />

Now our component only accepts valid elements for "as" prop and is aware of that "as"  
selection element props... Great!

If we don't pass the "as" property, our **PolyButtonV1** correctly creates a  
"button" element. but if we try passing an "href" attribute the component won't show any error, that's bad🙍🏽.  
The solution is quite simple, we just need to pass a generic type by default.

<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/w310lty.png"  />
<br />

Now 👀

<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/ub00lqg.gif"   />

Now we are talking... if no prop "as" is passed our component renders by default a "button" element...  
and of course, it will flag the error with any attribute that does not match that element. 🫁

</details>

<details >
  <summary>Version 2: Component must handle own props</summary>

**New Requirements:**

- The component must be able to handle its own props, such as color, in a type-safe way, of course.!

Let say our component will accept **color** prop. Color will be a pre-made list of colors
let say "primary" and "accent"

_small refactoring_
<br />
<img src="https://losormorpino-public-media.s3.us-east-2.amazonaws.com/8s00ea7.png"  />
<br />

An additional precaution: it is possible that some values that exist in **ComponentPropsWithoutRef<C>** also exist  
in the definition of the props type of our component.
Instead of relying on our **color** prop to override what's coming from ComponentPropsWithoutRef<C>, we better remove
any type that also exit in our component types definition.

So, guess what... another refactoring

```tsx
type PolyColor = "primary" | "accent";
type PolyButtonOwnProps<C extends ElementType> = { as?: C; color: PolyColor };
type PolyButtonV2Props<C extends ElementType> = PolyButtonOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;

const PolyButtonV2 = <C extends ElementType = "button">({
  as,
  children,
  style,
  color,
  ...restProps
}: PropsWithChildren<PolyButtonV2Props<C>>) => {
```

</details>

<details >
  <summary>Version 3: Make component reusable, work with any component</summary>

**New requirements: **

- If we want to make the component reusable, will need remove the **PolyButtonOwnProps**  
  and represent that with a generic, so anyone can pass in whatever component props they need

```tsx
type AsProp<C extends ElementType> = { as?: C };
type PolyButtonOwnProps<C extends ElementType, PassedProps = {}> = AsProp<C> & PassedProps;
type PolyButtonV3Props<C extends ElementType> = PropsWithChildren<PolyButtonOwnProps<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;

const PolyButtonV3 = <C extends ElementType = "button">({
  as,
  children,
  style,
  color,
  ...restProps
}: PolyButtonV3Props<C>) => {
```

Here we separate **AsProp** the type for "as" prop and **PassedProps** are the others props
passed to the component(besides as);

After refactoring you have:

```tsx
type AsProp<C extends ElementType> = { as?: C };
type PolyButtonOwnProps<C extends ElementType, PassedProps = {}> = AsProp<C> & PassedProps;
type PolyButtonV3Props<C extends ElementType, PassedProps = {}> = PropsWithChildren<
  PolyButtonOwnProps<C, PassedProps>
> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;

const PolyButtonV3 = <C extends ElementType = "button", PassedProps = {}>({
  as,
  children,
  style,
  color,
  ...restProps
}: PolyButtonV3Props<C, PassedProps>) => {
  const PolyButton = as ?? "button";
  const outStyle = color ? { ...style, color: color === "primary" ? "#058ed9" : "#df6066" } : style;
  return (
    <PolyButton style={outStyle} {...restProps}>
      {children}
    </PolyButton>
  );
};
```

Now if you build another component, you can give it Polymorphic powers like this:

**PolyButtonV3Props<C,MyNewComponentPropsType>**

</details>
