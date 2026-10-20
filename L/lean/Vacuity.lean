import Top
-- Inhabitation and `stuck` reachability are checked inline in Top.lean next to the
-- definitions. This file checks that the stuck terms are untypable in the unmutated calculus,
-- which now requires reasoning through `Subty`: a base type is below only itself and `Top`.

/-- A base type is below only itself and `Top`. -/
def IsBase : Ty → Prop
  | .num | .str | .bool | .nul | .undef => True
  | _ => False

theorem subBaseOnly {τ σ} (h : Subty τ σ) : IsBase τ → σ = τ ∨ σ = .top := by
  induction h with
  | refl => intro _; exact .inl rfl
  | trans _ _ ih₁ ih₂ =>
    intro hb
    rcases ih₁ hb with h' | h'
    · subst h'; exact ih₂ hb
    · exact .inr (subTopOnlyTop (by assumption) h')
  | top => intro _; exact .inr rfl
  | record _ _ _ => intro h; cases h
  | arr _ _ => intro h; cases h
  | arrow _ _ _ _ => intro h; cases h

theorem subNulOnly {τ σ} (h : Subty τ σ) : τ = .nul → σ = .nul ∨ σ = .top := by
  intro e; subst e; exact subBaseOnly h trivial
theorem subNumOnly {τ σ} (h : Subty τ σ) : τ = .num → σ = .num ∨ σ = .top := by
  intro e; subst e; exact subBaseOnly h trivial
theorem subStrOnly {τ σ} (h : Subty τ σ) : τ = .str → σ = .str ∨ σ = .top := by
  intro e; subst e; exact subBaseOnly h trivial
theorem subBoolOnly {τ σ} (h : Subty τ σ) : τ = .bool → σ = .bool ∨ σ = .top := by
  intro e; subst e; exact subBaseOnly h trivial
theorem subUndefOnly {τ σ} (h : Subty τ σ) : τ = .undef → σ = .undef ∨ σ = .top := by
  intro e; subst e; exact subBaseOnly h trivial

theorem nulTypes {Γ τ} (h : HasType Γ .nul τ) : τ = .nul ∨ τ = .top := by
  generalize hv : Term.nul = v at h
  induction h with
  | nul => exact .inl rfl
  | sub _ hs ih =>
    rcases ih hv with h' | h'
    · exact subNulOnly hs h'
    · exact .inr (subTopOnlyTop hs h')
  | _ => cases hv

theorem numTypes {Γ k τ} (h : HasType Γ (.num k) τ) : τ = .num ∨ τ = .top := by
  generalize hv : Term.num k = v at h
  induction h with
  | num => exact .inl rfl
  | sub _ hs ih =>
    rcases ih hv with h' | h'
    · exact subNumOnly hs h'
    · exact .inr (subTopOnlyTop hs h')
  | _ => cases hv

/-- `null.l` is untypable. -/
example : ¬ ∃ τ, HasType [] (.proj .nul "l") τ := by
  rintro ⟨τ, h⟩
  obtain ⟨τs, σ, hx, _⟩ := projNeedsRecord h
  rcases nulTypes hx with h' | h' <;> cases h'

/-- `42(null)` is untypable. -/
example : ¬ ∃ τ, HasType [] (.app (.num 42) .nul) τ := by
  rintro ⟨τ, h⟩
  obtain ⟨τ₁, τ₂, hf, _⟩ := appNeedsArrow h
  rcases numTypes hf with h' | h' <;> cases h'

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

/-- An array of Tops is below only itself and `Top`: covariance does not go down. This is
    the fact `subDown` destroys (see `mutants/subDown.nested-array.cex`). -/
theorem subArrTopOnly {τ σ} (h : Subty τ σ) : τ = .arr .top → σ = .arr .top ∨ σ = .top := by
  induction h with
  | refl => intro h; exact .inl h
  | trans _ _ ih₁ ih₂ =>
    intro h
    rcases ih₁ h with h' | h'
    · exact ih₂ h'
    · exact .inr (subTopOnlyTop (by assumption) h')
  | top => intro _; exact .inr rfl
  | record _ _ _ => intro h; cases h
  | @arr τ' σ' hs _ =>
    intro h; cases h
    exact .inl (by rw [subTopOnlyTop hs rfl])
  | arrow _ _ _ _ => intro h; cases h

example : ¬ Subty (.arr .top) (.arr (.record [])) := by
  intro h
  rcases subArrTopOnly h rfl with h' | h' <;> cases h'

/-- The sound `instanceof` rule proves: a constructor on the right, any left side. -/
example : HasType [Ty.top] (.instOf (.var 0) .ctor) .bool := .instOf (.var rfl) .ctor

/-- An arrow type is below only arrow types and `Top`. -/
theorem subArrowOnly {τ σ} (h : Subty τ σ) :
    (∃ a b, τ = .arrow a b) → (∃ a b, σ = .arrow a b) ∨ σ = .top := by
  induction h with
  | refl => intro h; exact .inl h
  | trans _ _ ih₁ ih₂ =>
    intro h
    rcases ih₁ h with h' | h'
    · exact ih₂ h'
    · exact .inr (subTopOnlyTop (by assumption) h')
  | top => intro _; exact .inr rfl
  | record _ _ _ => intro ⟨_, _, h⟩; cases h
  | arr _ _ => intro ⟨_, _, h⟩; cases h
  | arrow _ _ _ _ => intro _; exact .inl ⟨_, _, rfl⟩

theorem lamTypes {Γ τ₀ b τ} (h : HasType Γ (.lam τ₀ b) τ) : (∃ a c, τ = .arrow a c) ∨ τ = .top := by
  generalize hv : Term.lam τ₀ b = v at h
  induction h with
  | lam _ => exact .inl ⟨_, _, rfl⟩
  | sub _ hs ih =>
    rcases ih hv with h' | h'
    · exact subArrowOnly hs h'
    · exact .inr (subTopOnlyTop hs h')
  | _ => cases hv

/-- `({}) instanceof (() => 1)` is untypable: the right side is an arrow, not a constructor.
    This is instanceof-constructor's witness, which TypeScript accepts and L rejects (TS2901). -/
example : ¬ ∃ τ, HasType [] (.instOf (.record []) (.lam .top (.var 0))) τ := by
  rintro ⟨τ, h⟩
  rcases lamTypes (instOfNeedsCtor h) with ⟨_, _, h'⟩ | h' <;> cases h'
