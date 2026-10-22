# Classifies each library hunk of the fork against v6.0.3 by what it deletes or changes; labels-gen.py reads its output.
# Classifies each library hunk of the fork against v6.0.3 into a TypeScript-L mechanism id, by what it deletes or changes.
import subprocess, re, json, sys, collections
files = [f for f in subprocess.run(['git','diff','--name-only','v6.0.3','--','src/lib'],capture_output=True,text=True).stdout.split()]
MUT = r'\b(push|pop|shift|unshift|splice|sort|reverse|fill|copyWithin|set\w*|add|delete|clear|resize|transfer\w*|grow|write\w*|setInt\w*|setUint\w*|setFloat\w*|setBig\w*|use|adopt|defer|move|disposeAsync|dispose|lastIndex|compile)\b'
OBJMUT = r'\b(assign|defineProperty|defineProperties|setPrototypeOf|preventExtensions|seal|freeze|deleteProperty|set)\s*[<(]'
EFFECT = r'\b(random|now|Date\b|toLocale\w*|getTimezoneOffset|eval|Atomics|SharedArrayBuffer|FinalizationRegistry|WeakRef|deref|register|unregister|wait\w*|notify|Intl|Temporal|setTimeout|queueMicrotask|structuredClone|getDate|getDay|getFullYear|getHours|getMilliseconds|getMinutes|getMonth|getSeconds|getYear|setYear|toDateString|toTimeString|toString\(\): string; //|escape|unescape|DisposableStack|AsyncDisposableStack|SuppressedError|localeCompare|isWellFormed)\b'
out = []
for f in files:
    diff = subprocess.run(['git','diff','-U0','v6.0.3','--',f],capture_output=True,text=True).stdout.replace('\r','')
    new = open(f,newline='').read().replace('\r','').split('\n')
    for m in re.finditer(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@.*\n((?:[-+].*\n?)*)', diff, re.M):
        ns, nc = int(m.group(3)), int(m.group(4) or 1)
        body = m.group(5)
        add = '\n'.join(l[1:] for l in body.split('\n') if l.startswith('+'))
        dele = '\n'.join(l[1:] for l in body.split('\n') if l.startswith('-'))
        ctx = ''
        for i in range(min(ns + nc, len(new)) - 1, max(0, ns - 60), -1):
            if '// L:' in new[i]: ctx = new[i].strip(); break
        text = add + '\n' + dele
        L = (re.search(r'// L:(.*)', add) or re.search(r'// L:(.*)', ctx) or [None, ''])[1].strip()
        lab, why = None, ''
        def has(p, s=text): return re.search(p, s)
        if has(r'\bout T\b|\bout V\b|filter<U, S extends U>|find<U, S extends U>|reduce<U>\(this') or 'covariant' in L: lab = 'complete'; why = 'variance annotation or this-bound overload'
        elif 'plain object the engine builds' in L or 'as PropertyDescriptor is' in L or has(r'^type (IteratorYieldResult|IteratorReturnResult|PromiseFulfilledResult|PromiseRejectedResult|PropertyDescriptor)', add): lab = 'complete'; why = 'engine-built object declared as a type literal'
        elif 'initial value' in L or (dele and not add and has(r'reduce(Right)?\(callbackfn: \(previousValue: T, currentValue: T', dele)): lab = 'library-declarations.5'; why = 'reduce overload without an initial value'
        elif has(r'\b(apply|call|bind)\(', dele) and 'this' in L: lab = 'classes.4'; why = 'apply, call, bind'
        elif has(r'readonly prototype:|\bprototype:', dele): lab = 'prototypes.2'; why = 'prototype field'
        elif has(r'newTarget', text): lab = 'prototypes.3'; why = 'newTarget'
        elif 'performs no effects' in L or 'performs no effects' in ctx: lab = 'effects'; why = 'effects block'
        elif 'changes no object in place' in L or 'changes no object in place' in ctx: lab = 'writes.2'; why = 'in-place block'
        elif has(r'declare var Proxy|\bProxy\b', dele) or 'no Proxy' in L: lab = 'library-declarations.3'; why = 'Proxy'
        elif 'no constructor' in L or has(r'new \(arrayLength', dele): lab = 'library-declarations.4'; why = 'Array constructor'
        elif 'group that took no part' in L or has(r'split|\| undefined\)\[\]|undefined\)\[\]', add) and 'undefined' in add: lab = 'library-declarations.6'; why = 'result as wide as the engine'
        elif 'concat' in L: lab = 'library-declarations.9'; why = 'concat'
        elif 'symbol keys' in L: lab = 'library-declarations.8'; why = 'key'
        elif has(r'replaceAll|matchAll|raw\(|TemplateStringsArray', text): lab = 'library-declarations.7'; why = 'argument the engine accepts'
        elif 'caller or arguments' in L or has(r'\b(caller|arguments):', dele): lab = 'library-declarations.1'; why = 'caller, arguments'
        elif 'groupBy' in L or has(r'groupBy', dele): lab = 'library-declarations.2'; why = 'Object.groupBy'
        elif 'taking never' in L or 'return and throw' in L: lab = 'parameters.1'; why = 'iterator return and throw'
        elif has(r'readonly ', add) and not dele.count('readonly') >= add.count('readonly'): lab = 'writes.2'; why = 'readonly result'
        elif has(OBJMUT, dele): lab = 'writes.3'; why = 'Object or Reflect mutator'
        elif has(MUT, dele) and not add: lab = 'writes.2'; why = 'mutating method'
        elif has(EFFECT, dele) and not add: lab = 'effects'; why = 'effect'
        elif has(r'entries\(\)', text): lab = 'writes.2'; why = 'entries() tuple readonly'
        elif has(r'stringify', text): lab = 'library-declarations.7'; why = 'JSON.stringify'
        out.append({'file': f[8:], 'line': ns, 'label': lab, 'why': why, 'L': L[:80], 'del': dele.split('\n')[0].strip()[:90], 'add': add.split('\n')[0].strip()[:90], 'ndel': dele.count('\n') + (1 if dele else 0)})
json.dump(out, open(sys.argv[1],'w'), indent=0)
c = collections.Counter(x['label'] for x in out)
print(c.most_common())
