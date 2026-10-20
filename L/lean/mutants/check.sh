#!/usr/bin/env bash
# A mutant is a claim that one TypeScript rule is a hole. For each mutants/<name>.rule
# (first line: the relation to extend, HasType or Subty; the rest: the rule):
#   0. the unmutated Top.lean builds, and `sound` rests on no sorry and no added axiom;
#   1. the rule is inserted and the build breaks (this only shows the insertion took;
#      any new constructor breaks an exhaustive case split, harmless or not);
#   2. with the proofs stripped, every mutants/<name>*.cex — a closed well-typed term that
#      evaluates to stuck — checks, with no sorry. This is the test: under the mutant the
#      theorem is FALSE. A mutant with no .cex fails; it has claimed a hole without one.
set -u
here=$(cd "$(dirname "$0")" && pwd); cd "$here/.."
LEAN=${LEAN:-lean}
command -v "$LEAN" >/dev/null || { echo "lean not found (set LEAN=/path/to/lean)"; exit 2; }
out=$("$LEAN" Top.lean 2>&1) || { echo "baseline Top.lean does not build:"; echo "$out" | head; exit 2; }
if echo "$out" | grep -q "sorry"; then
  echo "baseline Top.lean uses sorry; refusing to run mutants:"; echo "$out" | grep sorry | head; exit 2
fi
ax=$(echo "$out" | grep "^'sound' depends on axioms")
case "$ax" in
  "'sound' depends on axioms: [propext, Quot.sound]"|"'sound' depends on axioms: [propext]"|"'sound' depends on axioms: [Quot.sound]"|"'sound' does not depend on any axioms") ;;
  *) echo "baseline: unexpected axioms for sound: ${ax:-<no #print axioms sound output>}"; exit 2 ;;
esac
fail=0
for r in mutants/*.rule; do
  name=$(basename "$r" .rule)
  rel=$(head -1 "$r")
  tmp=$(mktemp -d); cp Top.lean "$tmp/Top.lean"
  python3 - "$tmp/Top.lean" "$r" "$rel" <<'PY'
import sys,pathlib
p=pathlib.Path(sys.argv[1]); lines=pathlib.Path(sys.argv[2]).read_text().rstrip("\n").split("\n")
rule="\n".join(lines[1:]); marker="  -- MUTANT-POINT "+sys.argv[3]
s=p.read_text(); assert marker in s, "no "+marker
p.write_text(s.replace(marker, rule+"\n"+marker, 1))
PY
  if "$LEAN" "$tmp/Top.lean" >/dev/null 2>&1; then
    echo "mutant $name: build still succeeds — the rule was not inserted, or it is already derivable"; fail=1; rm -rf "$tmp"; continue
  fi
  cexs=$(ls mutants/"$name"*.cex 2>/dev/null)
  if [ -z "$cexs" ]; then
    echo "mutant $name: inserted, but NO counterexample — a mutant claims a hole and must refute soundness"; fail=1; rm -rf "$tmp"; continue
  fi
  for c in $cexs; do
    cname=$(basename "$c" .cex)
    cp "$tmp/Top.lean" "$tmp/Cex.lean"
    python3 - "$tmp/Cex.lean" "$c" <<'PY'
import sys,pathlib
p=pathlib.Path(sys.argv[1]); s=p.read_text()
s=s[:s.index("/-! ## Lemmas about environments")]
cex=pathlib.Path(sys.argv[2]).read_text().strip()
s+="\n/-- Under this mutant, soundness is refuted by a closed well-typed term that gets stuck. -/\n"
s+="theorem refuted : ∃ e τ, HasType [] e τ ∧ eval 5 [] e = .stuck :=\n  "+cex+"\n#print axioms refuted\n"
p.write_text(s)
PY
    out2=$("$LEAN" "$tmp/Cex.lean" 2>&1); code=$?
    if [ $code -eq 0 ] && ! echo "$out2" | grep -q "sorry" && echo "$out2" | grep -q "^'refuted'"; then
      echo "mutant $name [$cname]: refuted — a closed well-typed term evaluates to stuck"
    else
      echo "mutant $name [$cname]: counterexample did not check:"; echo "$out2" | head -8; fail=1
    fi
  done
  rm -rf "$tmp"
done
exit $fail
