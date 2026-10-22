# Writes L/ablation/labels.json: each minimal hunk of the fork against v6.0.3, by file and ordinal, with its mechanism.
# The checker's hunks are labelled by hand below; the library's come from lib-hunks.json, which lib-hunks.py writes by
# what each hunk deletes or changes, with the hunks it leaves unlabelled placed by hand (manual).
#   python3 L/ablation/lib-hunks.py L/ablation/lib-hunks.json && python3 L/ablation/labels-gen.py   (from the repo root)
import json, collections, os
HERE = os.path.dirname(os.path.abspath(__file__))
checker = {}
def put(idxs, lab):
    for i in idxs: checker[i] = lab
put([0,2,3,4,5,6,13,14,15,24,26,27,38,40,42,51,99,119], 'infra')
put([11], 'complete')
put([1,82], 'void.1'); put([7,21,22,23], 'records.3'); put([8,9,18,71,96,97,132,136], 'any.2'); put([10], 'prototypes.2')
put([12], 'tuples.1'); put([16,17,19,98,100,101], 'open-record.1'); put([20], 'open-record.5'); put([25,36,37]+list(range(108,118)), 'any.1')
put([28,35], 'arity.1'); put([29,30,32], 'parameters.1'); put([31], 'parameters.2'); put([33,34], 'any.3'); put([39,55,61,104,105,107], 'width.1')
# Hunks 44 and 45 pass the fuel of eight, which generic-relations' obligation 2 names: with the cutoff restored to
# TypeScript's Maybe, a deeper comparison can reach a failure the release's cutoff at three never sees.
put([41], 'narrowing.1'); put([43,44,45,46], 'generic-relations.2'); put([47,48,49,50,57,58,59,66,67,68,69,70], 'generic-relations.3')
put([52,53,54,62,63], 'generic-relations.1'); put([60], 'records.2'); put([64,65], 'width.2'); put([72,81], 'narrowing.7'); put([73], 'number-strings.1')
put([74,75,76,77], 'narrowing.2'); put([78,79], 'narrowing.4'); put([80,86], 'narrowing.6'); put([83,84,85], 'narrowing.8'); put([87,88], 'narrowing.5')
put([89], 'initialization-order.1'); put([90], 'immutable-bindings.2'); put([91,92], 'classes.2'); put([93], 'prototypes.1'); put([94,95,128,135], 'records.1')
put([102,103], 'writes.4'); put([118], 'call-signature.1'); put([120,121], 'instanceof-constructor.1'); put([122], 'type-assertion.1'); put([123], 'non-null-assertion.1')
put([124,125], 'call-signature.2'); put([126,127], 'writes.1'); put([129,130,131], 'arity.2'); put([133], 'type-guard-or-assertion-function.1'); put([134], 'overloads.1')
put([137], 'classes.1'); put([138], 'ambient-declarations.2'); put([139], 'enums.1'); put([140], 'namespaces.1'); put([141], 'ambient-declarations.1')
put([142], 'directives.1'); put([143], 'immutable-bindings.1')
labels = {f'src/compiler/checker.ts#{i}': [{'label': l, 'mode': 'full'}] for i, l in checker.items()}
labels['src/compiler/checker.ts#56'] = [{'label': 'narrowing.1', 'mode': 'drop', 'lines': [1, 10]}, {'label': 'width.1', 'mode': 'drop', 'lines': [11, 20]}]
labels['src/compiler/checker.ts#106'] = [{'label': 'void.2', 'mode': 'drop', 'lines': [1, 4]}, {'label': 'width.1', 'mode': 'replace', 'lines': [5, 18]}]
assert sorted(int(k.split('#')[1]) for k in labels) == list(range(144))
labels['src/compiler/checker.ts#16'] = [{'label': 'open-record.1', 'mode': 'drop', 'lines': [1, 3]}, {'label': 'receivers.1', 'mode': 'drop', 'lines': [4, 6]}]
labels['src/compiler/checker.ts#98'] = [{'label': 'open-record.1', 'mode': 'drop', 'lines': [1, 1]}, {'label': 'receivers.1', 'mode': 'drop', 'lines': [2, 4]}]
# Hunk 31 declares what both parameters.2 (a parameter the target never passes takes unknown) and any.3 (a parameter
# typed any takes unknown) use; hunk 43 only defines helpers, whose callers are labelled.
labels['src/compiler/checker.ts#31'] = [
    {'label': 'parameters.2', 'mode': 'text', 'lines': [1, 2], 'text': ['            const declaredTargetType = i === restIndex ? getRestOrAnyTypeAtPosition(target, i) : tryGetTypeAtPosition(target, i);']},
    {'label': 'any.3', 'mode': 'text', 'lines': [3, 6], 'text': ['            const targetTypeIsAny = false;', '            const targetType = declaredTargetType;']}]
