# Ember app to addon component migration

## What does it do?

It takes the contents of the source directory you specify in the first argument. This must point to a directory inside the `app/components` directory of an Ember application.

It duplicates all components in that directory into the ember addon whose path is specifed in the second argument. It will include all levels of nested directories and their components. It creates the js and hbs files in the `addon` directory, as well as the js file in the `app` directory. It also adds the necessary layout import and app export statements, required for components to be made available for the consuming Ember application to use.

It takes an optional third argument- the the path within the addon's components directory. The nested directories that correspond to the path specified will be created if they do not already exist.

## Usage

`npm install`

`node move-components-from-app-to-addon [path-to-ember-app-component-directory] [path-to-root-of-ember-addon] [path-within-addons-components-directory]`

node move-components-from-app-to-addon ../../../../hyraxbio/hyrax_admin_frontend/app/components/blocks/generic/ ../../../../Documents/development/ember-addons/ember-interactive-table/ / 

## Example

You have an Ember app named `my-ember-app` and an Ember addon named `ember-form-controls`.

You want move all of the components in `my-ember-app/app/components/form-controls` into the addon `ember-form-controls`, at the path `components/widgets/tools/form-controls.`

`node move-components-from-app-to-addon my-ember-app/app/components/form-controls ember-form-controls widgets/tools/form-controls`

# Ember addon component renaming

## What does it do?

It simply updates the paths of the specified files to the specified new paths. It also updates the import statements in the addon component file as well as the app component file.

It accepts either a directory path, or a file path. When passing a file path, the file extension must be omitted.

## Usage

`node rename-addon-component [path-to-addon-root-directory] [path-to-addon-components-to-be-moved] [new-path-for-components]`

Note that `path-to-addon-components-to-be-moved` and `new-path-for-components` are both relative to the components directory.

## Example

You have an Ember addon named `ember-form-controls`, and you want to move everything in `components/form-controls` to `components/widgets/tools/form-controls`.

`node rename-addon-component ember-form-controls form-controls widgets/tools/form-controls`

node rename-addon-component ember-form-controls form-controls widgets/tools/form-controls

node rename-addon-component ../../../../hyraxbio/ember-upgrades/hyrax-ember-assets hyrax-ember-assets/exatype/sars-cov-2 hyrax-ember-assets/exatype/sars-cov-two

addon/components/hyrax-ember-assets/exatype/ngs/jobs/new/samples-list/samples-list.js
/Users/andrewpaterson/hyraxbio/ember-addons/hyrax-ember-assets/addon/templates/components/hyrax-ember-assets/exatype/ngs/jobs/new/samples-list

# Prefix vars

TODO - ignore glob for replace doesn't work.

`node prefix-vars path-to-vars-object target-directory-path`

node prefix-vars /Users/andrewpaterson/hyraxbio/ember-upgrades/exatype-sanger-ui/tests/element-selectors/general.js /Users/andrewpaterson/hyraxbio/ember-upgrades/exatype-sanger-ui/tests generalSelectors

# Prune test files

Moves test files comprised only of the Ember boilerplate to a directory named `pruned-tests` at the root of the project directory.

`node prune-component-test-files path-to-ember-project`

node prune-component-test-files /Users/andrewpaterson/hyraxbio/ember-addons/hyrax-ember-assets


# Serialise JSON API to Mirage Fixture

node serialise-json-api-to-mirage-fixture ./trash-2.json ./out.json