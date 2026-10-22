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
put([11,44,45], 'complete')
put([1,82], 'void.1'); put([7,21,22,23], 'records.3'); put([8,9,18,71,96,97,132,136], 'any.2'); put([10], 'prototypes.2')
put([12], 'tuples.1'); put([16,17,19,98,100,101], 'open-record.1'); put([20], 'open-record.5'); put([25,36,37]+list(range(108,118)), 'any.1')
put([28,35], 'arity.1'); put([29,30,32], 'parameters.1'); put([31], 'parameters.2'); put([33,34], 'any.3'); put([39,55,61,104,105,107], 'width.1')
put([41], 'narrowing.1'); put([43,46], 'generic-relations.2'); put([47,48,49,50,57,58,59,66,67,68,69,70], 'generic-relations.3')
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
