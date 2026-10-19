import Top
-- Inhabitation and `stuck` reachability are checked inline in Top.lean next to the
-- definitions. This file checks that the stuck terms are untypable in the unmutated calculus.

example : ¬ ∃ τ, HasType [] (.proj .nul "l") τ := by
  rintro ⟨τ, h⟩
  obtain ⟨τs, σ, hx, _⟩ := projNeedsRecord h
  generalize hΓ : ([] : Ctx) = Γ at hx
  generalize hv : Term.nul = v at hx
  generalize hr : Ty.record τs = r at hx
  induction hx with
  | sub _ _ => cases hr
  | nul => cases hr
  | _ => cases hv

example : ¬ ∃ τ, HasType [] (.app (.num 42) .nul) τ := by
  rintro ⟨τ, h⟩
  obtain ⟨τ₁, τ₂, hf, _⟩ := appNeedsArrow h
  generalize hΓ : ([] : Ctx) = Γ at hf
  generalize hv : Term.num 42 = v at hf
  generalize hr : Ty.arrow τ₁ τ₂ = r at hf
  induction hf with
  | sub _ _ => cases hr
  | num => cases hr
  | _ => cases hv

/-- `x.l` with `x : Top` is untypable: the variable has only type `Top`. -/
example : ¬ ∃ τ, HasType [Ty.top] (.proj (.var 0) "l") τ := by
  rintro ⟨τ, h⟩
  obtain ⟨τs, σ, hx, _⟩ := projNeedsRecord h
  cases topVarOnlyTop hx

/-- `for (x of y)` with `y : Top` is untypable. -/
example : ¬ ∃ τ, HasType [Ty.top] (.forEach (.var 0) (.lam .top (.var 0))) τ := by
  rintro ⟨τ, h⟩
  obtain ⟨σ, hx⟩ := forEachNeedsArray h
  cases topVarOnlyTop hx
