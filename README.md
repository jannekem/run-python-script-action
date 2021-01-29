# Run Python Script Action

Write Python scripts in an Actions workflow file!

This action lets you define a custom Python script inside the workflow yaml file. It takes only one argument, `script`, which must contain the Python code that you want to run. You can use the YAML multiline string feature to define multiline scripts.

The only requirement is that you set up the Python environment before running the action. Here is an example workflow that prints the repository root directory contents to the Actions logs:

```yaml
name: Run Script

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - uses: jannekem/run-python-script-action@v1
        with:
          script: |
            import os
            print("Directory contents:")
            for f in os.listdir():
                print(f)
```

## Handling errors

By default, the action will fail if it encounters any errors when trying to run your script. You can override this with the `fail-on-error` input.

The action sets three outputs:

- `stdout` contains any text that your program prints to the console
- `stderr` contains any text that is routed to STDERR, such as exception messages
- `error` is a string with either `"true"` or `"false"` depending on if errors were present or not, use this to check for errors when you opt not to fail the step

Look at the following snippet to see how the error handling works in practice:

```yaml
name: Run Script

on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - uses: jannekem/run-python-script-action@v1
        id: script
        with:
          fail-on-error: false
          script: |
            print("Doing something that will fail")
            a = []
            a[10]
      - name: Print errors
        if: steps.script.outputs.error == 'true'
        run: |
          printenv "SCRIPT_STDOUT"
          printenv "SCRIPT_STDERR"
        env:
          SCRIPT_STDOUT: ${{ steps.script.outputs.stdout }}
          SCRIPT_STDERR: ${{ steps.script.outputs.stderr }} 
```

## Utility functions

The action comes bundled with utilities that you can use to interact with the workflow. If you want to disable these utilities you can set `util: false` as an input for the step. You can call these functions directly from your `script` without having to import anything.

Example:

```yaml
- uses: jannekem/run-python-script-action@v1
  with:
    script: |
      add_path("/usr/local/test")
      set_env("HELLO", "WORLD")
      group("Messages")
      print("Sending a message")
      warning("There might be an issue")
      end_group()
```

### Add path

**Signature**: `add_path(path)`

Prepend to the system path. The change will affect later steps only.

### Get input

**Signature**: `get_input(name)`

Returns the value of the given input as a string.

### Set output

**Signature**: `set_output(name, value)`

Sets an output parameter.

### Set env

**Signature**: `set_env(name, value)`

Sets an environment variable for use in later steps.

### Debug

**Signature**: `debug(message)`

Sends a debug message. The message will be visible only when [debug logging has been enabled](https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging).

### Warning

**Signature**: `warning(message)`

Sends a warning message that will be highlighted with yellow color in the worklow log.

### Error

**Signature**: `error(message)`

Sends an error message that will be higlighted with red color in the workflow log.

### Group

**Signature**: `group(title)`

Creates an expandable group in the workflow log.

### End group

**Signature**: `end_group()`

Ends a group. All printed lines before calling `end_group()` belong to the previously defined group.

### Add mask

**Signature**: `add_mask(value)`

Masks out sensitive data and replaces it with `***`. The value can be a string ("my sensitive data"), or it can point to an environment variable ("$DB_PASSWORD").

### Stop commands

**Signature**: `stop_commands()`

All commands will stop processing. It allows you to log anything without accidentally triggering workflow commands.

### Resume commands

**Signature**: `resume_commands()`

Resume command processing.

### Get state

**Signature**: `get_state(name)`

Share environment variables with your workflow's `pre:` and `post:` actions. See [official documentation](https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#sending-values-to-the-pre-and-post-actions) for more details.

### Save state

**Signature**: `save_state(name, value)`

Saves a value as an environment variable with the `STATE_` prefix. See [official documentation](https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#sending-values-to-the-pre-and-post-actions) for more details.
