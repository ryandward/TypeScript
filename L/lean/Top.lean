/-!
# λ_Top — a type with no eliminations is sound

This is the standard result for a typed λ-calculus with a top type, mechanized so that L's
`any` rule can be checked against it by *mutation*: each of TypeScript's `any` permissions is
added back to `Top` in `mutants/`, and the proof must fail for every one. The theorem on its
own says only that `unknown` cannot crash; the mutants are what say something about `any`.

The calculus: numbers, strings, booleans, `null`, `undefined`, records with labelled fields,
arrays, functions, and the eliminations that need a structure —
  field read `e.l`, element read `e[i]`, call `f a`, iteration `for (x of e) body`,
  spread `[...e]`, membership `"l" in e` —
and `e instanceof f`, whose right side must be a **constructor** — a value with a
prototype. The calculus has one constructor value, `ctor`, of type `.ctorTy`, and no `new`;
it exists so that `instanceof` has a sound typing rule to compare the mutants against.
V8's `InstanceofOperator`: if the right side is not callable, throw. Then `OrdinaryHasInstance`:
if the left side is not an object, return `false`; otherwise read the right side's `prototype` and throw if it is not
an object. An arrow function is callable but has no prototype, so `({}) instanceof (() => 1)`
throws while `null instanceof (() => 1)` is `false`. Measured, Node v22.22.0
(`v8-instanceof.js` / `v8-instanceof.out`):
    null instanceof (() => 1)   false
    1 instanceof (() => 1)      false
    ({}) instanceof (() => 1)   TypeError: Function has non-object prototype 'undefined'
    null instanceof 42          TypeError: Right-hand side of 'instanceof' is not an object
    ({}) instanceof class {}    false
plus the two total tests `typeof x === "string"` / `"number"`, which refine the tested
variable in the then-branch.

