## Command Template

For introducing Redis commands slides, use the following template

### Slides

### First

- show command syntax image: `https://redis.io/docs/latest/images/railroad/[COMMAND].svg`
  > Replace [COMMAND] with the actual command name, e.g. `set`, `hgetall`, etc (in lowercase)
  > Show for simple command only like (SET, GET, HGET, BITMAP, SADD...). For complex like redisjson, redisearch, skip this

### Second

#### Snippet

- Create a code snippet with sample below in `snippets/[NAME]` (file have no extension)

  ```
  127.0.0.1:6379> [COMMAND 1]
  [OUTPUT 1]

  127.0.0.1:6379> [COMMAND 2]
  [OUTPUT 2]
  ```

  > Note that, if the command should fail, print the output as well

Example:

```snippets/string-basic
127.0.0.1:6379> SET course:SE332.Q21 "Chuyên đề CSDL nâng cao" EX 3600 NX
OK

127.0.0.1:6379> GET course:SE332.Q21
"Chuyên đề CSDL nâng cao"

127.0.0.1:6379> DEL course:SE332.Q21
(integer) 1
```

#### Slide

- Import into slide, showing each command block one by one
  ```
  <<< @/snippets/[NAME] sh {1-2|1-5|...}
  ```
  > The 1-2 mean line 1 to 2, 1-5 mean line 1 to 5. Each must cover the whole command and its output
- Next slide showing first line to next command block until all command blocks are shown

Example:

```
---
hideInToc: true
---

# Strings — SET / GET / DEL

<<<@/snippets/strings-basic sh {1-2|1-5|1-8}
```

### Note

- Each command slide should contains about less than or equal to 6 command blocks, splitting into multiple slides if there are more than 6
