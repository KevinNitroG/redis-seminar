# Slidev for Redis

Written with Slidev, managed with pnpm

For more information how to use, consider read `slidev` skill or using Context7 on `websites/sli_dev`

Storyboard, outline for the slides is in @./STORYBOARD.md

## Slidev Style Guide

Use skill `slide` or reading that skill in `./.agents/skills/slide/SKILL.md`

### Project Structure

```
pages/
  intro/
    slides.md (entrypoint)
    what.md
    history.md
    ... (markdown files)
  datatypes/
    slides.md (entrypoint)
    string.md
    set.md
    ... (markdown files)
  advanced/
    ...
  persistence/
    ...
  ecosystem/
    ...
  project/
    ...
  final/
    ...
  ...
... Other structure match slidev general structure
slides.md (source those inner slides.md)
```

- Those sub `slides.md` in each section will source the markdown files in the same folder
