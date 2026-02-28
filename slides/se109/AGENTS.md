# Slidev for Redis

Written with Slidev.

For more information how to use, consider read `slidev` skill or using Context7 on `websites/sli_dev`

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
  datatype-command/
    slides.md (entrypoint)
    ... (markdown files)
  ...
... Other structure match slidev general structure
slides.md (source those inner slides.md)
```

- Don't number filename or folder name
- Those sub `slides.md` in each section will source the markdown files in the same folder
- Each markdown files in each sections may contains multiple slidev pages, not need one page per file
- Each inner markdown file's header need to be smaller than outer. For example the header of `what.md` should be `##` since the header of `slides.md` is `#`