labels['src/compiler/checker.ts#43'] = [{'label': 'infra', 'mode': 'full'}]
# Hunk 35 adds arity.1's check (lines 1-9), then the closing brace of the loop and parameters.2's check of a rest
# parameter past the target's parameters, whose block the loop's original brace now closes (lines 10-22).
labels['src/compiler/checker.ts#35'] = [{'label': 'arity.1', 'mode': 'drop', 'lines': [1, 9]}, {'label': 'parameters.2', 'mode': 'drop', 'lines': [10, 22]}]
labels['src/compiler/types.ts#0'] = [{'label': 'infra', 'mode': 'full'}]
labels['src/compiler/utilities.ts#0'] = [{'label': 'ambient-declarations.1', 'mode': 'full'}]
labels['src/compiler/utilities.ts#1'] = [{'label': 'directives.1', 'mode': 'full'}]
labels['src/compiler/utilities.ts#2'] = [{'label': 'directives.1', 'mode': 'full'}]
lib = json.load(open(os.path.join(HERE, 'lib-hunks.json')))
manual = {('es2015.core.d.ts',41):'library-declarations.6',('es2015.iterable.d.ts',88):'library-declarations.6',('es2015.iterable.d.ts',96):'library-declarations.6',
          ('esnext.array.d.ts',17):'library-declarations.6',('es2020.promise.d.ts',6):'complete',('es2020.promise.d.ts',11):'complete',
          ('es5.d.ts',254):'classes.4',('es5.d.ts',258):'classes.4',('es5.d.ts',1262):'complete',('es5.d.ts',1267):'complete',('es5.d.ts',1272):'complete',('es5.d.ts',1277):'complete'}
perfile = {}
for x in lib:
    k = perfile.get(x['file'], 0); perfile[x['file']] = k + 1
    lab = x['label'] or manual.get((x['file'], x['line']))
    if lab is None:
        if 'intl' in x['file'] or 'temporal' in x['file']: lab = 'effects'
        elif x['file'] == 'es2025.collection.d.ts': lab = 'writes.2'
    assert lab, x
    labels[f'src/lib/{x["file"]}#{k}'] = [{'label': lab, 'mode': 'full'}]
# Hunks of the library that hold several mechanisms, split by line. The Array constructor's hunk deletes the
# constructor's signatures, narrows isArray to readonly unknown[] and deletes Array.prototype; the Reflect hunk deletes
# construct (a newTarget), defineProperty and deleteProperty, and get.
def key_of(file, line):
    k = 0
    for x in lib:
        if x['file'] == file:
            if x['line'] == line: return f'src/lib/{file}#{k}'
            k += 1
    raise KeyError((file, line))
labels[key_of('es5.d.ts', 1139)] = [{'label': 'library-declarations.4', 'mode': 'replace', 'lines': [1, 1], 'old': [1, 6]},
    {'label': 'any.2', 'mode': 'replace', 'lines': [2, 2], 'old': [7, 7]}, {'label': 'prototypes.2', 'mode': 'replace', 'lines': [3, 2], 'old': [8, 8]}]
labels[key_of('es2015.reflect.d.ts', 16)] = [{'label': 'prototypes.3', 'mode': 'replace', 'lines': [1, 0], 'old': [1, 13]},
    {'label': 'writes.3', 'mode': 'replace', 'lines': [1, 0], 'old': [14, 30]}, {'label': 'open-record.4', 'mode': 'replace', 'lines': [1, 0], 'old': [31, 44]}]
