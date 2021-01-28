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
