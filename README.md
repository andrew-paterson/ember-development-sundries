# Ember app to addon component migration

## What does it do?

It takes the contents of the source directory you specify in the first argument. This must point to a directory inside the `app/components` directory of an Ember application.

It duplicates all components in that directory into the ember addon whose path is specifed in the second argument. It will include all levels of nested directories and their components. It creates the js and hbs files in the `addon` directory, as well as the js file in the `app` directory. It also adds the necessary layout import and app export statements, required for components to be made available for the consuming Ember application to use.

It takes an optional third argument- the the path within the addon's components directory. The nested directories that correspond to the path specified will be created if they do not already exist.

## Usage

`mpm install`

`node index.js [path-ember-app-component-directory] [path-to-root-of-ember-addon] [path-within-addon's-components-directory]`

## Example

You have an Ember app named `my-ember-app` and an Ember addon named `ember-form-controls`.

You want move all of the components in `my-ember-app/app/components/form-controls` into the addon `ember-form-controls`, at the path `components/widgets/tools/form-controls.`

`node index.js my-ember-app/app/components/form-controls ember-0form-controls widgets/tools/form-controls`