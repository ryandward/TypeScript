#!/usr/bin/env bash
# For each mutants/*.rule: insert the rule into HasType, run Lean, and require that the build
# FAILS *because the proof no longer goes through* (an "unsolved goals" or "Alternative ... has
# not been provided" error inside `sound`), not for any other reason.
#
# Guard against vacuous passes: the unmutated file must build first with the same command.
set -u
here=$(cd "$(dirname "$0")" && pwd); cd "$here/.."
LEAN=${LEAN:-lean}
command -v "$LEAN" >/dev/null || { echo "lean not found (set LEAN=/path/to/lean)"; exit 2; }
if ! out=$("$LEAN" Top.lean 2>&1); then
  echo "baseline Top.lean does not build; refusing to run mutants:"; echo "$out" | head; exit 2
fi
anchor='  | sub {Γ e τ} : HasType Γ e τ → HasType Γ e .top     -- every value is a Top'
grep -qF "$anchor" Top.lean || { echo "anchor line not found in Top.lean"; exit 2; }
fail=0
for r in mutants/*.rule; do
  name=$(basename "$r" .rule)
  tmp=$(mktemp -d); cp Top.lean "$tmp/Top.lean"
  python3 - "$tmp/Top.lean" "$r" "$anchor" <<'PY'
import sys,pathlib
p=pathlib.Path(sys.argv[1]); rule=pathlib.Path(sys.argv[2]).read_text().rstrip("\n"); anchor=sys.argv[3]
s=p.read_text(); assert anchor in s; p.write_text(s.replace(anchor, anchor+"\n"+rule,1))
PY
  out=$("$LEAN" "$tmp/Top.lean" 2>&1); code=$?
  if [ $code -eq 0 ]; then
    echo "mutant $name: STILL PROVES — the theorem does not depend on this rule's absence"; fail=1
  elif ! echo "$out" | grep -qE "Alternative '$name' has not been provided|unsolved goals"; then
    echo "mutant $name: build failed for another reason (not a proof failure):"; echo "$out" | head -5; fail=1
  else
    # Strong form: under the mutant the theorem is FALSE. Keep definitions only, append the
    # counterexample from mutants/<name>.cex: a closed well-typed term that evaluates to stuck.
    python3 - "$tmp/Top.lean" "mutants/$name.cex" <<'PY'
import sys,pathlib
p=pathlib.Path(sys.argv[1]); s=p.read_text()
s=s[:s.index("/-! ## Lemmas about environments")]
cex=pathlib.Path(sys.argv[2]).read_text().strip()
s+="\n/-- Under this mutant, soundness is refuted by a closed well-typed term that gets stuck. -/\n"
s+="theorem refuted : ∃ e τ, HasType [] e τ ∧ eval 5 [] e = .stuck :=\n  "+cex+"\n#print axioms refuted\n"
p.write_text(s)
PY
    if out2=$("$LEAN" "$tmp/Top.lean" 2>&1) && echo "$out2" | grep -q "'refuted' does not depend on any axioms\|'refuted' depends on axioms: \[propext"; then
      echo "mutant $name: proof fails, and soundness is refuted by a stuck well-typed term (expected)"
    else
      echo "mutant $name: proof fails but the counterexample did not check:"; echo "$out2" | head -8; fail=1
    fi
  fi
  rm -rf "$tmp"
done
exit $fail
