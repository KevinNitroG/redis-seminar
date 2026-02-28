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
    ... (markdown files)
  datatype-command/
    slides.md (entrypoint)
    ... (markdown files)
  ...
... Other structure match slidev general structure
slides.md (source those inner slides.md)
```

- Don't number filename or folder name
- Each markdown files in each sections may contains multiple slidev pages, not need one page per file
