---
name: slide
description: Styleguide while creating Slidev slides for Redis. Must read when starting to create slides.
---

# Slidev Style Guide

## General guidelines

- Write less words, more diagrams, code snippets, and images
- Avoid using animation like in bullet points. Just use for command codeblocks or important points
- Use `academy` theme, read from [Academy Theme](https://raw.githubusercontent.com/alexanderdavide/slidev-theme-academic/refs/heads/master/README.md)
- For pages with layout center, use
  ```
  layout: center
  class: text-center
  transition: slide-up
  ```
- Other content page don't use transition, use `hideInToc: true`
- Two column layout use `layout: two-cols-header` or `layout: two-cols` with `layoutClass: gap-8`
- Avoid long content, consider splitting into multiple pages
- Add source URLs into slide for reference
- Each slide should have slidev `presenter notes` for main ideas in bullets
- For those slides with image fullscreen (benchmark,...), use `layout: figure` from `academy` theme

## Resources

- Icon resource can taken from this `https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/{TECHNOLOGY}.svg`
  > Replace `{TECHNOLOGY}` (e.g. `redis`, `valkey`)

## Templates

- For redis command introduction, read [Command Template](assets/command_template.md)
  > Use syntax `sh` for redis command code blocks
