[![Build Status](https://travis-ci.org/mshogren/mshogren.github.io.svg?branch=master)](https://travis-ci.org/mshogren/mshogren.github.io)

My blog written using [Jekyll](http://jekyllrb.com)

```
gem install jekyll bundler
bundle exec jekyll serve --host 0.0.0.0
```

Some of the UI is based on the bootstrap framework but I didn't want the dependency on the whole set of libraries and jQuery.  The steps I used to remove the dependencies are more or less repeatable.
The bootstrap assets were downloaded and distributed to the `_sass_` and `font` folders.

`_includes/styles.scss` was created by loading bootstrap.css and then removing everything that wasn't used according to the Chrome Web Dev tools coverage analysis.

`_includes/syntax.scss` was generated using the following command

```
rougify style github
```

`js/bs-components.min.js` was generated using the following command from the bootstrap.native project

```
npm run build
```
