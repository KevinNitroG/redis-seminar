## Command Template

For introducing Redis commands slides, use the following template

### Slides

- First slide showing command syntax image: `https://redis.io/docs/latest/images/railroad/[COMMAND].svg`
  > Replace [COMMAND] with the actual command name, e.g. `SET`, `HGETALL`, etc.
  > Show for simple command only like (SET, GET, HGET, BITMAP, SADD...). For complex like redisjson, redisearch, skip this
- Create a code snippet with sample below in `snippets/[NAME]` (file have no extension)
  ```
  127.0.0.1:6379> [COMMAND 1]
  [OUTPUT 1]
  <breakline here>
  127.0.0.1:6379> [COMMAND 2]
  [OUTPUT 2]
  ```
  > Note that, if the command should fail, print the output as well
- Import into slide, showing each command block one by one
  ```
  <<< @/snippets/[NAME] {1-2}
  ```
- Next slide showing first line to next command block until all command blocks are shown

### Note

- Each command slide should contains about less than or equal to 4 command blocks, splitting into multiple slides if there are more than 4
