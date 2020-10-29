# IOIO web

ioio web is a collection of systems for the Institute of Interactive Objects at Malmö University.

## Website

The website is built with Eleventy, a simple static site builder that does not get in the way.

To get started, open a terminal in the folder you cloned the repo and install the dependencies with `npm install` and then run the development server with `npm run dev`.

### Pages

```
---
layout: layouts/page.njk
tags:
  - nav
navtitle: About
title: About
---

## Hello

Heloo all
```

Each page is a .md (markdown) or .njk (nunjucks) file with some yaml frontmatter metadata. To make a new page you just make a new .md or .njk file in the `/src` folder. If you put it in a sub folder to src it will get reflected in the path to the new page on the site. If you want a custom path to the page you can add that to the frontmatter

## Getting Started

```bash
$ npm install -g firebase-tools
$ firebase login
```

## Testing

```bash
$ firebase serve
```

## Deployment

```bash
$ firebase deploy
```