Subtyping `Subty τ σ` has reflexivity, transitivity, `Subty τ Top` for every τ, depth subtyping
on records, **covariant arrays, and contravariant function parameters**. These are the variances
L requires; TypeScript's are weaker in two places — it relates mutable arrays covariantly
(closed by L's mutable-array-or-tuple rule, TS2890/TS2891) and compares method-style parameters
bivariantly (`strictFunctionTypes` exempts methods). `Top` has an introduction rule
(subsumption) and **no elimination rule**. The only things you can do with a `Top` are pass it
along, store it in a `Top` slot, or test it. Nothing is a *supertype* of `Top` except `Top`
(`subTopOnlyTop`); that single absence is what `mutants/subDown.rule` removes, and the nested
witnesses (an `any[]`, a callback expecting `any`, a field of a callback's parameter) then
follow from it through the variances rather than being postulated.

Array covariance is sound in this calculus only because it has no mutation: these are
TypeScript's `readonly T[]`. So this proof depends on L's mutable-array-or-tuple rule
(TS2890/TS2891). Mutable-array covariance is a different hole and is not modelled here.

What this calculus does NOT have, and the proof therefore does not cover:
  * `new` (no constructors), tagged templates (a call: covered by `app`), destructuring
    (a projection: covered by `proj`);
  * assignment. The `typeof` refinement retypes a variable inside a branch; that is sound
    here only because nothing can reassign the variable in between. **This proof depends on
    L's immutable-bindings rule (TS2892/TS2893).** A calculus with references and `await` is
    where that dependency is discharged or paid for.
  * width subtyping on records. L keeps TypeScript's width subtyping; leaving it out here
    restricts the calculus, and none of the `any` claims need it.
  * every element read `e[i]` is typed `Top` — the sound over-approximation of
    `τ | undefined`, since the index may be out of range — so an element read yields a value
    with no operations; use `forEach` to consume array elements with their element type;
  * functions take one argument, so rest parameters and second parameters are not modelled.

Semantics: a fuel-indexed evaluator with closures (no substitution lemma). A term is *stuck*
when an operation meets a value without the structure it needs. `stuck` is L's notion of
error: a missing field is stuck here where JavaScript returns `undefined`; a call on `42`, a
`for-of` over `42`, `"l" in 42`, `x instanceof 42` and `({}) instanceof (() => 1)` are stuck here
and TypeErrors in JavaScript. `null instanceof (() => 1)` is stuck here and `false` in
JavaScript: the stricter direction, by design (the calculus does not distinguish the cases).

Checked with Lean 4.22.0, no Mathlib.
-/

inductive Ty where
  | num | str | bool | nul | undef
  | record : List (String × Ty) → Ty
  | arr : Ty → Ty
  | arrow : Ty → Ty → Ty
  | ctorTy                                 -- a constructor: has a prototype
  | top
  deriving Repr

inductive Term where
  | var : Nat → Term                       -- de Bruijn index
  | num : Int → Term
  | str : String → Term
  | bool : Bool → Term
  | nul | undef
  | record : List (String × Term) → Term
  | arr : List Term → Term
  | proj : Term → String → Term            -- e.l
  | elem : Term → Term → Term              -- e[i]
  | lam : Ty → Term → Term                 -- λ(x : τ). body
  | app : Term → Term → Term
  | ctor : Term                            -- a constructor literal (class C {})
  | forEach : Term → Term → Term           -- for (x of e) f x   (f is the loop body)
  | spread : Term → Term                   -- [...e]
  | hasKey : String → Term → Term          -- "l" in e
  | instOf : Term → Term → Term            -- e instanceof f
  | ifStr : Nat → Term → Term → Term       -- if typeof (var i) === "string" then e₁ else e₂
  | ifNum : Nat → Term → Term → Term
  deriving Repr

inductive Val where
  | num : Int → Val
  | str : String → Val
  | bool : Bool → Val
  | nul | undef
  | record : List (String × Val) → Val
  | arr : List Val → Val
  | clos : List Val → Ty → Term → Val      -- closure: captured environment, param type, body
  | ctor : Val                             -- a constructor; the only value with a prototype
  deriving Repr

/-- JavaScript's IsObject on the calculus's values. -/
def Val.isObject : Val → Bool
  | .record _ | .arr _ | .clos _ _ _ | .ctor => true
  | _ => false

inductive Res where
  | val : Val → Res
  | stuck                                   -- L's runtime error
  | timeout                                 -- out of fuel

inductive FRes where
  | ok : List (String × Val) → FRes
  | stuck
  | timeout

inductive LRes where
  | ok : List Val → LRes
  | stuck
  | timeout

def lookup {α : Type} : List (String × α) → String → Option α
  | [], _ => none
  | (l, x) :: rest, k => if l = k then some x else lookup rest k

def evalFieldsWith (f : Term → Res) : List (String × Term) → FRes
  | [] => .ok []
  | (l, e) :: rest =>
    match f e with
    | .val v =>
      match evalFieldsWith f rest with
      | .ok vs => .ok ((l, v) :: vs)
      | .stuck => .stuck
      | .timeout => .timeout
    | .stuck => .stuck
    | .timeout => .timeout

def evalListWith (f : Term → Res) : List Term → LRes
  | [] => .ok []
  | e :: rest =>
    match f e with
    | .val v =>
      match evalListWith f rest with
      | .ok vs => .ok (v :: vs)
      | .stuck => .stuck
      | .timeout => .timeout
    | .stuck => .stuck
    | .timeout => .timeout

/-- Run a loop body (a closure body under its captured environment) on each element. -/
def runEach (run : Val → Res) : List Val → Res
  | [] => .val .undef
  | v :: rest =>
    match run v with
    | .val _ => runEach run rest
    | .stuck => .stuck
    | .timeout => .timeout

/-- Fuel-indexed evaluator. -/
def eval : Nat → List Val → Term → Res
  | 0, _, _ => .timeout
  | _+1, ρ, .var i =>
    match ρ[i]? with
    | some v => .val v
    | none => .stuck
  | _+1, _, .num k => .val (.num k)
  | _+1, _, .str s => .val (.str s)
  | _+1, _, .bool b => .val (.bool b)
  | _+1, _, .nul => .val .nul
  | _+1, _, .undef => .val .undef
  | n+1, ρ, .record fs =>
    match evalFieldsWith (eval n ρ) fs with
    | .ok vs => .val (.record vs)
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .arr es =>
    match evalListWith (eval n ρ) es with
    | .ok vs => .val (.arr vs)
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .proj e l =>
    match eval n ρ e with
    | .val (.record vs) =>
      match lookup vs l with
      | some v => .val v
      | none => .stuck
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .elem e i =>
    match eval n ρ e with
    | .val (.arr vs) =>
      match eval n ρ i with
      | .val (.num k) => .val (if h : 0 ≤ k ∧ k.toNat < vs.length then vs[k.toNat] else .undef)
      | .val _ => .stuck
      | .stuck => .stuck
      | .timeout => .timeout
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | _+1, ρ, .lam τ b => .val (.clos ρ τ b)
  | _+1, _, .ctor => .val .ctor
  | n+1, ρ, .app f a =>
    match eval n ρ f with
    | .val (.clos ρ' _ b) =>
      match eval n ρ a with
      | .val v => eval n (v :: ρ') b
      | .stuck => .stuck
      | .timeout => .timeout
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .forEach e f =>
    match eval n ρ e with
    | .val (.arr vs) =>
      match eval n ρ f with
      | .val (.clos ρ' _ b) => runEach (fun v => eval n (v :: ρ') b) vs
      | .val _ => .stuck
      | .stuck => .stuck
      | .timeout => .timeout
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .spread e =>
    match eval n ρ e with
    | .val (.arr vs) => .val (.arr vs)
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .hasKey l e =>
    match eval n ρ e with
    | .val (.record vs) => .val (.bool (lookup vs l).isSome)
    | .val _ => .stuck
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .instOf e f =>
    match eval n ρ e with
    | .val l =>
      match eval n ρ f with
      | .val .ctor => .val (.bool false)             -- no prototype chains: never an instance
      | .val (.clos _ _ _) =>                        -- callable, no prototype:
        if l.isObject then .stuck else .val (.bool false)   -- throws only for an object lhs
      | .val _ => .stuck                             -- not callable: throws for any lhs
      | .stuck => .stuck
      | .timeout => .timeout
    | .stuck => .stuck
    | .timeout => .timeout
  | n+1, ρ, .ifStr i e₁ e₂ =>
    match ρ[i]? with
    | some (.str _) => eval n ρ e₁
    | some _ => eval n ρ e₂
    | none => .stuck
  | n+1, ρ, .ifNum i e₁ e₂ =>
    match ρ[i]? with
    | some (.num _) => eval n ρ e₁
    | some _ => eval n ρ e₂
    | none => .stuck

/-- The evaluator can get stuck: these are the runtime errors, by computation. One per
    structural elimination; each is a `chk-*` witness in the `any` finding. -/
example : eval 3 [] (.proj .nul "l") = .stuck := rfl                    -- chk-property-off-any
example : eval 3 [] (.elem .nul (.num 0)) = .stuck := rfl               -- chk-element-off-any
example : eval 3 [] (.app (.num 42) .nul) = .stuck := rfl               -- chk-call-any
example : eval 3 [] (.forEach (.num 42) (.lam .top (.var 0))) = .stuck := rfl -- chk-iterate-any
example : eval 3 [] (.spread (.num 42)) = .stuck := rfl                 -- chk-spread-any
example : eval 3 [] (.hasKey "l" (.num 42)) = .stuck := rfl             -- chk-in-any
example : eval 3 [] (.instOf .nul (.num 42)) = .stuck := rfl            -- chk-instanceof-any
example : eval 3 [] (.instOf (.record []) (.lam .top (.var 0))) = .stuck := rfl -- object instanceof arrow: V8 throws
example : eval 3 [] (.instOf .nul (.lam .top (.var 0))) = .val (.bool false) := rfl -- null instanceof arrow: V8 false
example : eval 3 [] (.instOf (.record []) .ctor) = .val (.bool false) := rfl      -- object instanceof class: V8 false
example : eval 3 [Val.nul] (.proj (.var 0) "l") = .stuck := rfl         -- x.l with x = null

abbrev Ctx := List Ty

def LabelsAgree {α β : Type} (xs : List (String × α)) (ys : List (String × β)) : Prop :=
  ∀ i : Nat, (xs[i]?).map Prod.fst = (ys[i]?).map Prod.fst

/-- Subtyping. What matters is what is **absent**: nothing is a supertype of `.top` except
    `.top` itself (`subTopOnlyTop`, proved below), so a `Top` never flows into a structured
    slot. `trans` is a constructor so that closure values can carry subsumption without an
    inversion lemma; nothing in the soundness proof inverts `Subty`. -/
inductive Subty : Ty → Ty → Prop where
  | refl {τ} : Subty τ τ
  | trans {τ σ υ} : Subty τ σ → Subty σ υ → Subty τ υ
  | top {τ} : Subty τ .top                               -- every type is below Top
  | record {τs σs} :
      LabelsAgree τs σs →
      (∀ (i : Nat) l τ σ, τs[i]? = some (l, τ) → σs[i]? = some (l, σ) → Subty τ σ) →
      Subty (.record τs) (.record σs)
  | arr {τ σ} : Subty τ σ → Subty (.arr τ) (.arr σ)           -- covariant (readonly arrays)
  | arrow {τ₁ τ₂ σ₁ σ₂} : Subty σ₁ τ₁ → Subty τ₂ σ₂ → Subty (.arrow τ₁ τ₂) (.arrow σ₁ σ₂)
  -- MUTANT-POINT Subty

/-- The typing judgment Γ ⊢ e : τ. Note what is **absent**: no rule concludes anything about
    `.proj`, `.elem`, `.app`, `.forEach`, `.spread`, `.hasKey` from a premise of type `.top`,
    and `.instOf` requires a constructor type on the right — not an arrow. (`.top` is concluded
    by `sub` with `Subty.top`, by `elem` for an element read, and by `var` for a `Top` in the
    context.) -/
inductive HasType : Ctx → Term → Ty → Prop where
  | var {Γ i τ} : Γ[i]? = some τ → HasType Γ (.var i) τ
  | num {Γ k} : HasType Γ (.num k) .num
  | str {Γ s} : HasType Γ (.str s) .str
  | bool {Γ b} : HasType Γ (.bool b) .bool
  | nul {Γ} : HasType Γ .nul .nul
  | undef {Γ} : HasType Γ .undef .undef
  | record {Γ fs τs} :
      LabelsAgree fs τs →
      (∀ (i : Nat) l e τ, fs[i]? = some (l, e) → τs[i]? = some (l, τ) → HasType Γ e τ) →
      HasType Γ (.record fs) (.record τs)
  | arr {Γ es τ} :
      (∀ (i : Nat) e, es[i]? = some e → HasType Γ e τ) →
      HasType Γ (.arr es) (.arr τ)
  | proj {Γ e l τs τ} :
      HasType Γ e (.record τs) → lookup τs l = some τ → HasType Γ (.proj e l) τ
  | elem {Γ e i τ} :
      HasType Γ e (.arr τ) → HasType Γ i .num → HasType Γ (.elem e i) .top
  | lam {Γ τ₁ b τ₂} : HasType (τ₁ :: Γ) b τ₂ → HasType Γ (.lam τ₁ b) (.arrow τ₁ τ₂)
  | app {Γ f a τ₁ τ₂} :
      HasType Γ f (.arrow τ₁ τ₂) → HasType Γ a τ₁ → HasType Γ (.app f a) τ₂
  | forEach {Γ e f τ σ} :
      HasType Γ e (.arr τ) → HasType Γ f (.arrow τ σ) → HasType Γ (.forEach e f) .undef
  | spread {Γ e τ} : HasType Γ e (.arr τ) → HasType Γ (.spread e) (.arr τ)
  | hasKey {Γ l e τs} : HasType Γ e (.record τs) → HasType Γ (.hasKey l e) .bool
  | ctor {Γ} : HasType Γ .ctor .ctorTy
  | instOf {Γ e f τ} : HasType Γ e τ → HasType Γ f .ctorTy → HasType Γ (.instOf e f) .bool
  | ifStr {Γ i e₁ e₂ τ} :
      i < Γ.length → HasType (Γ.set i .str) e₁ τ → HasType Γ e₂ τ →
      HasType Γ (.ifStr i e₁ e₂) τ
  | ifNum {Γ i e₁ e₂ τ} :
      i < Γ.length → HasType (Γ.set i .num) e₁ τ → HasType Γ e₂ τ →
      HasType Γ (.ifNum i e₁ e₂) τ
  | sub {Γ e τ σ} : HasType Γ e τ → Subty τ σ → HasType Γ e σ
  -- MUTANT-POINT HasType

/-- Inhabitation: a `Top` can be passed along, stored in a `Top` slot, and refined by `typeof`. -/
example : HasType [Ty.top] (.app (.lam .top (.var 0)) (.var 0)) .top :=
  .app (.lam (.var rfl)) (.var rfl)
example : HasType [Ty.top] (.ifStr 0 (.var 0) (.str "")) .str :=
  .ifStr (by decide) (.var rfl) .str
/-- An array of Tops can be built and iterated with a body that only passes elements along. -/
example : HasType [Ty.top] (.forEach (.arr [.var 0, .nul]) (.lam .top (.var 0))) .undef :=
  .forEach (.arr fun i e h => by
      cases i with
      | zero => simp at h; subst h; exact .var rfl
      | succ j => cases j with
        | zero => simp at h; subst h; exact .sub .nul .top
        | succ k => simp at h)
    (.lam (.var rfl))

/-- Typing of runtime values. `top` is unconditional: every value is a value of `Top`. -/
inductive HasVal : Val → Ty → Prop where
  | num {k} : HasVal (.num k) .num
  | str {s} : HasVal (.str s) .str
  | bool {b} : HasVal (.bool b) .bool
  | nul : HasVal .nul .nul
  | undef : HasVal .undef .undef
  | record {vs τs} :
      LabelsAgree vs τs →
      (∀ (i : Nat) l v τ, vs[i]? = some (l, v) → τs[i]? = some (l, τ) → HasVal v τ) →
      HasVal (.record vs) (.record τs)
  | arr {vs τ} : (∀ (i : Nat) v, vs[i]? = some v → HasVal v τ) → HasVal (.arr vs) (.arr τ)
  | clos {ρ Γ τ₁' b τ₂' τ₁ τ₂} :
      ρ.length = Γ.length →
      (∀ (i : Nat) v τ, ρ[i]? = some v → Γ[i]? = some τ → HasVal v τ) →
      HasType (τ₁' :: Γ) b τ₂' →
      Subty τ₁ τ₁' → Subty τ₂' τ₂ →                   -- the closure may be viewed at a supertype
      HasVal (.clos ρ τ₁' b) (.arrow τ₁ τ₂)
  | ctor : HasVal .ctor .ctorTy
  | top {v} : HasVal v .top

def EnvTyped (Γ : Ctx) (ρ : List Val) : Prop :=
  ρ.length = Γ.length ∧ ∀ (i : Nat) v τ, ρ[i]? = some v → Γ[i]? = some τ → HasVal v τ

/-! ## Lemmas about environments -/

theorem envLookup {Γ : Ctx} {ρ : List Val} {i : Nat} {τ} (h : EnvTyped Γ ρ) (hi : Γ[i]? = some τ) :
    ∃ v, ρ[i]? = some v ∧ HasVal v τ := by
  obtain ⟨hlen, hty⟩ := h
  have hlt : i < Γ.length := List.getElem?_eq_some_iff.mp hi |>.1
  have : i < ρ.length := by omega
  refine ⟨ρ[i], List.getElem?_eq_getElem this, ?_⟩
  exact hty i _ _ (List.getElem?_eq_getElem this) hi

theorem envCons {Γ : Ctx} {ρ : List Val} {v τ} (hv : HasVal v τ) (h : EnvTyped Γ ρ) :
    EnvTyped (τ :: Γ) (v :: ρ) := by
  obtain ⟨hlen, hty⟩ := h
  refine ⟨by simp [hlen], ?_⟩
  intro i w σ hw hσ
  cases i with
  | zero => simp at hw hσ; subst hw; subst hσ; exact hv
  | succ j => simp at hw hσ; exact hty j w σ hw hσ

theorem envSet {Γ : Ctx} {ρ : List Val} {i : Nat} {v τ'} (h : EnvTyped Γ ρ) (hv : ρ[i]? = some v)
    (hτ : HasVal v τ') : EnvTyped (Γ.set i τ') ρ := by
  obtain ⟨hlen, hty⟩ := h
  refine ⟨by simp [hlen], ?_⟩
  intro j w σ hw hσ
  by_cases hij : i = j
  · subst hij
    have hlt : i < Γ.length := by
      have := List.getElem?_eq_some_iff.mp hv |>.1; omega
    rw [List.getElem?_set_self hlt] at hσ
    rw [hv] at hw
    cases hw; cases hσ; exact hτ
  · rw [List.getElem?_set_ne hij] at hσ
    exact hty j w σ hw hσ

/-! ## Canonical forms. `HasVal.top` only concludes `.top`, so `cases` excludes it. -/

theorem canonRec {v τs} (h : HasVal v (.record τs)) :
    ∃ vs, v = .record vs ∧ LabelsAgree vs τs ∧
      ∀ (i : Nat) l w τ, vs[i]? = some (l, w) → τs[i]? = some (l, τ) → HasVal w τ := by
  cases h with
  | record hl hf => exact ⟨_, rfl, hl, hf⟩

theorem canonArr {v τ} (h : HasVal v (.arr τ)) :
    ∃ vs, v = .arr vs ∧ ∀ (i : Nat) w, vs[i]? = some w → HasVal w τ := by
  cases h with
  | arr hf => exact ⟨_, rfl, hf⟩

theorem canonArrow {v τ₁ τ₂} (h : HasVal v (.arrow τ₁ τ₂)) :
    ∃ ρ Γ τ₁' b τ₂', v = .clos ρ τ₁' b ∧ EnvTyped Γ ρ ∧ HasType (τ₁' :: Γ) b τ₂' ∧
      Subty τ₁ τ₁' ∧ Subty τ₂' τ₂ := by
  cases h with
  | clos hlen hty hb h₁ h₂ => exact ⟨_, _, _, _, _, rfl, ⟨hlen, hty⟩, hb, h₁, h₂⟩

/-- Values are closed under subtyping. By induction on `Subty`; `trans` composes, `arrow` uses
    the closure's wrappers, and there is no case moving a value *down* from `Top`. -/
theorem subsume {τ σ} (hs : Subty τ σ) : ∀ {v}, HasVal v τ → HasVal v σ := by
  induction hs with
  | refl => intro v h; exact h
  | trans _ _ ih₁ ih₂ => intro v h; exact ih₂ (ih₁ h)
  | top => intro v _; exact .top
  | @record τs σs hl hf ih =>
    intro v h
    obtain ⟨vs, rfl, hlv, hfv⟩ := canonRec h
    refine .record (fun i => (hlv i).trans (hl i)) ?_
    intro i l w σ' hw hσ
    have h0 := hlv i; have h1 := hl i
    rw [hw] at h0; rw [hσ] at h1
    cases hτ : τs[i]? with
    | none => rw [hτ] at h1; simp at h1
    | some p =>
      obtain ⟨l', τ'⟩ := p
      rw [hτ] at h0 h1; simp at h0 h1
      cases h0; cases h1
      exact ih i _ _ _ hτ hσ (hfv i _ _ _ hw hτ)
  | arr _ ih =>
    intro v h
    obtain ⟨vs, rfl, hvs⟩ := canonArr h
    exact .arr fun i w hw => ih (hvs i w hw)
  | arrow h₁ h₂ _ _ =>
    intro v h
    obtain ⟨ρ, Γ, τ₁', b, τ₂', rfl, henv, hb, s₁, s₂⟩ := canonArrow h
    exact .clos henv.1 henv.2 hb (.trans h₁ s₁) (.trans s₂ h₂)

theorem canonNum {v} (h : HasVal v .num) : ∃ k, v = .num k := by
  cases h with
  | num => exact ⟨_, rfl⟩

theorem canonCtor {v} (h : HasVal v .ctorTy) : v = .ctor := by
  cases h with
  | ctor => rfl

theorem lookupTyped {vs : List (String × Val)} {τs : List (String × Ty)} {l τ}
    (hl : LabelsAgree vs τs)
    (hf : ∀ (i : Nat) l w τ, vs[i]? = some (l, w) → τs[i]? = some (l, τ) → HasVal w τ)
    (hk : lookup τs l = some τ) :
    ∃ w, lookup vs l = some w ∧ HasVal w τ := by
  induction τs generalizing vs with
  | nil => simp [lookup] at hk
  | cons p rest ih =>
    obtain ⟨l', τ'⟩ := p
    have h0 := hl 0
    cases vs with
    | nil => simp at h0
    | cons q vs' =>
      obtain ⟨l'', w'⟩ := q
      simp only [List.getElem?_cons_zero, Option.map_some] at h0
      cases h0
      simp only [lookup] at hk ⊢
      by_cases heq : l' = l
      · subst heq
        simp only [if_true] at hk ⊢
        cases hk
        exact ⟨w', rfl, hf 0 _ _ _ rfl rfl⟩
      · simp only [heq, if_false] at hk ⊢
        apply ih
        · intro i; have := hl (i + 1); simpa using this
        · intro i a b c ha hb; exact hf (i + 1) a b c (by simpa using ha) (by simpa using hb)
        · exact hk

/-! ## Soundness of the list helpers, given soundness of the element evaluator -/

theorem fieldsSound {Γ : Ctx} (f : Term → Res)
    (ih : ∀ {e τ}, HasType Γ e τ → f e ≠ .stuck ∧ ∀ v, f e = .val v → HasVal v τ)
    {fs : List (String × Term)} {τs : List (String × Ty)}
    (hl : LabelsAgree fs τs)
    (hf : ∀ (i : Nat) l e τ, fs[i]? = some (l, e) → τs[i]? = some (l, τ) → HasType Γ e τ) :
    evalFieldsWith f fs ≠ .stuck ∧
      ∀ vs, evalFieldsWith f fs = .ok vs → LabelsAgree vs τs ∧
        ∀ (i : Nat) l w τ, vs[i]? = some (l, w) → τs[i]? = some (l, τ) → HasVal w τ := by
  induction fs generalizing τs with
  | nil =>
    refine ⟨by simp [evalFieldsWith], ?_⟩
    intro vs hvs
    simp [evalFieldsWith] at hvs
    subst hvs
    cases τs with
    | nil => exact ⟨fun i => rfl, fun i l w τ h _ => by simp at h⟩
    | cons p rest => have := hl 0; simp at this
  | cons p rest ihr =>
    obtain ⟨l, e⟩ := p
    have h0 := hl 0
    cases τs with
    | nil => simp at h0
    | cons q τrest =>
      obtain ⟨l', τ⟩ := q
      simp at h0
      subst h0
      have hle : HasType Γ e τ := hf 0 _ _ _ rfl rfl
      have hlr : LabelsAgree rest τrest := fun i => by have := hl (i + 1); simpa using this
      have hfr : ∀ (i : Nat) l e τ, rest[i]? = some (l, e) → τrest[i]? = some (l, τ) → HasType Γ e τ :=
        fun i a b c ha hb => hf (i + 1) a b c (by simpa using ha) (by simpa using hb)
      obtain ⟨hns, hty⟩ := ih hle
      obtain ⟨hnsr, htyr⟩ := ihr hlr hfr
      simp only [evalFieldsWith]
      cases he : f e with
      | stuck => exact absurd he hns
      | timeout => simp
      | val v =>
        have hv := hty v he
        cases hr : evalFieldsWith f rest with
        | stuck => exact absurd hr hnsr
        | timeout => simp
        | ok vs =>
          obtain ⟨hlv, hfv⟩ := htyr vs hr
          refine ⟨by simp, ?_⟩
          intro ws hws
          simp at hws
          subst hws
          refine ⟨?_, ?_⟩
          · intro i; cases i with
            | zero => rfl
            | succ j => simpa using hlv j
          · intro i a b c ha hb
            cases i with
            | zero => simp at ha hb; obtain ⟨rfl, rfl⟩ := ha; obtain ⟨_, rfl⟩ := hb; exact hv
            | succ j => simp at ha hb; exact hfv j a b c ha hb

theorem listSound {Γ : Ctx} (f : Term → Res)
    (ih : ∀ {e τ}, HasType Γ e τ → f e ≠ .stuck ∧ ∀ v, f e = .val v → HasVal v τ)
    {es : List Term} {τ : Ty}
    (hf : ∀ (i : Nat) e, es[i]? = some e → HasType Γ e τ) :
    evalListWith f es ≠ .stuck ∧
      ∀ vs, evalListWith f es = .ok vs → ∀ (i : Nat) w, vs[i]? = some w → HasVal w τ := by
  induction es with
  | nil =>
    refine ⟨by simp [evalListWith], ?_⟩
    intro vs hvs; simp [evalListWith] at hvs; subst hvs
    intro i w h; simp at h
  | cons e rest ihr =>
    have hle : HasType Γ e τ := hf 0 _ rfl
    have hfr : ∀ (i : Nat) e, rest[i]? = some e → HasType Γ e τ :=
      fun i a ha => hf (i + 1) a (by simpa using ha)
    obtain ⟨hns, hty⟩ := ih hle
    obtain ⟨hnsr, htyr⟩ := ihr hfr
    simp only [evalListWith]
    cases he : f e with
    | stuck => exact absurd he hns
    | timeout => simp
    | val v =>
      have hv := hty v he
      cases hr : evalListWith f rest with
      | stuck => exact absurd hr hnsr
      | timeout => simp
      | ok vs =>
        refine ⟨by simp, ?_⟩
        intro ws hws; simp at hws; subst hws
        intro i w hw
        cases i with
        | zero => simp at hw; subst hw; exact hv
        | succ j => simp at hw; exact htyr vs hr j w hw

theorem runEachSound (run : Val → Res) {τ : Ty}
    (ih : ∀ v, HasVal v τ → run v ≠ .stuck)
    {vs : List Val} (hvs : ∀ (i : Nat) v, vs[i]? = some v → HasVal v τ) :
    runEach run vs ≠ .stuck ∧ ∀ w, runEach run vs = .val w → HasVal w .undef := by
  induction vs with
  | nil => exact ⟨by simp [runEach], fun w h => by simp [runEach] at h; subst h; exact .undef⟩
  | cons v rest ihr =>
    have hv : HasVal v τ := hvs 0 v rfl
    have hrest : ∀ (i : Nat) v, rest[i]? = some v → HasVal v τ :=
      fun i a ha => hvs (i + 1) a (by simpa using ha)
    obtain ⟨hnsr, htyr⟩ := ihr hrest
    simp only [runEach]
    cases hr : run v with
    | stuck => exact absurd hr (ih v hv)
    | timeout => simp
    | val _ => exact ⟨hnsr, htyr⟩

/-! ## The main theorem -/

/-- **Soundness.** A well-typed term under a well-typed environment never gets stuck, and any
    value it produces has its type. Induction on fuel, then on the typing derivation. There is
    no case for an elimination applied to a `Top`, because no typing rule produces one. -/
theorem sound : ∀ (n : Nat) {Γ ρ e τ}, HasType Γ e τ → EnvTyped Γ ρ →
    eval n ρ e ≠ .stuck ∧ ∀ v, eval n ρ e = .val v → HasVal v τ := by
  intro n
  induction n with
  | zero => intro Γ ρ e τ _ _; exact ⟨by simp [eval], fun v h => by simp [eval] at h⟩
  | succ n ih =>
    intro Γ ρ e τ h henv
    induction h with
    | var hi =>
      obtain ⟨v, hv, hτ⟩ := envLookup henv hi
      exact ⟨by simp [eval, hv], fun w hw => by simp [eval, hv] at hw; subst hw; exact hτ⟩
    | num => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .num⟩
    | str => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .str⟩
    | bool => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .bool⟩
    | nul => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .nul⟩
    | undef => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .undef⟩
    | record hl hf _ =>
      obtain ⟨hns, hty⟩ := fieldsSound (eval n ρ) (fun he => ih he henv) hl hf
      simp only [eval]
      cases hr : evalFieldsWith (eval n ρ) _ with
      | stuck => exact absurd hr hns
      | timeout => simp
      | ok vs =>
        obtain ⟨hlv, hfv⟩ := hty vs hr
        exact ⟨by simp, fun v hv => by simp at hv; subst hv; exact .record hlv hfv⟩
    | arr hf _ =>
      obtain ⟨hns, hty⟩ := listSound (eval n ρ) (fun he => ih he henv) hf
      simp only [eval]
      cases hr : evalListWith (eval n ρ) _ with
      | stuck => exact absurd hr hns
      | timeout => simp
      | ok vs =>
        exact ⟨by simp, fun v hv => by simp at hv; subst hv; exact .arr (hty vs hr)⟩
    | proj he hk _ =>
      obtain ⟨hns, hty⟩ := ih he henv
      simp only [eval]
      cases hr : eval n ρ _ with
      | stuck => exact absurd hr hns
      | timeout => simp
      | val v =>
        obtain ⟨vs, rfl, hlv, hfv⟩ := canonRec (hty v hr)
        obtain ⟨w, hw, hwτ⟩ := lookupTyped hlv hfv hk
        exact ⟨by simp [hw], fun u hu => by simp [hw] at hu; subst hu; exact hwτ⟩
    | elem he hi _ _ =>
      obtain ⟨hnse, htye⟩ := ih he henv
      obtain ⟨hnsi, htyi⟩ := ih hi henv
      simp only [eval]
      cases hre : eval n ρ _ with
      | stuck => exact absurd hre hnse
      | timeout => simp
      | val v =>
        obtain ⟨vs, rfl, _⟩ := canonArr (htye v hre)
        cases hri : eval n ρ _ with
        | stuck => exact absurd hri hnsi
        | timeout => simp
        | val w =>
          obtain ⟨k, rfl⟩ := canonNum (htyi w hri)
          exact ⟨by simp, fun _ _ => .top⟩
    | lam hb =>
      exact ⟨by simp [eval], fun v hv => by
        simp [eval] at hv; subst hv; exact .clos henv.1 henv.2 hb .refl .refl⟩
    | app hf ha _ _ =>
      obtain ⟨hnsf, htyf⟩ := ih hf henv
      obtain ⟨hnsa, htya⟩ := ih ha henv
      simp only [eval]
      cases hrf : eval n ρ _ with
      | stuck => exact absurd hrf hnsf
      | timeout => simp
      | val fv =>
        obtain ⟨ρ', Γ', τ₁', b, τ₂', rfl, henv', hb, s₁, s₂⟩ := canonArrow (htyf fv hrf)
        cases hra : eval n ρ _ with
        | stuck => exact absurd hra hnsa
        | timeout => simp
        | val av =>
          have hav := subsume s₁ (htya av hra)
          obtain ⟨hns, hty⟩ := ih hb (envCons hav henv')
          exact ⟨hns, fun w hw => subsume s₂ (hty w hw)⟩
    | forEach he hf _ _ =>
      obtain ⟨hnse, htye⟩ := ih he henv
      obtain ⟨hnsf, htyf⟩ := ih hf henv
      simp only [eval]
      cases hre : eval n ρ _ with
      | stuck => exact absurd hre hnse
      | timeout => simp
      | val v =>
        obtain ⟨vs, rfl, hvs⟩ := canonArr (htye v hre)
        cases hrf : eval n ρ _ with
        | stuck => exact absurd hrf hnsf
        | timeout => simp
        | val fv =>
          obtain ⟨ρ', Γ', τ₁', b, τ₂', rfl, henv', hb, s₁, _⟩ := canonArrow (htyf fv hrf)
          exact runEachSound (fun w => eval n (w :: ρ') b)
            (fun w hw => (ih hb (envCons (subsume s₁ hw) henv')).1) hvs
    | spread he _ =>
      obtain ⟨hns, hty⟩ := ih he henv
      simp only [eval]
      cases hr : eval n ρ _ with
      | stuck => exact absurd hr hns
      | timeout => simp
      | val v =>
        obtain ⟨vs, rfl, hvs⟩ := canonArr (hty v hr)
        exact ⟨by simp, fun w hw => by simp at hw; subst hw; exact .arr hvs⟩
    | hasKey he _ =>
      obtain ⟨hns, hty⟩ := ih he henv
      simp only [eval]
      cases hr : eval n ρ _ with
      | stuck => exact absurd hr hns
      | timeout => simp
      | val v =>
        obtain ⟨vs, rfl, _⟩ := canonRec (hty v hr)
        exact ⟨by simp, fun w hw => by simp at hw; subst hw; exact .bool⟩
    | ctor => exact ⟨by simp [eval], fun v hv => by simp [eval] at hv; subst hv; exact .ctor⟩
    | instOf he hf _ _ =>
      obtain ⟨hnse, _⟩ := ih he henv
      obtain ⟨hnsf, htyf⟩ := ih hf henv
      simp only [eval]
      cases hre : eval n ρ _ with
      | stuck => exact absurd hre hnse
      | timeout => simp
      | val l =>
        cases hrf : eval n ρ _ with
        | stuck => exact absurd hrf hnsf
        | timeout => simp
        | val fv =>
          have := canonCtor (htyf fv hrf); subst this
          exact ⟨by simp, fun w hw => by simp at hw; subst hw; exact .bool⟩
    | @ifStr Γ' i e₁ e₂ τ' hi h₁ h₂ _ _ =>
      have hlt : i < ρ.length := by rw [henv.1]; exact hi
      have hget : ρ[i]? = some ρ[i] := List.getElem?_eq_getElem hlt
      simp only [eval]
      rw [hget]
      cases hv : ρ[i] with
      | str s =>
        have henv' := envSet henv (hget.trans (by rw [hv])) (HasVal.str (s := s))
        exact ih h₁ henv'
      | num _ => exact ih h₂ henv
      | bool _ => exact ih h₂ henv
      | nul => exact ih h₂ henv
      | undef => exact ih h₂ henv
      | record _ => exact ih h₂ henv
      | arr _ => exact ih h₂ henv
      | clos _ _ _ => exact ih h₂ henv
      | ctor => exact ih h₂ henv
    | @ifNum Γ' i e₁ e₂ τ' hi h₁ h₂ _ _ =>
      have hlt : i < ρ.length := by rw [henv.1]; exact hi
      have hget : ρ[i]? = some ρ[i] := List.getElem?_eq_getElem hlt
      simp only [eval]
      rw [hget]
      cases hv : ρ[i] with
      | num k =>
        have henv' := envSet henv (hget.trans (by rw [hv])) (HasVal.num (k := k))
        exact ih h₁ henv'
      | str _ => exact ih h₂ henv
      | bool _ => exact ih h₂ henv
      | nul => exact ih h₂ henv
      | undef => exact ih h₂ henv
      | record _ => exact ih h₂ henv
      | arr _ => exact ih h₂ henv
      | clos _ _ _ => exact ih h₂ henv
      | ctor => exact ih h₂ henv
    | sub _ hs ihs =>
      obtain ⟨hns, hty⟩ := ihs henv
      exact ⟨hns, fun v hv => subsume hs (hty v hv)⟩

/-- Corollary in the oracle's form: a closed, well-typed term is never stuck. -/
theorem closedNeverStuck {e τ} (h : HasType [] e τ) (n : Nat) : eval n [] e ≠ .stuck :=
  (sound n h ⟨rfl, fun i v τ hv _ => by simp at hv⟩).1

/-! ## Inversion: what is *not* derivable. Each elimination needs its structure, never `Top`. -/

theorem projNeedsRecord {Γ e l τ} (h : HasType Γ (.proj e l) τ) :
    ∃ τs σ, HasType Γ e (.record τs) ∧ lookup τs l = some σ := by
  generalize ht : Term.proj e l = t at h
  induction h with
  | proj he hk => cases ht; exact ⟨_, _, he, hk⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem appNeedsArrow {Γ f a τ} (h : HasType Γ (.app f a) τ) :
    ∃ τ₁ τ₂, HasType Γ f (.arrow τ₁ τ₂) ∧ HasType Γ a τ₁ := by
  generalize ht : Term.app f a = t at h
  induction h with
  | app hf ha _ _ => cases ht; exact ⟨_, _, hf, ha⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem elemNeedsArray {Γ e i τ} (h : HasType Γ (.elem e i) τ) :
    ∃ σ, HasType Γ e (.arr σ) := by
  generalize ht : Term.elem e i = t at h
  induction h with
  | elem he _ _ _ => cases ht; exact ⟨_, he⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem forEachNeedsArray {Γ e f τ} (h : HasType Γ (.forEach e f) τ) :
    ∃ σ, HasType Γ e (.arr σ) := by
  generalize ht : Term.forEach e f = t at h
  induction h with
  | forEach he _ _ _ => cases ht; exact ⟨_, he⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem spreadNeedsArray {Γ e τ} (h : HasType Γ (.spread e) τ) :
    ∃ σ, HasType Γ e (.arr σ) := by
  generalize ht : Term.spread e = t at h
  induction h with
  | spread he _ => cases ht; exact ⟨_, he⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem hasKeyNeedsRecord {Γ l e τ} (h : HasType Γ (.hasKey l e) τ) :
    ∃ τs, HasType Γ e (.record τs) := by
  generalize ht : Term.hasKey l e = t at h
  induction h with
  | hasKey he _ => cases ht; exact ⟨_, he⟩
  | sub _ _ ih => exact ih ht
  | _ => cases ht

theorem instOfNeedsCtor {Γ e f τ} (h : HasType Γ (.instOf e f) τ) : HasType Γ f .ctorTy := by
  generalize ht : Term.instOf e f = t at h
  induction h with
  | instOf _ hf _ _ => cases ht; exact hf
  | sub _ _ ih => exact ih ht
  | _ => cases ht

/-- Nothing is above `Top` but `Top`: the inversion that `subDown` destroys. -/
theorem subTopOnlyTop {τ σ} (h : Subty τ σ) : τ = .top → σ = .top := by
  induction h with
  | refl => intro h; exact h
  | trans _ _ ih₁ ih₂ => intro h; exact ih₂ (ih₁ h)
  | top => intro _; rfl
  | record _ _ _ => intro h; cases h
  | arr _ _ => intro h; cases h
  | arrow _ _ _ _ => intro h; cases h

/-- A variable of type `Top` has no structured type. -/
theorem topVarOnlyTop {τ} (h : HasType [Ty.top] (.var 0) τ) : τ = .top := by
  generalize hΓ : [Ty.top] = Γ at h
  generalize hv : Term.var 0 = v at h
  induction h with
  | var hi => cases hv; cases hΓ; simp at hi; exact hi.symm
  | sub _ hs ih => exact subTopOnlyTop hs (ih hΓ hv)
  | _ => cases hv

/-! ## Vacuity guard: the theorems rest on Lean's two standard axioms and nothing else. -/
#print axioms sound
#print axioms closedNeverStuck
#print axioms projNeedsRecord
#print axioms elemNeedsArray
#print axioms forEachNeedsArray
#print axioms instOfNeedsCtor
#print axioms subsume
#print axioms subTopOnlyTop
#print axioms topVarOnlyTop