json.dump(labels, open(os.path.join(HERE, 'labels.json'), 'w'), indent=1, sort_keys=True)
c = collections.Counter(s['label'] for v in labels.values() for s in v)
print(len(labels), 'hunks;', len([l for l in c if l not in ('infra', 'complete')]), 'mechanisms')
print(sorted(c.items()))

# Pure deletions in the library, labelled member by member. A hunk-level label is right only when every member it
# deletes belongs to one mechanism; a typed array's hunk, for one, deletes in-place methods (writes.2), toLocaleString
# (effects) and prototype (prototypes.2) together. Each deleted line takes the label of the declaration it belongs to:
# a JSDoc comment and a blank or a brace take the next declaration's, a signature's continuation lines its first
# line's. A mechanism's lines are restored together, in their original order (mode restore).
import re, subprocess
def member_label(decl):
    d = decl.strip()
    if re.match(r'declare namespace Intl\b|namespace Intl\b', d): return 'effects'
    m = re.match(r'(?:declare\s+)?(?:readonly\s+)?(?:function\s+|var\s+|const\s+|interface\s+|type\s+)?(?:\[Symbol\.(\w+)\]|(\w+))', d)
    name = (m.group(1) or m.group(2)) if m else ''
    # Date's local-time setters read the time zone, so they went with the effects; its UTC setters are writes
    # (changes.txt). eval and the Function constructor run code from a string.
    if re.match(r'(setMilliseconds|setSeconds|setMinutes|setHours|setDate|setMonth|setFullYear|setYear|eval|Function)$', name): return 'effects'
    if re.match(r'(push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin|add|delete|clear|set\w*|getOrInsert\w*|transfer\w*|resize|grow|write\w*|use|adopt|defer|move|lastIndex|compile)$', name): return 'writes.2'
    if re.match(r'(assign|defineProperty|defineProperties|setPrototypeOf|preventExtensions|seal|freeze|deleteProperty)$', name): return 'writes.3'
    if re.match(r'(toLocale\w*|getTimezoneOffset|localeCompare|random|now|toDateString|toTimeString)$', name): return 'effects'
    if name in ('apply', 'call', 'bind'): return 'classes.4'
    if name in ('prototype', 'create'): return 'prototypes.2'
    if name in ('reduce', 'reduceRight'): return 'library-declarations.5'
    return None
ROOT = os.path.join(HERE, '..', '..')
def old_hunks(f):
    diff = subprocess.run(['git', 'diff', '-U0', 'v6.0.3', '--', f], capture_output=True, text=True, cwd=ROOT).stdout.replace('\r', '')
    out = []
    for line in diff.split('\n'):
        if line.startswith('@@'): out.append({'old': [], 'new': []})
        elif out and line.startswith('-'): out[-1]['old'].append(line[1:])
        elif out and line.startswith('+'): out[-1]['new'].append(line[1:])
    return out
relabelled = 0
for f in sorted({k.split('#')[0] for k in labels if k.startswith('src/lib/')}):
    for k, h in enumerate(old_hunks(f)):
        key = f'{f}#{k}'
        sels = labels[key]
        if 'intl' in f or 'temporal' in f:
            labels[key] = [{'label': 'effects', 'mode': 'full'}]
            continue
        if any(not re.match(r'\s*(//|$)', t) for t in h['new']) or len(sels) != 1 or sels[0]['mode'] != 'full' or sels[0]['label'] in ('complete',) and not any(member_label(s) for s in h['old']):
            continue
        # The label of each line: a declaration's own, its continuation lines' from it, comments and braces the next's.
        starts, cont = [], False
        for i, s in enumerate(h['old']):
            t = s.strip()
            is_comment = not t or re.match(r'(/\*\*|\*|//|\}|\{)', t)
            starts.append(None if is_comment or cont else member_label(t) or 'other')
            if not is_comment: cont = not re.search(r'[;{}]\s*(//.*)?$', t)
        # Everything after a deleted Intl namespace's opening line is part of it, whatever its members are named.
        for i, t in enumerate(h['old']):
            if re.match(r'\s*declare namespace Intl\b', t):
                starts[i:] = ['effects' if x is not None else None for x in starts[i:]]
                starts[i] = 'effects'
                break
        line_labels, nxt = [None] * len(h['old']), None
        for i in range(len(h['old']) - 1, -1, -1):
            if starts[i] is not None: nxt = starts[i]
            line_labels[i] = nxt
        prev = None
        for i in range(len(h['old'])):
            if line_labels[i] is None: line_labels[i] = prev
            prev = line_labels[i] if starts[i] is not None or line_labels[i] is not None else prev
        kinds = [x for x in set(line_labels) if x not in (None, 'other')]
        fallback = sels[0]['label'] if sels[0]['label'] in kinds or not kinds else max(kinds, key=line_labels.count)
        line_labels = [fallback if x in (None, 'other') else x for x in line_labels]
        if set(line_labels) == {sels[0]['label']}: continue
        groups = {}
        for i, x in enumerate(line_labels):
            if groups.get(x) and groups[x][-1][1] == i: groups[x][-1][1] = i + 1
            else: groups.setdefault(x, []).append([i + 1, i + 1])
        labels[key] = [{'label': x, 'mode': 'restore', 'old': rs} for x, rs in groups.items()]
        relabelled += 1
