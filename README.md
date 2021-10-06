# Dev Portal - dev.hashicorp.com

> 🚧 This project is in pre-alpha phase.

For background information on this project, refer to [[MKTG-034]](https://docs.google.com/document/d/1ASyBOCWWP8VUahbL5c5y0qrDMgqhYdXJ2h15xzh3JtA/edit#heading=h.spiwwyows3cr).

To track the progress of this project, refer to the [Dev Portal Asana Portfolio](https://app.asana.com/0/portfolio/1200682159451359/list) and join [#proj-dev-portal](https://hashicorp.slack.com/archives/C01KCU4HDPY) on slack.

## Getting Started

Welcome to the HashiCorp Developer Portal! This is the home for HashiCorp product reference documentation, along with all other kinds of content for our practitioners.

## Local Development

If you're developing in this repository, get started by running:

```
npm install
npm start
```

This will give you a development server running on [localhost:3000](http://localhost:3000).

### Testing

We use [jest](https://jestjs.io/) to write unit tests for our code. We also have [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) integrated for writing tests against our rendered React components.

To run tests:

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```

### Component Organization

In order to create some structure and consistency throughout this project, we're creating some light guidelines around where certain components should live. We have three top-level folders which should house components:

```
src/
  components/
  views/
  layouts/
  hooks/
```

- **`components`** - Shareable, smaller components for use across any number of other components
- **`views`** - Componentry which represents a full site "view." This is a way to abstract out page components and easily co-locate related code. Not necessarily intended for re-use, unless one needs to render the same view on multiple pages. This also allows us to co-locate sub-components and test files with page components, which is otherwise difficult with file-based routing
- **`layouts`** - Layout components which are generic and possibly used across different pages (see [Next.js docs](https://nextjs.org/docs/basic-features/layouts#per-page-layouts))
- **`hooks`** - Shared hooks which are applicable for use across a variety of other components

An example implementation of components laid out this way:

```tsx
// pages/some/page.tsx
import SomePageView from 'views/some-page'
import SomeLayout from 'layouts/some-layout'

// if we need to adjust props, can wrap this to make any changes necessary
const SomePage = SomePageView
SomePage.layout = SomeLayout

export default SomePage
```

## Documentation Content

Documentation for each product is sourced from its respective product repository, and served via Digital's [content API](https://github.com/hashicorp/mktg-content-workflows/#get-apicontentproductfullpath)
