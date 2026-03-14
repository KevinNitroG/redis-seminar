---
name: slide
description: Styleguide while creating Slidev slides for Redis. Must read when starting to create slides.
---

# Slidev Style Guide

## General guidelines

- Write less words, more diagrams, code snippets, and images
- Avoid using animation (v-clicks,...), especially like in bullet points (show all immediately). Just use for command codeblocks or important points
- Avoid using deep custom script, css, html (custom div, span), try to be simple
- Use `academic` theme, read from [Academic Theme](./assets/academic-theme-usage.md) and [Academic Example](./assets/academic-example.md)
- For pages with layout center (transition slide, introduce next section, intro slide,...), use
  ```
  layout: center
  class: text-center
  transition: slide-up
  ```
- Other content page don't use transition, use `hideInToc: true`
- Two column layout use `layout: two-cols-header` or `layout: two-cols` with `layoutClass: gap-8`, don't manually using div
- Avoid long content, consider splitting into multiple pages
- Add source URLs into slide for reference
- Don't adding images into a slide that already has a lot of content, consider splitting into multiple pages or use `layout: figure` to make image fullscreen
- Each main content slide should have slidev `presenter notes` for main ideas in bullets. Skip for not important slides (transition, intro, conclusion,...)
- For those slides with image fullscreen (benchmark,...), use `layout: figure` from `academic` theme
- Each markdown files in each sections may contains multiple slidev pages, not need one page per file
- Each slidev page should be concise, brief, 1 or 2 purposes, avoid putting too much content into one page
- Each inner markdown file's header need to be smaller than outer. For example the header of `what.md` should be `##` since the header of `slides.md` is `#`
- Avoid using emoji in slide content, headers
- Don't number filename or folder name

## Resources

- Icon resource can taken from this `https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/{TECHNOLOGY}.svg`
  > Replace `{TECHNOLOGY}` (e.g. `redis`, `valkey`)

## Templates

- For redis command introduction, read [Command Template](references/command_template.md)
  > Use syntax `sh` for redis command code blocks
