## Command Template

For introducing Redis commands slides, use the following template

### Slides

- First slide showing command syntax image: `https://redis.io/docs/latest/images/railroad/[COMMAND].svg`
  > Replace [COMMAND] with the actual command name, e.g. `SET`, `HGETALL`, etc.
- Create a code snippet with sample below in `snippets/[NAME]` (file have no extension)

  ```
  127.0.0.1:6379> [COMMAND 1]
  [OUTPUT 1]

  127.0.0.1:6379> [COMMAND 2]
  [OUTPUT 2]
  ```

- Import into slide, showing each command block one by one
  ```
  <<< @/snippets/[NAME] {1-2}
  ```
- Next slide showing first line to next command block until all command blocks are shown
