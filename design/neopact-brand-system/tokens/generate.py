#!/usr/bin/env python3
"""Generate tokens.css from tokens.json. No dependencies. Fail on bad/cyclic aliases."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ALIAS = re.compile(r'^\{([^{}]+)\}$')

def flatten(group, prefix=''):
    result = {}
    for name, value in group.items():
        if name.startswith('$'):
            continue
        path = f'{prefix}.{name}' if prefix else name
        if isinstance(value, dict) and '$value' in value:
            result[path] = value
        elif isinstance(value, dict):
            result.update(flatten(value, path))
    return result

def main():
    data = json.loads((ROOT / 'tokens.json').read_text())
    tokens = flatten(data)
    names = {}
    for path, token in tokens.items():
        name = token['$extensions']['neopact']['cssVariable']
        if name in names.values():
            raise ValueError(f'Duplicate CSS variable: {name}')
        names[path] = name
    def resolve(path, seen=()):
        if path in seen:
            raise ValueError(f'Cyclic alias: {path}')
        value = tokens[path]['$value']
        match = ALIAS.match(value) if isinstance(value, str) else None
        if match:
            target = match.group(1)
            if target not in tokens:
                raise ValueError(f'Unknown alias: {target}')
            if tokens[path]['$type'] != tokens[target]['$type']:
                raise ValueError(f'Type mismatch: {path} -> {target}')
            return resolve(target, (*seen, path))
        return value
    css = ['/* Generated from tokens.json by generate.py. Edit JSON, then regenerate. */', ':root {']
    for layer in ('primitive', 'semantic', 'component'):
        css.append(f'  /* {layer.upper()} */')
        for path, token in tokens.items():
            if not path.startswith(layer + '.'):
                continue
            resolve(path)
            value = token['$value']
            match = ALIAS.match(value) if isinstance(value, str) else None
            if match:
                value = f'var({names[match.group(1)]})'
            css.append(f'  {names[path]}: {value};')
    css.extend(['}', ''])
    (ROOT / 'tokens.css').write_text('\n'.join(css))
    print(f'Generated tokens.css: {len(tokens)} tokens, aliases and types valid.')

if __name__ == '__main__':
    main()
