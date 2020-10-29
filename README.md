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
