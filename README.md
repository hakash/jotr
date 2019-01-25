# Welcome to the home of 'jotr'

_Jot down your ideas, thoughts and notes, whitout leaving the terminal._

>**_TLDR:_**
> To get started, simply write `jotr` in your terminal to start the editor. Use `Ctrl+D` to save and exit, `Ctrl+C` to exit without saving.
>
>See your jot using `jotr -l`

## Adding jots

jotr supports adding jots both from the cli and using a simple built-in editor.

### One-liners

Use the following format for one-liners, similar to **_'git commit -m "Some commit message"'_**:

```sh
jotr [tags] -c <your jot>
```

Example:

```sh
jotr javascript -c 'let' is scoped to a block
```

Note that you can have multiple tags. The jot is stored with all tags. Example:

```sh
jotr javascript scope assignment -c 'let' is scoped to a block
```

### Multi-line

For multi-line jots, you need to use the editor:

```sh
jotr javascript scope assignment
```

This clears the terminal window, presenting you with an empty space to write your heart out. Use `Ctrl+D` to save your jot. To cancel, just use `Ctrl+C`.

## Looking at the jots

You can list all jots using the `-l` or `--list` flags. If you supply tags as well, you will get a filtered result, displaying only the jots with those tags.

```sh
jotr -l
```

With flags:

```sh
jotr -l c++ pointers
```

If you are looking for a specific term, rather than a tag, you can use the `-g` or `--grep` flags with the term as an argument.

```sh
jotr -g scope
```