# es2020.string.d.ts's hunk changes matchAll (library-declarations.7) and deletes toLocaleLowerCase, toLocaleUpperCase
# and localeCompare (effects).
labels['src/lib/es2020.string.d.ts#1'] = [{'label': 'library-declarations.7', 'mode': 'replace', 'lines': [1, 1], 'old': [1, 1]},
    {'label': 'effects', 'mode': 'replace', 'lines': [2, 1], 'old': [2, 15]}]
# Corrections from the adversarial review (Codex, 2026-10-22), each checked against the hunk and changes.txt.
L = 'src/lib/'
def lab(key, *sels): labels[L + key] = list(sels)
lab('es5.d.ts#33', {'label': 'effects', 'mode': 'replace', 'lines': [1, 0], 'old': [1, 2]},
    {'label': 'library-declarations.6', 'mode': 'replace', 'lines': [1, 1], 'old': [3, 3]})
lab('es5.d.ts#35', {'label': 'prototypes.2', 'mode': 'restore', 'old': [[1, 1]]})
lab('es5.d.ts#43', {'label': 'library-declarations.6', 'mode': 'full'})
lab('es5.d.ts#44', {'label': 'library-declarations.6', 'mode': 'full'})
lab('es5.d.ts#50', {'label': 'writes.2', 'mode': 'full'})
for k in (62, 63, 64, 65): lab(f'es5.d.ts#{k}', {'label': 'any.2', 'mode': 'full'})
lab('es5.d.ts#88', {'label': 'complete', 'mode': 'full'})
labels[L + 'es5.d.ts#58'] = [dict(x, label='library-declarations.6') if x['label'] == 'any.2' else x for x in labels[L + 'es5.d.ts#58']]
lab('es2015.core.d.ts#7', {'label': 'complete', 'mode': 'full'})
lab('es2025.iterator.d.ts#2', {'label': 'library-declarations.7', 'mode': 'replace', 'lines': [1, 1], 'old': [1, 1]},
    {'label': 'library-declarations.5', 'mode': 'replace', 'lines': [5, 4], 'old': [8, 8]})
lab('es2025.iterator.d.ts#3', {'label': 'writes.2', 'mode': 'full'})
lab('es2015.iterable.d.ts#0', {'label': 'writes.2', 'mode': 'text', 'lines': [4, 12], 'text': [
    'type IteratorYieldResult<TYield> = {', '    done?: false;', '    value: TYield;', '};', '',
    'type IteratorReturnResult<TReturn> = {', '    done: true;', '    value: TReturn;', '};']})
lab('es2015.iterable.d.ts#5', {'label': 'library-declarations.6', 'mode': 'replace', 'lines': [1, 1], 'old': [1, 1]})
lab('esnext.disposable.d.ts#3', {'label': 'writes.3', 'mode': 'full'})
lab('esnext.disposable.d.ts#5', {'label': 'writes.3', 'mode': 'full'})
json.dump(labels, open(os.path.join(HERE, 'labels.json'), 'w'), indent=1, sort_keys=True)
c = collections.Counter(s['label'] for v in labels.values() for s in v)
print(relabelled, 'library hunks labelled member by member;', sorted(c.items()))
