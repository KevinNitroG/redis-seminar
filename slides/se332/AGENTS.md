# Slidev for Redis

Written with Slidev.

For more information how to use, consider read `slidev` skill or using Context7 on `websites/sli_dev`

@./STORYBOARD.md is the storyboard, outline for the slides

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
  ecosystem/
    ...

  ...
... Other structure match slidev general structure
slides.md (source those inner slides.md)
```

- Those sub `slides.md` in each section will source the markdown files in the same folder
