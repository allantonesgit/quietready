const { useState, useEffect, useRef } = React;


const COLORS = {
  cream: "#F7F3ED",
  bark: "#2C2416",
  moss: "#4A5C3A",
  sage: "#7A9E6E",
  clay: "#C4773B",
  stone: "#8C8278",
  mist: "#E8E2D9",
  white: "#FDFCFA",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: COLORS.cream,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: COLORS.bark,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 48px",
    borderBottom: `1px solid ${COLORS.mist}`,
    background: COLORS.white,
  },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logoName: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: COLORS.moss,
    fontFamily: "'Georgia', serif",
  },
  logoTagline: {
    fontSize: "10px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: COLORS.stone,
    marginTop: "3px",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "80px 24px 60px",
    maxWidth: "680px",
    margin: "0 auto",
  },
  heroEyebrow: {
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: COLORS.clay,
    marginBottom: "20px",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 58px)",
    lineHeight: "1.1",
    fontWeight: "700",
    color: COLORS.bark,
    marginBottom: "20px",
    letterSpacing: "-1.5px",
  },
  heroSub: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: COLORS.stone,
    marginBottom: "40px",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "300",
  },
  ctaButton: {
    display: "inline-block",
    background: COLORS.moss,
    color: COLORS.white,
    padding: "16px 40px",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  trustRow: {
    display: "flex",
    justifyContent: "center",
    gap: "48px",
    padding: "32px 24px",
    borderTop: `1px solid ${COLORS.mist}`,
    borderBottom: `1px solid ${COLORS.mist}`,
    background: COLORS.white,
  },
  trustItem: {
    textAlign: "center",
  },
  trustNum: {
    fontSize: "28px",
    fontWeight: "700",
    color: COLORS.moss,
    letterSpacing: "-1px",
  },
  trustLabel: {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.stone,
    marginTop: "4px",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  // Questionnaire styles
  questionnaireWrap: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  progressBar: {
    height: "3px",
    background: COLORS.mist,
    borderRadius: "2px",
    marginBottom: "48px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: COLORS.moss,
    borderRadius: "2px",
    transition: "width 0.4s ease",
  },
  stepLabel: {
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.stone,
    marginBottom: "12px",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  questionTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: "700",
    letterSpacing: "-0.8px",
    lineHeight: "1.2",
    marginBottom: "8px",
    color: COLORS.bark,
  },
  questionSub: {
    fontSize: "15px",
    color: COLORS.stone,
    marginBottom: "36px",
    lineHeight: "1.6",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "300",
  },
  optionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "32px",
  },
  optionCard: {
    padding: "18px 20px",
    border: `1.5px solid ${COLORS.mist}`,
    background: COLORS.white,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
  },
  optionCardSelected: {
    border: `1.5px solid ${COLORS.moss}`,
    background: "#EDF2E8",
  },
  optionIcon: {
    fontSize: "24px",
    marginBottom: "8px",
    display: "block",
  },
  optionLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: COLORS.bark,
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  optionDesc: {
    fontSize: "12px",
    color: COLORS.stone,
    marginTop: "4px",
    fontFamily: "'Helvetica Neue', sans-serif",
    lineHeight: "1.4",
  },
  inputField: {
    width: "100%",
    padding: "14px 16px",
    border: `1.5px solid ${COLORS.mist}`,
    background: COLORS.white,
    fontSize: "16px",
    color: COLORS.bark,
    fontFamily: "'Georgia', serif",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "16px",
    transition: "border-color 0.2s ease",
  },
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  inputLabel: {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.stone,
    marginBottom: "8px",
    display: "block",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  sliderWrap: {
    marginBottom: "32px",
  },
  sliderValue: {
    fontSize: "48px",
    fontWeight: "700",
    color: COLORS.moss,
    letterSpacing: "-2px",
    marginBottom: "8px",
  },
  sliderSub: {
    fontSize: "13px",
    color: COLORS.stone,
    fontFamily: "'Helvetica Neue', sans-serif",
    marginBottom: "16px",
  },
  slider: {
    width: "100%",
    accentColor: COLORS.moss,
    height: "4px",
    marginBottom: "8px",
  },
  sliderRange: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: COLORS.stone,
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: `1px solid ${COLORS.mist}`,
  },
  btnBack: {
    background: "transparent",
    border: "none",
    color: COLORS.stone,
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', sans-serif",
    padding: "12px 0",
  },
  btnNext: {
    background: COLORS.moss,
    color: COLORS.white,
    border: "none",
    padding: "14px 36px",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "500",
    transition: "background 0.2s ease",
  },
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    border: `1.5px solid ${COLORS.mist}`,
    background: COLORS.white,
    cursor: "pointer",
    marginBottom: "10px",
    transition: "all 0.2s ease",
  },
  checkRowSelected: {
    border: `1.5px solid ${COLORS.moss}`,
    background: "#EDF2E8",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    border: `2px solid ${COLORS.mist}`,
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "1px",
    transition: "all 0.2s",
  },
  checkboxChecked: {
    background: COLORS.moss,
    border: `2px solid ${COLORS.moss}`,
  },
  containerCard: {
    border: `1.5px solid ${COLORS.mist}`,
    background: COLORS.white,
    padding: "24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "12px",
  },
  containerCardSelected: {
    border: `1.5px solid ${COLORS.clay}`,
    background: "#FDF5EE",
  },
  containerTier: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  containerName: {
    fontSize: "18px",
    fontWeight: "700",
    color: COLORS.bark,
    letterSpacing: "-0.4px",
  },
  containerPrice: {
    fontSize: "24px",
    fontWeight: "700",
    color: COLORS.clay,
    letterSpacing: "-1px",
  },
  containerStars: {
    color: COLORS.clay,
    fontSize: "16px",
    marginTop: "2px",
  },
  containerFeatures: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  containerFeature: {
    fontSize: "13px",
    color: COLORS.stone,
    fontFamily: "'Helvetica Neue', sans-serif",
    padding: "3px 0",
    display: "flex",
    gap: "8px",
  },
  planCard: {
    background: COLORS.white,
    border: `1px solid ${COLORS.mist}`,
    padding: "32px",
    marginBottom: "16px",
  },
  planSection: {
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: `1px solid ${COLORS.mist}`,
  },
  planSectionTitle: {
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.clay,
    marginBottom: "16px",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  planRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${COLORS.mist}`,
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
  },
  planTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    fontWeight: "700",
    fontSize: "18px",
    letterSpacing: "-0.4px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    background: "#EDF2E8",
    color: COLORS.moss,
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "600",
    marginLeft: "8px",
  },
  successWrap: {
    textAlign: "center",
    padding: "80px 24px",
    maxWidth: "560px",
    margin: "0 auto",
  },
  successIcon: {
    fontSize: "56px",
    marginBottom: "24px",
  },
  successTitle: {
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "-1px",
    marginBottom: "16px",
    color: COLORS.bark,
  },
  successSub: {
    fontSize: "16px",
    color: COLORS.stone,
    lineHeight: "1.7",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "300",
    marginBottom: "40px",
  },
  nextStepsList: {
    textAlign: "left",
    background: COLORS.white,
    border: `1px solid ${COLORS.mist}`,
    padding: "24px 32px",
    marginBottom: "32px",
  },
  nextStep: {
    display: "flex",
    gap: "16px",
    padding: "10px 0",
    borderBottom: `1px solid ${COLORS.mist}`,
    fontFamily: "'Helvetica Neue', sans-serif",
    fontSize: "14px",
    color: COLORS.bark,
    alignItems: "flex-start",
  },
  nextStepNum: {
    width: "24px",
    height: "24px",
    background: COLORS.moss,
    color: COLORS.white,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0,
  },
};

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

const STEPS = [
  "household",
  "caloricIntake",
  "dietary",
  "foodPhilosophy",
  "storage",
  "coverageBudget",
  "utilities",
  "equipment",
  "containers",
  "plan",
  "success",
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function OptionCard({ icon, label, desc, selected, onClick }) {
  return (
    <div
      style={{ ...styles.optionCard, ...(selected ? styles.optionCardSelected : {}) }}
      onClick={onClick}
    >
      {icon && <span style={styles.optionIcon}>{icon}</span>}
      <div style={styles.optionLabel}>{label}</div>
      {desc && <div style={styles.optionDesc}>{desc}</div>}
    </div>
  );
}

function CheckRow({ label, desc, checked, onClick }) {
  return (
    <div
      style={{ ...styles.checkRow, ...(checked ? styles.checkRowSelected : {}) }}
      onClick={onClick}
    >
      <div style={{ ...styles.checkbox, ...(checked ? styles.checkboxChecked : {}) }}>
        {checked && <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700" }}>✓</span>}
      </div>
      <div>
        <div style={{ ...styles.optionLabel, fontFamily: "'Helvetica Neue', sans-serif" }}>{label}</div>
        {desc && <div style={styles.optionDesc}>{desc}</div>}
      </div>
    </div>
  );
}

// ─── STEP COMPONENTS ──────────────────────────────────────────────────────────

function StepHousehold({ data, setData }) {
  const [morePetsOpen, setMorePetsOpen] = useState(false);

  const ageBrackets = [
    { key: "infants",  label: "Infants",  desc: "Under 2 years", icon: "👶" },
    { key: "children", label: "Children", desc: "Ages 2–12",      icon: "🧒" },
    { key: "teens",    label: "Teens",    desc: "Ages 13–17",     icon: "🧑" },
    { key: "adults",   label: "Adults",   desc: "Ages 18–64",     icon: "👤" },
    { key: "seniors",  label: "Seniors",  desc: "Ages 65+",       icon: "🧓" },
  ];

  const primaryPets = [
    { key: "dogs", label: "Dogs", icon: "🐕", sizeOptions: ["Small (<20 lbs)", "Medium (20–60 lbs)", "Large (60+ lbs)"] },
    { key: "cats", label: "Cats", icon: "🐈", sizeOptions: null },
  ];

  const morePets = [
    { key: "birds",        label: "Birds",              icon: "🦜", sizeOptions: null },
    { key: "smallAnimals", label: "Small Animals",       icon: "🐹", sizeOptions: null },
    { key: "fish",         label: "Fish / Aquatic",      icon: "🐠", sizeOptions: null },
    { key: "reptiles",     label: "Reptiles",            icon: "🦎", sizeOptions: null },
    { key: "horses",       label: "Horses / Livestock",  icon: "🐎", sizeOptions: null },
    { key: "other",        label: "Other Pets",          icon: "🐾", sizeOptions: null },
  ];

  const allPetTypes = [...primaryPets, ...morePets];

  const updateHuman = (key, delta) => {
    const val = Math.max(0, (data.household?.[key] || 0) + delta);
    setData({ ...data, household: { ...data.household, [key]: val } });
  };

  const updatePet = (key, delta) => {
    const val = Math.max(0, (data.pets?.[key]?.count || 0) + delta);
    setData({ ...data, pets: { ...data.pets, [key]: { ...data.pets?.[key], count: val } } });
  };

  const updatePetSize = (key, size) => {
    setData({ ...data, pets: { ...data.pets, [key]: { ...data.pets?.[key], size } } });
  };

  const totalPeople = ageBrackets.reduce((s, b) => s + (data.household?.[b.key] || 0), 0);
  const totalPets   = allPetTypes.reduce((s, p) => s + (data.pets?.[p.key]?.count || 0), 0);
  const morePetCount = morePets.reduce((s, p) => s + (data.pets?.[p.key]?.count || 0), 0);

  const counterBtn = (color) => ({
    width: "32px", height: "32px",
    border: `1.5px solid ${color === "green" ? COLORS.moss : COLORS.mist}`,
    background: color === "green" ? COLORS.moss : COLORS.white,
    cursor: "pointer", fontSize: "18px",
    color: color === "green" ? "#fff" : COLORS.stone,
    display: "flex", alignItems: "center", justifyContent: "center",
  });

  const PetRow = ({ p }) => {
    const count = data.pets?.[p.key]?.count || 0;
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.mist}` }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "24px" }}>{p.icon}</span>
            <div style={{ fontWeight: "600", fontSize: "15px" }}>{p.label}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => updatePet(p.key, -1)} style={counterBtn("gray")}>−</button>
            <span style={{ fontSize: "20px", fontWeight: "700", minWidth: "24px", textAlign: "center" }}>{count}</span>
            <button onClick={() => updatePet(p.key, 1)} style={counterBtn("green")}>+</button>
          </div>
        </div>
        {count > 0 && p.sizeOptions && (
          <div style={{ padding: "10px 0 14px 38px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginRight: "4px", alignSelf: "center" }}>Size:</span>
            {p.sizeOptions.map((sz) => (
              <button key={sz} onClick={() => updatePetSize(p.key, sz)} style={{
                padding: "4px 12px", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif",
                border: `1.5px solid ${data.pets?.[p.key]?.size === sz ? COLORS.moss : COLORS.mist}`,
                background: data.pets?.[p.key]?.size === sz ? "#EDF2E8" : COLORS.white,
                color: data.pets?.[p.key]?.size === sz ? COLORS.moss : COLORS.stone,
                cursor: "pointer",
              }}>{sz}</button>
            ))}
          </div>
        )}
        {count > 0 && p.key === "other" && (
          <div style={{ padding: "10px 0 14px 38px", borderBottom: `1px solid ${COLORS.mist}` }}>
            <input
              style={{ ...styles.inputField, marginBottom: 0, fontSize: "13px" }}
              placeholder="Describe your other pets (e.g. 2 guinea pigs, 1 rabbit)"
              value={data.pets?.other?.notes || ""}
              onChange={(e) => setData({ ...data, pets: { ...data.pets, other: { ...data.pets?.other, notes: e.target.value } } })}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={styles.stepLabel}>Step 1 of 10 — Your Household</div>
      <div style={styles.questionTitle}>Who are we feeding?</div>
      <div style={styles.questionSub}>
        Tell us about everyone in your household — people and pets. We'll calculate precise caloric and nutritional needs for every member of your family.
      </div>

      {/* ── People ── */}
      <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>People</div>
      <div style={{ marginBottom: "28px" }}>
        {ageBrackets.map((b) => (
          <div key={b.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.mist}` }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <span style={{ fontSize: "24px" }}>{b.icon}</span>
              <div>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>{b.label}</div>
                <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{b.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button onClick={() => updateHuman(b.key, -1)} style={counterBtn("gray")}>−</button>
              <span style={{ fontSize: "20px", fontWeight: "700", minWidth: "24px", textAlign: "center" }}>{data.household?.[b.key] || 0}</span>
              <button onClick={() => updateHuman(b.key, 1)} style={counterBtn("green")}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pets ── */}
      <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>Pets</div>
      <div style={{ marginBottom: "8px" }}>
        {/* Dogs & cats always visible */}
        {primaryPets.map((p) => <PetRow key={p.key} p={p} />)}

        {/* "More pets" toggle */}
        <button
          onClick={() => setMorePetsOpen(!morePetsOpen)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "13px 0",
            background: "transparent", border: "none",
            borderBottom: `1px solid ${COLORS.mist}`,
            cursor: "pointer", textAlign: "left",
          }}
        >
          <span style={{
            width: "22px", height: "22px", borderRadius: "50%",
            border: `1.5px solid ${COLORS.mist}`, background: COLORS.white,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", color: COLORS.stone, flexShrink: 0,
            transition: "transform 0.2s ease",
            transform: morePetsOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}>+</span>
          <span style={{ fontSize: "14px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.stone }}>
            Other pets — birds, small animals, fish, reptiles, horses
          </span>
          {morePetCount > 0 && (
            <span style={{
              marginLeft: "auto", background: COLORS.clay, color: "#fff",
              borderRadius: "12px", padding: "2px 9px",
              fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "700",
            }}>{morePetCount}</span>
          )}
        </button>

        {/* Collapsed section */}
        {morePetsOpen && (
          <div style={{ borderBottom: `1px solid ${COLORS.mist}` }}>
            {morePets.map((p) => <PetRow key={p.key} p={p} />)}
          </div>
        )}
      </div>

      {/* Summary bar */}
      {(totalPeople > 0 || totalPets > 0) && (
        <div style={{ background: "#EDF2E8", padding: "14px 18px", marginTop: "16px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "14px", color: COLORS.moss, fontWeight: "600", display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {totalPeople > 0 && <span>✓ {totalPeople} {totalPeople === 1 ? "person" : "people"}</span>}
          {totalPets > 0 && <span>🐾 {totalPets} {totalPets === 1 ? "pet" : "pets"}</span>}
        </div>
      )}
    </div>
  );
}

function StepCalories({ data, setData }) {
  // USDA DRI defaults per person per day (kcal)
  const USDA_DEFAULTS = {
    children: 1400,
    teens:    2000,
    adults:   2200,
    seniors:  1900,
  };

  const RANGES = {
    children: { min: 800,  max: 2400, step: 50 },
    teens:    { min: 1200, max: 3500, step: 50 },
    adults:   { min: 1200, max: 4000, step: 50 },
    seniors:  { min: 1000, max: 3000, step: 50 },
  };

  const LABELS = {
    children: { label: "Children",  desc: "Ages 2–12",  icon: "🧒" },
    teens:    { label: "Teens",     desc: "Ages 13–17", icon: "🧑" },
    adults:   { label: "Adults",    desc: "Ages 18–64", icon: "👤" },
    seniors:  { label: "Seniors",   desc: "Ages 65+",   icon: "🧓" },
  };

  // Initialize calories from saved data or USDA defaults
  const getCalories = (key) => {
    if (data.calories?.[key] !== undefined) return data.calories[key];
    return USDA_DEFAULTS[key];
  };

  const setCalories = (key, val) => {
    setData({ ...data, calories: { ...data.calories, [key]: val } });
  };

  const resetToDefaults = () => {
    setData({ ...data, calories: { ...USDA_DEFAULTS } });
  };

  // Only show rows for categories that have people in them
  const activeCategories = Object.keys(LABELS).filter(
    (key) => (data.household?.[key] || 0) > 0
  );

  // Calculate total daily household calories (excluding infants)
  const totalDailyCalories = activeCategories.reduce((sum, key) => {
    const count = data.household?.[key] || 0;
    return sum + count * getCalories(key);
  }, 0);

  const totalMonthlyCalories = totalDailyCalories * 30;

  const isModified = activeCategories.some(
    (key) => getCalories(key) !== USDA_DEFAULTS[key]
  );

  // Check if any defaults have been changed
  const hasData = activeCategories.length > 0;

  return (
    <div>
      <div style={styles.stepLabel}>Step 2 of 10 — Caloric Needs</div>
      <div style={styles.questionTitle}>How much should each person eat?</div>
      <div style={styles.questionSub}>
        We've pre-filled USDA recommended daily calorie targets for each age group. Adjust if you know your household eats more or less than average — this directly affects how much food we source each month.
      </div>

      {/* Sliders */}
      <div style={{ marginBottom: "28px" }}>
        {activeCategories.length === 0 && (
          <div style={{ padding: "24px", background: COLORS.white, border: `1px solid ${COLORS.mist}`, textAlign: "center", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontSize: "14px" }}>
            No household members added yet. Go back to Step 1 to add people.
          </div>
        )}

        {activeCategories.map((key) => {
          const count    = data.household?.[key] || 0;
          const kcal     = getCalories(key);
          const range    = RANGES[key];
          const meta     = LABELS[key];
          const isCustom = kcal !== USDA_DEFAULTS[key];
          const pct      = ((kcal - range.min) / (range.max - range.min)) * 100;

          return (
            <div key={key} style={{
              padding: "20px 0",
              borderBottom: `1px solid ${COLORS.mist}`,
            }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <span style={{ fontSize: "24px" }}>{meta.icon}</span>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                      {meta.label}
                      <span style={{ fontWeight: "400", color: COLORS.stone, marginLeft: "8px" }}>
                        × {count}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{meta.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: COLORS.moss, letterSpacing: "-1px", lineHeight: "1" }}>
                    {kcal.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "1px" }}>
                    kcal / day
                  </div>
                  {isCustom && (
                    <div style={{ fontSize: "10px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Customized
                    </div>
                  )}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={kcal}
                onChange={(e) => setCalories(key, parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderRange}>
                <span>{range.min.toLocaleString()} kcal</span>
                <span style={{ color: COLORS.stone, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  USDA default: {USDA_DEFAULTS[key].toLocaleString()}
                </span>
                <span>{range.max.toLocaleString()} kcal</span>
              </div>

              {/* Per-group subtotal */}
              <div style={{ marginTop: "8px", fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
                {count} {meta.label.toLowerCase()} × {kcal.toLocaleString()} = <strong style={{ color: COLORS.bark }}>{(count * kcal).toLocaleString()} kcal/day</strong> for this group
              </div>
            </div>
          );
        })}
      </div>

      {/* Infants note */}
      {(data.household?.infants || 0) > 0 && (
        <div style={{
          background: "#FDF5EE",
          border: `1px solid #F0D9C4`,
          padding: "14px 18px",
          marginBottom: "20px",
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: "13px",
          color: COLORS.bark,
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}>
          <span style={{ flexShrink: 0 }}>👶</span>
          <span>
            <strong>{data.household.infants} infant{data.household.infants > 1 ? "s" : ""}</strong> in your household.
            Infant nutrition (formula, breast milk, baby food) is handled separately and isn't included in the calorie slider above.
            We'll account for infant supplies in your plan.
          </span>
        </div>
      )}

      {/* Household total summary */}
      {hasData && totalDailyCalories > 0 && (
        <div style={{
          background: "#EDF2E8",
          padding: "18px 20px",
          fontFamily: "'Helvetica Neue', sans-serif",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.moss, marginBottom: "10px" }}>
            Your household total
          </div>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: COLORS.moss, letterSpacing: "-1px" }}>
                {totalDailyCalories.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: COLORS.stone, letterSpacing: "1px", textTransform: "uppercase" }}>kcal / day</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-1px" }}>
                {(totalMonthlyCalories / 1000000).toFixed(2)}M
              </div>
              <div style={{ fontSize: "12px", color: COLORS.stone, letterSpacing: "1px", textTransform: "uppercase" }}>kcal / month</div>
            </div>
          </div>
        </div>
      )}

      {/* Reset link */}
      {isModified && (
        <button
          onClick={resetToDefaults}
          style={{
            background: "none",
            border: "none",
            color: COLORS.stone,
            fontSize: "12px",
            fontFamily: "'Helvetica Neue', sans-serif",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            letterSpacing: "0.5px",
          }}
        >
          Reset to USDA defaults
        </button>
      )}
    </div>
  );
}

function StepDietary({ data, setData }) {
  const restrictions = [
    { key: "vegetarian", label: "Vegetarian", icon: "🥦" },
    { key: "vegan", label: "Vegan", icon: "🌱" },
    { key: "glutenFree", label: "Gluten-Free", icon: "🌾" },
    { key: "dairyFree", label: "Dairy-Free", icon: "🥛" },
    { key: "nutAllergy", label: "Nut Allergy", icon: "🥜" },
    { key: "diabetic", label: "Diabetic-Friendly", icon: "💉" },
    { key: "lowSodium", label: "Low Sodium", icon: "🧂" },
    { key: "halal", label: "Halal", icon: "☪️" },
    { key: "kosher", label: "Kosher", icon: "✡️" },
    { key: "keto", label: "Keto / Low-Carb", icon: "🥩" },
  ];

  const toggle = (key) => {
    const curr = data.dietary || {};
    setData({ ...data, dietary: { ...curr, [key]: !curr[key] } });
  };

  return (
    <div>
      <div style={styles.stepLabel}>Step 3 of 10 — Dietary Needs</div>
      <div style={styles.questionTitle}>Any dietary restrictions or allergies?</div>
      <div style={styles.questionSub}>Select all that apply. We'll filter every product recommendation to keep your household safe and comfortable.</div>
      <div style={styles.optionGrid}>
        {restrictions.map((r) => (
          <OptionCard
            key={r.key}
            icon={r.icon}
            label={r.label}
            selected={data.dietary?.[r.key]}
            onClick={() => toggle(r.key)}
          />
        ))}
      </div>
      <div style={{ marginTop: "8px" }}>
        <label style={styles.inputLabel}>Other restrictions or special medical needs</label>
        <textarea
          style={{ ...styles.inputField, height: "80px", resize: "vertical", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "14px" }}
          placeholder="e.g. kidney disease requires low potassium, severe peanut allergy (EpiPen carrier), etc."
          value={data.dietaryNotes || ""}
          onChange={(e) => setData({ ...data, dietaryNotes: e.target.value })}
        />
      </div>
    </div>
  );
}

function StepFoodPhilosophy({ data, setData }) {
  const philosophies = [
    {
      key: "wholeFood",
      icon: "🌾",
      label: "Whole Foods First",
      desc: "Real grains, legumes, canned fish & meats with clean ingredients, dried fruits, nuts — nothing artificial. The closest to how you eat today, just stored for the long term.",
    },
    {
      key: "balanced",
      icon: "⚖️",
      label: "Balanced Mix",
      desc: "A full pantry of canned meats, fish, vegetables, soups, dry staples, and some freeze-dried for convenience. The most practical, versatile option for most families.",
    },
    {
      key: "freezeDried",
      icon: "📦",
      label: "Freeze-Dried Convenience",
      desc: "High-quality freeze-dried and dehydrated meals for maximum shelf life and minimum prep time. Just add water.",
    },
    {
      key: "noPreference",
      icon: "🤷",
      label: "Best Value",
      desc: "Optimize for cost and shelf life. We'll choose whatever delivers the best nutritional value per dollar.",
    },
  ];

  const avoidances = [
    { key: "noArtificialAdditives", label: "No artificial colors, flavors, or preservatives" },
    { key: "noMSG", label: "No MSG or yeast extract" },
    { key: "noHighFructose", label: "No high-fructose corn syrup" },
    { key: "noHydrogenatedOils", label: "No hydrogenated or partially hydrogenated oils" },
    { key: "noArtificialSweeteners", label: "No artificial sweeteners (sucralose, aspartame, etc.)" },
    { key: "noSoyFillers", label: "No soy protein isolate or textured vegetable protein" },
    { key: "lowSodiumProcessed", label: "Avoid high-sodium processed foods" },
    { key: "noUltraProcessed", label: "Strictly no ultra-processed foods (NOVA Group 4)" },
    { key: "organicPreferred", label: "Organic preferred when available" },
    { key: "nonGMO", label: "Non-GMO verified products only" },
  ];

  const toggleAvoid = (key) => {
    const curr = data.foodAvoid || {};
    setData({ ...data, foodAvoid: { ...curr, [key]: !curr[key] } });
  };

  const showAvoidances = data.foodPhilosophy === "wholeFood" || data.foodPhilosophy === "balanced";

  const wholeExamples = {
    wholeFood: [
      "Canned wild-caught salmon (no salt added)",
      "Canned sardines in olive oil",
      "Canned organic chicken breast",
      "Hard red winter wheat berries (25-yr shelf life)",
      "Heirloom dried beans & lentils",
      "Canned organic diced tomatoes & green beans",
      "Raw honey & apple cider vinegar",
      "Cold-pressed olive & coconut oil",
      "Rolled oats & organic brown rice",
      "Dried herbs, sea salt & whole spices",
    ],
    balanced: [
      "Canned tuna, chicken, salmon & beef stew",
      "Canned mixed vegetables, corn & tomatoes",
      "Canned soups — minestrone, chili, chowder",
      "Canned fruit in juice — peaches, pears",
      "White rice, pasta & dried lentils",
      "Evaporated & powdered milk",
      "Peanut & almond butter",
      "Canned beans — black, kidney, chickpeas",
      "Cooking oils, salt & spice kit",
      "Some freeze-dried for convenience",
    ],
  };

  return (
    <div>
      <div style={styles.stepLabel}>Step 4 of 10 — Food Philosophy</div>
      <div style={styles.questionTitle}>How do you want to eat?</div>
      <div style={styles.questionSub}>
        Your food security plan should reflect how your family actually eats. We source real whole foods just as readily as packaged options — your values drive every purchasing decision.
      </div>

      <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
        {philosophies.map((p) => (
          <div
            key={p.key}
            onClick={() => setData({ ...data, foodPhilosophy: p.key })}
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              padding: "18px 20px",
              border: `1.5px solid ${data.foodPhilosophy === p.key ? COLORS.moss : COLORS.mist}`,
              background: data.foodPhilosophy === p.key ? "#EDF2E8" : COLORS.white,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "28px", flexShrink: 0 }}>{p.icon}</span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px", fontFamily: "'Helvetica Neue', sans-serif" }}>{p.label}</div>
              <div style={{ fontSize: "13px", color: COLORS.stone, lineHeight: "1.5", fontFamily: "'Helvetica Neue', sans-serif" }}>{p.desc}</div>
            </div>
            <div style={{
              marginLeft: "auto",
              width: "20px", height: "20px",
              borderRadius: "50%",
              border: `2px solid ${data.foodPhilosophy === p.key ? COLORS.moss : COLORS.mist}`,
              background: data.foodPhilosophy === p.key ? COLORS.moss : "transparent",
              flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {data.foodPhilosophy === p.key && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "700" }}>✓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Example foods preview */}
      {(data.foodPhilosophy === "wholeFood" || data.foodPhilosophy === "balanced") && (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, padding: "20px 24px", marginBottom: "28px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            Example items in your plan
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {(wholeExamples[data.foodPhilosophy] || []).map((item, i) => (
              <div key={i} style={{ fontSize: "13px", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ color: COLORS.sage, flexShrink: 0 }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avoidances */}
      {showAvoidances && (
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            Anything specific to avoid? (optional)
          </div>
          {avoidances.map((a) => (
            <CheckRow
              key={a.key}
              label={a.label}
              checked={data.foodAvoid?.[a.key]}
              onClick={() => toggleAvoid(a.key)}
            />
          ))}
        </div>
      )}

      {data.foodPhilosophy === "wholeFood" && (
        <div style={{ marginTop: "20px", background: "#FDF5EE", border: `1px solid #F0C89A`, padding: "14px 18px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: COLORS.clay, lineHeight: "1.6" }}>
          <strong>Note on whole food storage:</strong> Raw whole foods require proper airtight containers with oxygen absorbers for maximum shelf life. Your container kit recommendation will account for this — bulk grains and legumes need food-grade buckets or mylar bags, not standard pantry containers.
        </div>
      )}
    </div>
  );
}

function StepCoverageBudget({ data, setData }) {
  const totalPeople = Object.values(data.household || {}).reduce((s, v) => s + v, 0) || 1;
  const coverageMonths = data.coverageMonths || 3;
  const budget = data.monthlyBudget || 150;

  // ── Realistic bulk food cost per person per month of STORED supply ──
  // Validated against actual product pricing (Amazon, Costco, Walmart bulk):
  //   Balanced plan for 1 adult = ~$245-280/mo based on GPT market check
  //   Whole Foods: organic canned + bulk grains premium adds ~25%
  //   Freeze-Dried: Mountain House / Augason Farms ~$6-9/serving × 90 servings/mo
  //   Best Value: white rice, store-brand canned goods, beans — deepest discount
  const costPerPersonPerMonth = {
    wholeFood:    310,  // organic canned goods, quality oils, bulk whole grains at retail
    balanced:     260,  // canned meats/fish/veg + dry staples — ~$260/person/mo at bulk pricing
    freezeDried:  480,  // freeze-dried entree cases at $6-9/serving, 90 servings/person/mo
    noPreference: 190,  // cost-optimized: rice, beans, pasta, store-brand canned
  }[data.foodPhilosophy] || 260;

  // ── Pet food costs per month of stored supply ──
  // Dog food: ~30 lbs/mo large, ~15 lbs/mo medium, ~7 lbs/mo small (~$1.20-1.80/lb bulk)
  // Cat food: ~4 lbs dry + 12 cans wet per month (~$35-50/mo stored supply)
  const pets = data.pets || {};
  let petFoodCost = 0;
  if (pets.dogs?.count > 0) {
    const dogSizeCost = { Small: 22, Medium: 40, Large: 65 }[pets.dogs.size] || 40;
    petFoodCost += pets.dogs.count * dogSizeCost;
  }
  if (pets.cats?.count > 0) petFoodCost += pets.cats.count * 38;
  // Other pets — modest estimate
  const otherPets = (pets.birds?.count || 0) + (pets.smallAnimals?.count || 0);
  petFoodCost += otherPets * 15;

  // ── Total calculations ──
  const humanFoodCost   = Math.round(totalPeople * coverageMonths * costPerPersonPerMonth);
  const petFoodTotal    = Math.round(petFoodCost * coverageMonths);
  const totalFoodCost   = humanFoodCost + petFoodTotal;
  const withMarkup      = Math.round(totalFoodCost * 1.1);
  const effectiveBudget = Math.max(1, budget - 30);
  const monthsToGoal    = Math.max(1, Math.ceil(withMarkup / effectiveBudget));
  const grandTotal      = withMarkup + monthsToGoal * 30;

  const totalPets = (pets.dogs?.count || 0) + (pets.cats?.count || 0) + otherPets;

  // Coverage label helper
  const coverageLabel = (m) => {
    if (m < 1)  return "2 Weeks";
    if (m === 1) return "1 Month";
    if (m === 12) return "1 Year";
    return `${m} Months`;
  };

  // Milestone markers for coverage slider
  const milestones = [
    { val: 0.5, label: "2 wks" },
    { val: 1,   label: "1 mo" },
    { val: 3,   label: "3 mo" },
    { val: 6,   label: "6 mo" },
    { val: 12,  label: "1 yr" },
  ];

  const sliderPct = (val, min, max) => ((val - min) / (max - min)) * 100;

  // Sync duration key for downstream compatibility
  const durationKey = coverageMonths <= 0.5 ? "2weeks"
    : coverageMonths <= 1 ? "1month"
    : coverageMonths <= 3 ? "3months"
    : coverageMonths <= 6 ? "6months"
    : "1year";

  const update = (field, val) => {
    setData({
      ...data,
      [field]: val,
      duration: field === "coverageMonths"
        ? (val <= 0.5 ? "2weeks" : val <= 1 ? "1month" : val <= 3 ? "3months" : val <= 6 ? "6months" : "1year")
        : durationKey,
    });
  };

  const statBox = (label, value, sub, accent) => (
    <div style={{
      flex: 1, background: COLORS.white, border: `1.5px solid ${COLORS.mist}`,
      padding: "18px 20px", minWidth: "140px",
    }}>
      <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: "700", color: accent, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>{sub}</div>}
    </div>
  );

  // ── Live storage fit check — uses new two-container system (NO cans) ──
  const L = parseFloat(data.storageL) || 0;
  const W = parseFloat(data.storageW) || 0;
  const stackH = parseFloat(data.maxStack) || parseFloat(data.storageH) || 4;
  const hasSpaceData = L > 0 && W > 0;

  // Bucket vol per person per month (bulk dry goods in Mylar — NO cans)
  const bucketVolPPM_cb = {
    wholeFood: 1.40, balanced: 0.80, freezeDried: 0.20, noPreference: 0.70,
  }[data.foodPhilosophy] || 0.80;
  // Bin vol per person per month (packaged items — NO cans)
  const binVolPPM_cb = {
    wholeFood: 0.40, balanced: 0.70, freezeDried: 1.10, noPreference: 0.40,
  }[data.foodPhilosophy] || 0.70;

  const petBinVol_cb = (() => {
    let v = 0;
    if (pets.dogs?.count > 0) v += pets.dogs.count * ({ Small: 0.18, Medium: 0.38, Large: 0.70 }[pets.dogs.size] || 0.38);
    if (pets.cats?.count > 0) v += pets.cats.count * 0.22;
    return v;
  })();

  const bucketsNeeded_cb = Math.ceil((totalPeople * bucketVolPPM_cb * coverageMonths) / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const binsNeeded_cb    = Math.ceil(((totalPeople * binVolPPM_cb + petBinVol_cb) * coverageMonths) / CONTAINER_SYSTEM.bin.volumeCuFt);

  const bucketStackH_cb  = Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bucket.heightFt));
  const binStackH_cb     = Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bin.heightFt));
  const sqFtNeeded_cb    = parseFloat((
    Math.ceil(bucketsNeeded_cb / bucketStackH_cb) * CONTAINER_SYSTEM.bucket.footprintSqFt +
    Math.ceil(binsNeeded_cb    / binStackH_cb)    * CONTAINER_SYSTEM.bin.footprintSqFt
  ).toFixed(1));
  const sqFtAvailable      = L * W;
  const storageExceeded    = hasSpaceData && sqFtNeeded_cb > sqFtAvailable;
  const sqFtShort          = hasSpaceData ? Math.max(0, sqFtNeeded_cb - sqFtAvailable).toFixed(1) : 0;
  const estContainers      = bucketsNeeded_cb + binsNeeded_cb;

  // Find max coverage months that fits in the space (new container system)
  const maxFittingMonths = (() => {
    if (!hasSpaceData) return null;
    for (let m = 12; m >= 0.5; m -= 0.5) {
      const bkts  = Math.ceil((totalPeople * bucketVolPPM_cb * m) / CONTAINER_SYSTEM.bucket.volumeCuFt);
      const bns   = Math.ceil(((totalPeople * binVolPPM_cb + petBinVol_cb) * m) / CONTAINER_SYSTEM.bin.volumeCuFt);
      const sqft  =
        Math.ceil(bkts / Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bucket.heightFt))) * CONTAINER_SYSTEM.bucket.footprintSqFt +
        Math.ceil(bns  / Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bin.heightFt)))    * CONTAINER_SYSTEM.bin.footprintSqFt;
      if (sqft <= sqFtAvailable) return m;
    }
    return 0.5;
  })();

  return (
    <div>
      <div style={styles.stepLabel}>Step 6 of 10 — Coverage & Budget</div>
      <div style={styles.questionTitle}>Set your goal and pace.</div>
      <div style={styles.questionSub}>
        Drag both sliders — they talk to each other in real time. See exactly what your supply will cost and how long it takes to build.
      </div>

      {/* ── Slider 1: Coverage Duration ── */}
      <div style={{
        background: COLORS.white,
        border: `1.5px solid ${storageExceeded ? COLORS.clay : COLORS.mist}`,
        padding: "28px 28px 22px",
        marginBottom: storageExceeded ? "0" : "16px",
        transition: "border-color 0.2s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4px" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: storageExceeded ? COLORS.clay : COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "6px" }}>How long do you want to be covered?</div>
            <div style={{ fontSize: "40px", fontWeight: "700", color: storageExceeded ? COLORS.clay : COLORS.bark, letterSpacing: "-1.5px", lineHeight: 1 }}>
              {coverageLabel(coverageMonths)}
            </div>
          </div>
          {/* Live cost callout */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>Est. supply cost</div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: COLORS.moss, letterSpacing: "-1px", lineHeight: 1 }}>${withMarkup.toLocaleString()}</div>
            <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>incl. 10% markup</div>
          </div>
        </div>

        <div style={{ position: "relative", marginTop: "20px", paddingBottom: "24px" }}>
          <input
            type="range" min={0.5} max={12} step={0.5}
            value={coverageMonths}
            style={{ ...styles.slider, marginBottom: "8px" }}
            onChange={(e) => update("coverageMonths", parseFloat(e.target.value))}
          />
          {/* Milestone ticks */}
          <div style={{ position: "relative", height: "18px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            {milestones.map((m) => (
              <div
                key={m.val}
                onClick={() => update("coverageMonths", m.val)}
                style={{
                  position: "absolute",
                  left: `${sliderPct(m.val, 0.5, 12)}%`,
                  transform: "translateX(-50%)",
                  fontSize: "10px",
                  color: coverageMonths === m.val ? COLORS.clay : COLORS.stone,
                  fontWeight: coverageMonths === m.val ? "700" : "400",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >{m.label}</div>
            ))}
          </div>
        </div>

        {/* Breakdown pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
          {[
            { label: `${totalPeople} ${totalPeople === 1 ? "person" : "people"} × ${coverageMonths} mo`, val: `$${humanFoodCost.toLocaleString()}` },
            ...(totalPets > 0 ? [{ label: `${totalPets} ${totalPets === 1 ? "pet" : "pets"} × ${coverageMonths} mo`, val: `$${petFoodTotal.toLocaleString()}` }] : []),
            { label: "Service markup (10%)", val: `$${(withMarkup - totalFoodCost).toLocaleString()}` },
          ].map((p) => (
            <div key={p.label} style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, padding: "5px 12px", fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.stone }}>
              {p.label}: <strong style={{ color: COLORS.bark }}>{p.val}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ── Storage space warning ── */}
      {storageExceeded && (
        <div style={{
          background: "#FEF3E2",
          border: `1.5px solid ${COLORS.clay}`,
          borderTop: "none",
          padding: "16px 20px",
          marginBottom: "16px",
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: "13px",
          color: COLORS.bark,
          lineHeight: "1.6",
        }}>
          <div style={{ fontWeight: "700", marginBottom: "6px", color: COLORS.clay }}>
            ⚠️ {coverageLabel(coverageMonths)} of food won't fit in your {L}′ × {W}′ space
          </div>
          <div style={{ color: COLORS.stone, marginBottom: "10px" }}>
            {estContainers} containers ({bucketsNeeded_cb} buckets + {binsNeeded_cb} bins) need ~{sqFtNeeded_cb} sq ft of floor space.
            Your space has {sqFtAvailable} sq ft — {sqFtShort} sq ft short.
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {maxFittingMonths !== null && maxFittingMonths < coverageMonths && (
              <button
                onClick={() => update("coverageMonths", maxFittingMonths)}
                style={{
                  background: COLORS.moss, color: COLORS.white, border: "none",
                  padding: "8px 16px", fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif",
                }}
              >
                Reduce to {coverageLabel(maxFittingMonths)} (fits your space)
              </button>
            )}
            <div style={{ fontSize: "12px", color: COLORS.stone, display: "flex", alignItems: "center" }}>
              Or upgrade your container tier on the next screen for fewer, larger containers — or expand to multiple storage locations.
            </div>
          </div>
        </div>
      )}

      {/* ── Slider 2: Monthly Budget ── */}
      <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.mist}`, padding: "28px 28px 22px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4px" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "6px" }}>Monthly budget</div>
            <div style={{ fontSize: "40px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-1.5px", lineHeight: 1 }}>
              ${budget.toLocaleString()}<span style={{ fontSize: "18px", color: COLORS.stone, fontWeight: "400" }}>/mo</span>
            </div>
          </div>
          {/* Live months-to-goal callout */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>Months to full supply</div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: COLORS.moss, letterSpacing: "-1px", lineHeight: 1 }}>{monthsToGoal}</div>
            <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {monthsToGoal === 1 ? "month" : "months"}
            </div>
          </div>
        </div>

        <div style={{ position: "relative", marginTop: "20px", paddingBottom: "4px" }}>
          <input
            type="range" min={50} max={1000} step={25}
            value={budget}
            style={{ ...styles.slider, marginBottom: "8px" }}
            onChange={(e) => update("monthlyBudget", parseInt(e.target.value))}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
            <span>$50/mo</span><span>$1,000/mo</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          {[
            { label: "Membership fee (ongoing)", val: "$30/mo" },
            { label: "For products", val: `$${effectiveBudget}/mo` },
            { label: "Supply complete by", val: (() => { const d = new Date(); d.setMonth(d.getMonth() + monthsToGoal); return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }); })() },
          ].map((p) => (
            <div key={p.label} style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, padding: "5px 12px", fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.stone }}>
              {p.label}: <strong style={{ color: COLORS.bark }}>{p.val}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grand total summary ── */}
      <div style={{ background: "#EDF2E8", border: `1.5px solid ${COLORS.sage}`, padding: "20px 24px", fontFamily: "'Helvetica Neue', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.moss, marginBottom: "4px" }}>Est. total to build full supply</div>
            <div style={{ fontSize: "11px", color: COLORS.stone, lineHeight: "1.8" }}>
              ${withMarkup.toLocaleString()} in food & supplies over ~{monthsToGoal} months<br/>
              + $30/mo membership continues after your supply is complete
            </div>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700", color: COLORS.moss, letterSpacing: "-1.5px" }}>
            ${grandTotal.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDuration({ data, setData }) {
  // Kept for backward compatibility — redirects to coverageBudget data
  return null;
}

function StepStorage({ data, setData }) {
  return (
    <div>
      <div style={styles.stepLabel}>Step 5 of 10 — Storage Space</div>
      <div style={styles.questionTitle}>Tell us about your storage space.</div>
      <div style={styles.questionSub}>
        We'll design a container kit and organization map that fits perfectly within your available footprint.
      </div>
      <div style={styles.inputGroup}>
        <div>
          <label style={styles.inputLabel}>Length (feet)</label>
          <input type="number" style={styles.inputField} placeholder="e.g. 8" value={data.storageL || ""} onChange={(e) => setData({ ...data, storageL: e.target.value })} />
        </div>
        <div>
          <label style={styles.inputLabel}>Width (feet)</label>
          <input type="number" style={styles.inputField} placeholder="e.g. 6" value={data.storageW || ""} onChange={(e) => setData({ ...data, storageW: e.target.value })} />
        </div>
      </div>
      <div style={styles.inputGroup}>
        <div>
          <label style={styles.inputLabel}>Ceiling Height (feet)</label>
          <input type="number" style={styles.inputField} placeholder="e.g. 8" value={data.storageH || ""} onChange={(e) => setData({ ...data, storageH: e.target.value })} />
        </div>
        <div>
          <label style={styles.inputLabel}>Max Stack Height (feet)</label>
          <input type="number" style={styles.inputField} placeholder="e.g. 5" value={data.maxStack || ""} onChange={(e) => setData({ ...data, maxStack: e.target.value })} />
        </div>
      </div>
      <label style={styles.inputLabel}>Storage Location Type</label>
      <div style={styles.optionGrid}>
        {[
          { key: "basement", label: "Basement", icon: "🏚️" },
          { key: "closet", label: "Closet / Room", icon: "🚪" },
          { key: "garage", label: "Garage", icon: "🏠" },
          { key: "pantry", label: "Pantry", icon: "🗄️" },
          { key: "shed", label: "Shed / Outbuilding", icon: "🏕️" },
          { key: "multiple", label: "Multiple Locations", icon: "📦" },
        ].map((s) => (
          <OptionCard key={s.key} icon={s.icon} label={s.label} selected={data.storageType === s.key} onClick={() => setData({ ...data, storageType: s.key })} />
        ))}
      </div>
    </div>
  );
}

function StepUtilities({ data, setData }) {
  const toggle = (key) => {
    setData({ ...data, utilities: { ...data.utilities, [key]: !data.utilities?.[key] } });
  };

  const items = [
    { key: "cityWater", label: "Municipal / City Water", desc: "Tap water available during normal times", icon: "🚰" },
    { key: "wellWater", label: "Well Water", desc: "Private well on property", icon: "💧" },
    { key: "waterStorage", label: "Water Storage Tanks", desc: "You already store water", icon: "🛢️" },
    { key: "gasStove", label: "Natural Gas Stove/Oven", desc: "May work during power outages", icon: "🔥" },
    { key: "electricStove", label: "Electric Stove/Oven", desc: "Requires power to operate", icon: "⚡" },
    { key: "propane", label: "Propane / Camping Stove", desc: "Portable cooking backup", icon: "🏕️" },
    { key: "generator", label: "Generator", desc: "Backup power available", icon: "⚙️" },
    { key: "woodBurning", label: "Wood-Burning Stove / Fireplace", desc: "Can cook and heat", icon: "🪵" },
  ];

  return (
    <div>
      <div style={styles.stepLabel}>Step 7 of 10 — Utilities & Cooking</div>
      <div style={styles.questionTitle}>What utilities and cooking methods do you have access to?</div>
      <div style={styles.questionSub}>This helps us recommend foods that you can actually prepare in an emergency scenario. Select all that apply.</div>
      {items.map((item) => (
        <CheckRow key={item.key} icon={item.icon} label={item.label} desc={item.desc} checked={data.utilities?.[item.key]} onClick={() => toggle(item.key)} />
      ))}
    </div>
  );
}

function StepEquipment({ data, setData }) {
  const toggle = (key) => {
    setData({ ...data, equipment: { ...data.equipment, [key]: !data.equipment?.[key] } });
  };

  const categories = [
    {
      title: "Cooking & Kitchen",
      items: [
        { key: "portableCooker", label: "Portable Propane Cooker", desc: "High-BTU outdoor burner" },
        { key: "campCooking", label: "Camp Cooking Set", desc: "Pots, pans, utensils kit" },
        { key: "manualCanOpener", label: "Manual Can Opener", desc: "Non-electric, heavy-duty" },
        { key: "waterFilter", label: "Water Filtration System", desc: "Gravity or pump filter" },
        { key: "waterPurification", label: "Water Purification Tablets", desc: "Chemical backup option" },
      ],
    },
    {
      title: "First Aid & Medical",
      items: [
        { key: "firstAidKit", label: "Comprehensive First Aid Kit", desc: "72-hour trauma-grade kit" },
        { key: "medications", label: "30-Day Medication Reserve", desc: "Common OTC medications" },
        { key: "dentalKit", label: "Emergency Dental Kit", desc: "Temporary filling, pain relief" },
      ],
    },
    {
      title: "Power & Communication",
      items: [
        { key: "handCrankRadio", label: "Hand-Crank Emergency Radio", desc: "NOAA weather + AM/FM" },
        { key: "solarCharger", label: "Solar Phone Charger", desc: "Keep devices powered" },
        { key: "flashlights", label: "LED Flashlights + Batteries", desc: "Multiple units recommended" },
      ],
    },
    {
      title: "Sanitation",
      items: [
        { key: "campToilet", label: "Portable Camp Toilet", desc: "Self-contained flushing unit with holding tank — brands like Thetford or Camco. Requires waste disposal tablets." },
        { key: "compostToilet", label: "Composting Toilet", desc: "Waterless unit that separates and composts waste — ideal for extended use. No chemicals or water needed." },
        { key: "bucketToilet", label: "Emergency Bucket Toilet", desc: "5-gallon bucket with snap-on seat and lid. Most economical option — uses biodegradable waste bags." },
      ],
    },
    {
      title: "Warmth & Shelter",
      items: [
        { key: "emergencyBlankets", label: "Emergency Mylar Blankets", desc: "Lightweight thermal retention" },
        { key: "sleepingBags", label: "Cold-Weather Sleeping Bags", desc: "Rated to 0°F" },
      ],
    },
  ];

  return (
    <div>
      <div style={styles.stepLabel}>Step 8 of 10 — Equipment & Supplies</div>
      <div style={styles.questionTitle}>Would you like to include any of these?</div>
      <div style={styles.questionSub}>We'll source everything from reputable suppliers and include it in your monthly plan. Check what you'd like included.</div>
      {categories.map((cat) => (
        <div key={cat.title} style={{ marginBottom: "28px" }}>
          <div style={{ ...styles.planSectionTitle, marginBottom: "12px" }}>{cat.title}</div>
          {cat.items.map((item) => (
            <CheckRow key={item.key} label={item.label} desc={item.desc} checked={data.equipment?.[item.key]} onClick={() => toggle(item.key)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function StepContainers({ data, setData }) {
  // ── What goes in buckets vs bins ───────────────────────────────────────────
  // Buckets (Gamma Seal 5-gal): BULK DRY GOODS stored in Mylar bags with O2 absorbers
  //   grains, legumes, oats, flour, sugar, powdered milk, dried fruit, spices in bulk
  //   These fill to ~0.57 cu ft usable per bucket
  //
  // Bins (IRIS 82qt WeatherPro): EVERYTHING ELSE — packaged items, freeze-dried pouches,
  //   nut butters, oils (sealed), pantry kits, equipment items, mylar-pouched items
  //   These hold ~2.33 cu ft usable per bin
  //
  // CANNED GOODS: excluded from container calc — go on open shelving
  //   We suggest wire or wood shelving from the hardware store

  const totalPeople = Object.values(data.household || {}).reduce((s, v) => s + v, 0) || 1;
  const pets        = data.pets || {};
  const totalPets   = Object.values(pets).reduce((s, v) => s + (v?.count || 0), 0);
  const months      = data.coverageMonths || 3;
  const philosophy  = data.foodPhilosophy || "balanced";

  // ── Volume split by philosophy (EXCLUDING canned goods) ──────────────────
  // Bucket volume = bulk dry goods (grains, legumes, etc.) in Mylar
  // Bin volume = packaged items, freeze-dried, oils, pantry kits, etc.
  // All canned goods volumes are REMOVED from these calculations
  const bucketVolPPM = {
    wholeFood:    1.40,  // heavy on whole grains/legumes — mostly buckets
    balanced:     0.80,  // mix of grains + packaged items
    freezeDried:  0.20,  // minimal bulk dry goods
    noPreference: 0.70,  // cost-optimized = lots of rice/beans
  }[philosophy] || 0.80;

  const binVolPPM = {
    wholeFood:    0.40,  // some packaged items, oils, dried fruit
    balanced:     0.70,  // packaged items, nut butter, pantry kits
    freezeDried:  1.10,  // freeze-dried pouches/cans dominate
    noPreference: 0.40,  // minimal packaged items
  }[philosophy] || 0.70;

  // Pet food goes in bins
  const petBinVolPM = (() => {
    let v = 0;
    if (pets.dogs?.count > 0) {
      const dogVol = { Small: 0.18, Medium: 0.38, Large: 0.70 }[pets.dogs.size] || 0.38;
      v += pets.dogs.count * dogVol;
    }
    if (pets.cats?.count > 0) v += pets.cats.count * 0.22;
    return v;
  })();

  const totalBucketVol = totalPeople * bucketVolPPM * months;
  const totalBinVol    = (totalPeople * binVolPPM + petBinVolPM) * months;

  const bucketsNeeded = Math.ceil(totalBucketVol / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const binsNeeded    = Math.ceil(totalBinVol    / CONTAINER_SYSTEM.bin.volumeCuFt);

  // ── Space footprint estimate ──────────────────────────────────────────────
  const L = parseFloat(data.storageL) || 0;
  const W = parseFloat(data.storageW) || 0;
  const stackH = parseFloat(data.maxStack) || parseFloat(data.storageH) || 4;
  const hasSpaceData = L > 0 && W > 0;

  const bucketStackH = Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bucket.heightFt));
  const binStackH    = Math.max(1, Math.floor(stackH / CONTAINER_SYSTEM.bin.heightFt));

  const bucketStacks = Math.ceil(bucketsNeeded / bucketStackH);
  const binStacks    = Math.ceil(binsNeeded    / binStackH);

  const bucketSqFt = parseFloat((bucketStacks * CONTAINER_SYSTEM.bucket.footprintSqFt).toFixed(1));
  const binSqFt    = parseFloat((binStacks    * CONTAINER_SYSTEM.bin.footprintSqFt).toFixed(1));
  const totalSqFt  = parseFloat((bucketSqFt + binSqFt).toFixed(1));
  const sqFtAvail  = L * W;
  const fits       = !hasSpaceData || totalSqFt <= sqFtAvail;

  // ── Cost estimate ─────────────────────────────────────────────────────────
  const bucketCost = bucketsNeeded * CONTAINER_SYSTEM.bucket.priceEst;
  const binCost    = binsNeeded    * CONTAINER_SYSTEM.bin.priceEst;
  const myrlaKit   = Math.ceil((bucketsNeeded + binsNeeded) / 5) * 12; // ~$12 per 5-container kit
  const totalCost  = bucketCost + binCost + myrlaKit;

  const optOut = data.containerTier === "none";

  return (
    <div>
      <div style={styles.stepLabel}>Step 9 of 10 — Storage System</div>
      <div style={styles.questionTitle}>Your QuietReady storage system.</div>
      <div style={styles.questionSub}>
        Every plan uses the same proven two-container system — optimized for what each type of food needs. Canned goods go on open shelving (we'll recommend options from your local hardware store).
      </div>

      {/* ── Container count summary ── */}
      <div style={{ background: fits ? "#EDF2E8" : "#FEF3E2", border: `1.5px solid ${fits ? COLORS.sage : COLORS.clay}`, padding: "16px 20px", marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "8px" }}>
          Your estimated kit — {totalPeople} {totalPeople === 1 ? "person" : "people"}{totalPets > 0 ? ` + ${totalPets} pet${totalPets > 1 ? "s" : ""}` : ""}, {months} month{months > 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-1px" }}>{bucketsNeeded}</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>5-gal Gamma Seal buckets</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-1px" }}>{binsNeeded}</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>IRIS 82qt WeatherPro bins</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: COLORS.clay, letterSpacing: "-1px" }}>~${totalCost}</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>est. container kit total</div>
          </div>
        </div>
        {hasSpaceData && (
          <div style={{ marginTop: "10px", fontSize: "12px", color: fits ? COLORS.moss : COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {fits
              ? `✓ Fits in your ${L}′ × ${W}′ space — needs ~${totalSqFt} sq ft total`
              : `⚠️ Needs ~${totalSqFt} sq ft — your ${L}′ × ${W}′ space has ${sqFtAvail} sq ft`
            }
          </div>
        )}
      </div>

      {/* ── Two container cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>

        {/* Gamma Seal Bucket */}
        <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.mist}`, padding: "20px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>🪣</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.bark, marginBottom: "4px" }}>5-Gal Gamma Seal Bucket</div>
          <div style={{ fontSize: "11px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
            Sourced from Uline
          </div>
          <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6", marginBottom: "12px" }}>
            Food-grade HDPE with Gamma Seal spin-off lid. The gold standard for bulk dry goods. Used with Mylar bags + oxygen absorbers for 25-year storage.
          </div>
          <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>
            <strong style={{ color: COLORS.bark }}>What goes in here:</strong>
          </div>
          {["Wheat berries & whole grains", "White rice & oats", "Dried beans & lentils", "Flour, sugar, powdered milk", "Dried herbs & bulk spices"].map((item, i) => (
            <div key={i} style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", display: "flex", gap: "6px" }}>
              <span style={{ color: COLORS.sage, flexShrink: 0 }}>✓</span>{item}
            </div>
          ))}
          <div style={{ marginTop: "12px", padding: "8px 10px", background: "#EDF2E8", fontSize: "11px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600" }}>
            {bucketsNeeded} buckets in your plan · ~${bucketCost} est.
          </div>
        </div>

        {/* IRIS Remington Bin */}
        <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.mist}`, padding: "20px" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📦</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.bark, marginBottom: "4px" }}>IRIS Remington 82qt Bin</div>
          <div style={{ fontSize: "11px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
            Sourced from IRIS USA
          </div>
          <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6", marginBottom: "12px" }}>
            WeatherPro® gasket seal with metal buckles. 30"×16"×15" stackable bin — perfect for packaged items, freeze-dried pouches, and larger goods.
          </div>
          <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>
            <strong style={{ color: COLORS.bark }}>What goes in here:</strong>
          </div>
          {["Pasta, crackers & packaged dry goods", "Freeze-dried pouches & #10 cans", "Nut butters, oils (sealed)", "Pantry kit items", "Pet food (separate bins)"].map((item, i) => (
            <div key={i} style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", display: "flex", gap: "6px" }}>
              <span style={{ color: COLORS.sage, flexShrink: 0 }}>✓</span>{item}
            </div>
          ))}
          <div style={{ marginTop: "12px", padding: "8px 10px", background: "#EDF2E8", fontSize: "11px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600" }}>
            {binsNeeded} bins in your plan · ~${binCost} est.
          </div>
        </div>
      </div>

      {/* ── Mylar + O2 included ── */}
      <div style={{ background: "#FDF5EE", border: `1px solid #F0C89A`, padding: "14px 18px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "20px", flexShrink: 0 }}>🛡️</span>
        <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, marginBottom: "3px" }}>
            Mylar bags + oxygen absorbers included
          </div>
          <div style={{ fontSize: "12px", color: COLORS.stone, lineHeight: "1.6" }}>
            Every plan includes an assortment of resealable Mylar bags and oxygen absorbers sized for your bucket count. When your shipment arrives, we include step-by-step sealing instructions — no guesswork.
          </div>
        </div>
      </div>

      {/* ── Canned goods note ── */}
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, padding: "14px 18px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "20px", flexShrink: 0 }}>🥫</span>
        <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, marginBottom: "3px" }}>
            Canned goods use open shelving — not containers
          </div>
          <div style={{ fontSize: "12px", color: COLORS.stone, lineHeight: "1.6" }}>
            Canned goods don't need airtight storage — they're already sealed. Simple wire or wood shelving from your local hardware store (Home Depot, Lowe's) is all you need. Your container map will include a shelving layout recommendation.
          </div>
        </div>
      </div>

      {/* ── Opt out ── */}
      <CheckRow
        label="No thanks — I already have containers"
        desc="Skip the container kit; we'll focus on food and supplies"
        checked={optOut}
        onClick={() => setData({ ...data, containerTier: optOut ? "standard" : "none" })}
      />

      {/* Set standard as default if not yet chosen */}
      {!data.containerTier && (() => { setData({ ...data, containerTier: "standard" }); return null; })()}
    </div>
  );
}

function StepBudget({ data, setData }) {
  // Merged into StepCoverageBudget — kept as stub for compatibility
  return null;
}

function estimateMonths(data, budget) {
  const totalPeople = Object.values(data.household || {}).reduce((s, v) => s + v, 0) || 1;
  const durationMonths = { "2weeks": 0.5, "1month": 1, "3months": 3, "6months": 6, "1year": 12 }[data.duration] || (data.coverageMonths || 3);
  const costPerPersonPerMonth = { wholeFood: 310, balanced: 260, freezeDried: 480, noPreference: 190 }[data.foodPhilosophy] || 260;
  const pets = data.pets || {};
  const dogCost = (pets.dogs?.count || 0) * ({ Small: 22, Medium: 40, Large: 65 }[pets.dogs?.size] || 40);
  const catCost = (pets.cats?.count || 0) * 38;
  const petMonthly = dogCost + catCost;
  const totalFoodCost = (totalPeople * costPerPersonPerMonth + petMonthly) * durationMonths;
  const withMarkup = totalFoodCost * 1.1;
  const effectiveBudget = Math.max(1, budget - 30);
  return Math.max(1, Math.ceil(withMarkup / effectiveBudget));
}

function StepPlan({ data, setData }) {
  const totalPeople = Object.values(data.household || {}).reduce((s, v) => s + v, 0) || 1;
  const totalPets = Object.values(data.pets || {}).reduce((s, v) => s + (v?.count || 0), 0);
  const petSummary = Object.entries(data.pets || {})
    .filter(([, v]) => v?.count > 0)
    .map(([k, v]) => `${v.count} ${k}${v.size ? ` (${v.size})` : ""}`)
    .join(", ");
  const budget = data.monthlyBudget || 150;
  const productBudget = ((budget - 30) / 1.1).toFixed(0);
  const durationLabel = { "2weeks": "2 Weeks", "1month": "1 Month", "3months": "3 Months", "6months": "6 Months", "1year": "1 Year" }[data.duration] || "3 Months";
  const containerLabel = { standard: "Gamma Seal buckets + IRIS 82qt bins", none: "None (already have containers)" }[data.containerTier] || "QuietReady Standard System";
  const coverageMonths = data.coverageMonths || 3;
  const months = coverageMonths;
  const philosophy = data.foodPhilosophy || "balanced";
  const philosophyLabel = { wholeFood: "Whole Foods First 🌾", balanced: "Balanced Mix ⚖️", freezeDried: "Freeze-Dried Convenience 📦", noPreference: "Best Value 🤷" }[philosophy] || "Balanced Mix";

  const dietaryActive = Object.entries(data.dietary || {}).filter(([, v]) => v).map(([k]) => k);
  const equipmentActive = Object.entries(data.equipment || {}).filter(([, v]) => v).length;
  const avoidActive = Object.entries(data.foodAvoid || {}).filter(([, v]) => v).length;

  const foodPlans = {

    wholeFood: [
      // Grains & Starches — ~28 lbs/person/month grains total
      { item: "Whole wheat berries — sealed mylar (25-yr)", qty: `${totalPeople * 12 * months} lbs`,  cat: "Grains" },
      { item: "Organic brown & white rice",                  qty: `${totalPeople * 10 * months} lbs`,  cat: "Grains" },
      { item: "Rolled oats & steel-cut oats",                qty: `${totalPeople * 6 * months} lbs`,   cat: "Grains" },
      // Proteins
      { item: "Canned wild-caught salmon (no salt added)",   qty: `${totalPeople * 8 * months} cans`,  cat: "Protein" },
      { item: "Canned sardines in olive oil",                qty: `${totalPeople * 6 * months} cans`,  cat: "Protein" },
      { item: "Canned chunk light tuna in water",            qty: `${totalPeople * 8 * months} cans`,  cat: "Protein" },
      { item: "Canned chicken breast (no additives)",        qty: `${totalPeople * 6 * months} cans`,  cat: "Protein" },
      { item: "Heirloom dried beans & lentils",              qty: `${totalPeople * 8 * months} lbs`,   cat: "Protein" },
      // Vegetables — ~18 cans/person/month
      { item: "Canned organic diced tomatoes",               qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned organic pumpkin purée",                qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned organic green beans",                  qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned organic corn (no salt added)",         qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned organic peas",                         qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Dehydrated vegetables — additive-free",       qty: `${totalPeople * 2 * months} lbs`,   cat: "Vegetables" },
      // Fruit — ~3 cans/person/month
      { item: "Canned fruit in juice (peaches, pears)",      qty: `${totalPeople * 3 * months} cans`,  cat: "Fruit" },
      { item: "Dried fruits — raisins, dates, apricots",     qty: `${totalPeople * 1 * months} lbs`,   cat: "Fruit" },
      // Fats & Condiments
      { item: "Cold-pressed olive oil",                      qty: `${totalPeople * 1 * months} liters`,cat: "Fats" },
      { item: "Cold-pressed coconut oil",                    qty: `${Math.ceil(totalPeople * 0.5 * months)} liters`,cat: "Fats" },
      { item: "Raw honey (indefinite shelf life)",            qty: `${Math.ceil(totalPeople * 1.5 * months)} lbs`,   cat: "Sweeteners" },
      { item: "Apple cider vinegar",                         qty: `${Math.ceil(totalPeople * 0.5 * months)} bottles`,cat: "Condiments" },
      // Pantry
      { item: "Sea salt, whole peppercorns, dried herbs",    qty: "Spice kit",                cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 14 * months} gallons`,cat: "Water" },
    ],

    balanced: [
      // Grains & Starches — ~26 lbs/person/month
      { item: "Long-grain white rice (longest shelf life)",  qty: `${totalPeople * 12 * months} lbs`,  cat: "Grains" },
      { item: "Rolled oats",                                 qty: `${totalPeople * 4 * months} lbs`,   cat: "Grains" },
      { item: "Pasta — spaghetti, penne, rotini",            qty: `${totalPeople * 6 * months} lbs`,   cat: "Grains" },
      { item: "Canned baked beans",                          qty: `${totalPeople * 4 * months} cans`,  cat: "Grains" },
      // Proteins — ~4 cans/person/month per type
      { item: "Canned chunk light tuna in water",            qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Canned wild-caught salmon",                   qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Canned chicken breast",                       qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Canned beef stew",                            qty: `${totalPeople * 2 * months} cans`,  cat: "Protein" },
      { item: "Canned corned beef hash",                     qty: `${totalPeople * 2 * months} cans`,  cat: "Protein" },
      { item: "Canned sardines in olive oil",                qty: `${totalPeople * 2 * months} cans`,  cat: "Protein" },
      { item: "Dried lentils & split peas",                  qty: `${totalPeople * 4 * months} lbs`,   cat: "Protein" },
      { item: "Almond & peanut butter (sealed jars)",        qty: `${totalPeople * 2 * months} jars`,  cat: "Protein" },
      // Vegetables — 4 cans/person/month per type
      { item: "Canned diced tomatoes & tomato paste",        qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned mixed vegetables",                     qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned corn",                                 qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned green beans",                          qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned mushrooms",                            qty: `${totalPeople * 2 * months} cans`,  cat: "Vegetables" },
      { item: "Canned potatoes (diced)",                     qty: `${totalPeople * 2 * months} cans`,  cat: "Vegetables" },
      // Soups & Ready Meals — 4 cans/person/month
      { item: "Canned soups — tomato, minestrone, chili",    qty: `${totalPeople * 4 * months} cans`,  cat: "Ready Meals" },
      { item: "Canned chili with beans",                     qty: `${totalPeople * 4 * months} cans`,  cat: "Ready Meals" },
      // Fruit — 3 cans/person/month
      { item: "Canned peaches, pears & mandarin oranges",    qty: `${totalPeople * 3 * months} cans`,  cat: "Fruit" },
      { item: "Canned pineapple chunks",                     qty: `${totalPeople * 2 * months} cans`,  cat: "Fruit" },
      // Fats & Dairy — 3 cans dairy/person/month, 1.5 lbs sweeteners
      { item: "Olive oil & vegetable oil",                   qty: `${totalPeople * 1 * months} liters`,cat: "Fats" },
      { item: "Evaporated milk (canned)",                    qty: `${totalPeople * 3 * months} cans`,  cat: "Dairy" },
      { item: "Sweetened condensed milk",                    qty: `${totalPeople * 1 * months} cans`,  cat: "Dairy" },
      // Pantry
      { item: "Honey, sugar & brown sugar",                  qty: `${Math.ceil(totalPeople * 1.5 * months)} lbs`,   cat: "Sweeteners" },
      { item: "Salt, pepper, garlic powder, spice kit",      qty: "Pantry kit",               cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 14 * months} gallons`,cat: "Water" },
    ],

    freezeDried: [
      // Entrees — ~30 servings/person/month (3 meals/day × 10 days entrees)
      { item: "Freeze-dried chicken & rice entrees",         qty: `${totalPeople * 10 * months} servings`, cat: "Entrees" },
      { item: "Freeze-dried pasta & meat sauce",             qty: `${totalPeople * 10 * months} servings`, cat: "Entrees" },
      { item: "Freeze-dried beef stew",                      qty: `${totalPeople * 10 * months} servings`,  cat: "Entrees" },
      // Proteins (canned backup)
      { item: "Canned chicken breast",                       qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Canned tuna & salmon",                        qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Canned Vienna sausages & SPAM",               qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      // Vegetables — 4 cans/person/month
      { item: "Freeze-dried mixed vegetables",               qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned corn, peas & green beans",             qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      { item: "Canned diced tomatoes",                       qty: `${totalPeople * 4 * months} cans`,  cat: "Vegetables" },
      // Grains
      { item: "Instant white rice",                          qty: `${totalPeople * 6 * months} lbs`,  cat: "Grains" },
      { item: "Instant mashed potatoes",                     qty: `${totalPeople * 3 * months} lbs`,   cat: "Grains" },
      { item: "Quick-cook oatmeal packets",                  qty: `${totalPeople * 30 * months} pkts`,  cat: "Grains" },
      // Soups & Comfort — 4 cans/person/month
      { item: "Canned soups — chicken noodle, tomato",       qty: `${totalPeople * 4 * months} cans`, cat: "Soups" },
      { item: "Canned chili & stew",                         qty: `${totalPeople * 4 * months} cans`,  cat: "Soups" },
      // Fruit & Snacks — 3 cans/person/month
      { item: "Freeze-dried fruit — strawberries, apples",   qty: `${totalPeople * 2 * months} cans`,  cat: "Fruit" },
      { item: "Canned fruit cocktail & peaches",             qty: `${totalPeople * 3 * months} cans`,  cat: "Fruit" },
      { item: "Crackers, granola bars, hard candy",          qty: "Snack kit",                cat: "Snacks" },
      // Pantry
      { item: "Cooking oil, salt, bouillon cubes",           qty: "Rotation kit",             cat: "Pantry" },
      { item: "Evaporated & powdered milk",                  qty: `${totalPeople * 3 * months} cans`,  cat: "Dairy" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 14 * months} gallons`,cat: "Water" },
    ],

    noPreference: [
      // Best value mix — grains ~21 lbs/person/month
      { item: "White rice",                                  qty: `${totalPeople * 15 * months} lbs`,  cat: "Grains" },
      { item: "Pasta & egg noodles",                         qty: `${totalPeople * 6 * months} lbs`,   cat: "Grains" },
      // Proteins — ~4 cans/person/month per type
      { item: "Canned tuna, chicken & salmon",               qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Canned beef stew & chili",                    qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Canned SPAM & Vienna sausages",               qty: `${totalPeople * 4 * months} cans`,  cat: "Protein" },
      { item: "Dried beans & lentils",                       qty: `${totalPeople * 4 * months} lbs`,   cat: "Protein" },
      { item: "Peanut butter",                               qty: `${totalPeople * 2 * months} jars`,  cat: "Protein" },
      // Vegetables — 4 cans/person/month
      { item: "Canned mixed vegetables & tomatoes",          qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      // Soups — 4 cans/person/month
      { item: "Canned soups & chowders",                     qty: `${totalPeople * 4 * months} cans`, cat: "Soups" },
      // Fruit — 3 cans/person/month
      { item: "Canned fruit — peaches, pears, pineapple",    qty: `${totalPeople * 3 * months} cans`,  cat: "Fruit" },
      // Dairy — 3 cans/person/month
      { item: "Evaporated milk & powdered milk",             qty: `${totalPeople * 3 * months} cans`,  cat: "Dairy" },
      // Pantry
      { item: "Cooking oil, salt, sugar, spice kit",         qty: "Pantry kit",               cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 14 * months} gallons`,cat: "Water" },
    ],
  };

  const foodPlan = foodPlans[philosophy] || foodPlans.balanced;

  return (
    <div>
      <div style={styles.stepLabel}>Your Personalized Plan</div>
      <div style={styles.questionTitle}>Here's your QuietReady plan.</div>
      <div style={styles.questionSub}>Review your customized plan below. Once approved, we'll begin sourcing and scheduling your first delivery.</div>

      <div style={styles.planCard}>
        <div style={styles.planSection}>
          <div style={styles.planSectionTitle}>Plan Summary</div>
          <div style={styles.planRow}><span>Household size</span><span style={{ fontWeight: "600" }}>{totalPeople} {totalPeople === 1 ? "person" : "people"}</span></div>
          {totalPets > 0 && <div style={styles.planRow}><span>Pets</span><span style={{ fontWeight: "600" }}>🐾 {petSummary}</span></div>}
          <div style={styles.planRow}><span>Coverage goal</span><span style={{ fontWeight: "600" }}>{durationLabel}</span></div>
          <div style={styles.planRow}><span>Food philosophy</span><span style={{ fontWeight: "600" }}>{philosophyLabel}</span></div>
          {avoidActive > 0 && <div style={styles.planRow}><span>Ingredient filters</span><span style={{ fontWeight: "600", color: COLORS.moss }}>{avoidActive} active filters</span></div>}
          <div style={styles.planRow}><span>Est. completion</span><span style={{ fontWeight: "600" }}>{months} months</span></div>
          <div style={styles.planRow}><span>Dietary filters</span><span style={{ fontWeight: "600" }}>{dietaryActive.length > 0 ? dietaryActive.join(", ") : "None"}</span></div>
          <div style={styles.planRow}><span>Container system</span><span style={{ fontWeight: "600" }}>{containerLabel}</span></div>
          <div style={styles.planRow}><span>Equipment items</span><span style={{ fontWeight: "600" }}>{equipmentActive} selected</span></div>
        </div>

        <div style={styles.planSection}>
          <div style={styles.planSectionTitle}>Month 1 Food Plan — {philosophyLabel}</div>
          {(() => {
            const grouped = foodPlan.reduce((acc, item) => {
              const cat = item.cat || "Other";
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {});
            return Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", padding: "10px 0 4px", borderBottom: `1px dashed ${COLORS.mist}` }}>{cat}</div>
                {items.map((item, i) => (
                  <div key={i} style={{ ...styles.planRow, paddingLeft: "8px" }}>
                    <span>{item.item}</span>
                    <span style={{ fontWeight: "600", color: COLORS.moss, whiteSpace: "nowrap", marginLeft: "12px" }}>{item.qty}</span>
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>

        {totalPets > 0 && (
          <div style={styles.planSection}>
            <div style={styles.planSectionTitle}>Pet Food & Supplies</div>
            {Object.entries(data.pets || {}).filter(([, v]) => v?.count > 0).map(([k, v]) => (
              <div key={k} style={styles.planRow}>
                <span>{v.count}× {k}{v.size ? ` (${v.size})` : ""} — dry food + supplements</span>
                <span style={{ fontWeight: "600", color: COLORS.moss }}>{v.count * 15} lbs / mo</span>
              </div>
            ))}
            <div style={{ marginTop: "10px", fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.5" }}>
              Pet food is stored separately in clearly labeled containers and tracked independently in your rotation schedule.
            </div>
          </div>
        )}


        {/* Recipe PDF preview */}
        <div style={styles.planSection}>
          <div style={styles.planSectionTitle}>Your Recipe & Menu Guide</div>
          <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.7", marginBottom: "16px" }}>
            After your first shipments are confirmed in your portal, your personalized <strong style={{ color: COLORS.bark }}>Recipe & Menu PDF</strong> will be available in your portal. Every recipe is built from exactly what's been delivered and placed — with each ingredient tagged to its container location (e.g. <em>"Salmon — Container C-2"</em>). As each new supplier shipment is confirmed, the PDF regenerates automatically to reflect what's actually in your storage.
          </div>
          <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, padding: "16px 20px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "10px" }}>Sample recipe from your plan</div>
            <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "6px" }}>{philosophy === "wholeFood" ? "Whole Wheat Porridge with Honey & Dried Fruit" : philosophy === "balanced" ? "Hearty Lentil & Rice Bowl" : "Quick Freeze-Dried Chicken Stew"}</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, lineHeight: "1.8" }}>
              {philosophy === "wholeFood" ? (
                <>
                  <div>• Whole wheat berries <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Bucket A-1</span></div>
                  <div>• Raw honey <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Shelf jar S-2</span></div>
                  <div>• Dried raisins & apricots <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Bucket A-3</span></div>
                  <div>• Sea salt <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Spice tin SP-1</span></div>
                </>
              ) : philosophy === "balanced" ? (
                <>
                  <div>• Brown rice <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Bucket B-2</span></div>
                  <div>• Red lentils <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Bucket B-4</span></div>
                  <div>• Freeze-dried carrots & onions <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Can C-1</span></div>
                  <div>• Olive oil & cumin <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Oil tin O-1 / Spice SP-3</span></div>
                </>
              ) : (
                <>
                  <div>• Freeze-dried chicken <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Can FD-2</span></div>
                  <div>• Freeze-dried mixed vegetables <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Can FD-5</span></div>
                  <div>• Instant rice <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Pouch P-1</span></div>
                  <div>• Chicken bouillon <span style={{ color: COLORS.clay, fontWeight: "600" }}>→ Spice tin SP-2</span></div>
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={styles.planSectionTitle}>What Happens Next</div>
          <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: "14px", color: COLORS.stone, lineHeight: "1.7" }}>
            After approval, we'll source every item from our network of trusted suppliers — comparing prices across Amazon, Thrive Life, Emergency Essentials, and others. Each supplier ships directly to your door. As shipments are confirmed, your portal updates with placement instructions telling you exactly which container each item belongs in.
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSuccess({ data }) {
  return (
    <div style={styles.successWrap}>
      <div style={styles.successIcon}>📬</div>
      <div style={styles.successTitle}>Check your inbox.</div>
      <div style={styles.successSub}>
        We've sent a magic link to your email. Click it to set your password and access your QuietReady portal — no credit card yet.
      </div>
      <div style={styles.nextStepsList}>
        <div style={{ ...styles.planSectionTitle, marginBottom: "16px" }}>What to expect</div>
        {[
          { num: "1", text: "Click the link in your email to set your password" },
          { num: "2", text: "Explore your full personalized plan — Month 1 food list, container map, recipe guide preview" },
          { num: "3", text: "When you're ready, activate your plan with your billing & shipping info" },
          { num: "4", text: "We begin sourcing and your first shipment is scheduled" },
        ].map((step) => (
          <div key={step.num} style={{ ...styles.nextStep, borderBottom: step.num < "4" ? `1px solid ${COLORS.mist}` : "none" }}>
            <div style={styles.nextStepNum}>{step.num}</div>
            <div>{step.text}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: COLORS.stone, lineHeight: "1.6" }}>
        Your portal shows your full Month 1 plan right away. The remaining months unlock once your plan is activated.
      </div>
    </div>
  );
}

// ─── SET PASSWORD SCREEN ──────────────────────────────────────────────────────
// Shown after clicking the magic link. User sets a password, then enters portal.

function LoginScreen({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async () => {
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setSubmitting(true);
    setError("");
    try {
      // Use Supabase auth directly via exchange — sign in with password
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem("qr_token", data.accessToken);
      onLogin(data.accessToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Could not send link.");
      setMagicSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%", padding: "13px 16px", borderRadius: "8px",
    border: `1.5px solid ${focused ? COLORS.moss : COLORS.mist}`,
    fontSize: "15px", color: COLORS.bark, background: COLORS.white,
    outline: "none", fontFamily: "'Georgia', serif", boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: COLORS.white, borderRadius: "16px", padding: "48px 40px", maxWidth: "440px", width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Georgia', serif", letterSpacing: "-0.3px" }}>QuietReady.ai</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>Smart Pantry. Peace of Mind.</div>
        </div>

        {magicSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📬</div>
            <h2 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px" }}>Check your inbox</h2>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
              We sent a magic link to <strong>{email}</strong>. Click it to log in instantly.
            </p>
            <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.moss, fontSize: "14px", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600" }}>
              ← Back to home
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "26px", marginBottom: "8px", textAlign: "center" }}>👤</div>
            <h2 style={{ margin: "0 0 24px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, textAlign: "center", letterSpacing: "-0.5px" }}>Welcome back</h2>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handlePasswordLogin()}
                placeholder="jane@example.com"
                autoFocus
                style={inputStyle(false)}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handlePasswordLogin()}
                placeholder="Your password"
                style={inputStyle(false)}
              />
            </div>

            {error && (
              <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePasswordLogin}
              disabled={submitting}
              style={{ width: "100%", background: submitting ? COLORS.stone : COLORS.moss, color: COLORS.white, border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s", marginBottom: "12px" }}
            >
              {submitting ? "Signing in..." : "Sign In →"}
            </button>

            <div style={{ textAlign: "center", margin: "16px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: COLORS.mist }} />
              <span style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: COLORS.mist }} />
            </div>

            <button
              onClick={handleMagicLink}
              disabled={submitting}
              style={{ width: "100%", background: "none", border: `1.5px solid ${COLORS.mist}`, borderRadius: "10px", padding: "13px", fontSize: "14px", color: COLORS.bark, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: "16px" }}
            >
              📧 Send me a magic link instead
            </button>

            <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", fontSize: "13px", color: COLORS.stone, cursor: "pointer", fontFamily: "inherit" }}>
              ← Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LinkErrorScreen({ onBack }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleResend = async () => {
    if (!email.includes("@")) { setErrorMsg("Please enter a valid email address."); return; }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/resend-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send link.");
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: COLORS.white, borderRadius: "16px", padding: "48px 40px", maxWidth: "440px", width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Georgia', serif", letterSpacing: "-0.3px" }}>QuietReady.ai</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>Smart Pantry. Peace of Mind.</div>
        </div>
        {status === "sent" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📬</div>
            <h2 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px" }}>New link sent!</h2>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
              Check your inbox for a fresh magic link. It'll expire in 24 hours.
            </p>
            <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.moss, fontSize: "14px", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600" }}>
              ← Back to home
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "40px", marginBottom: "16px", textAlign: "center" }}>🔗</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, textAlign: "center", letterSpacing: "-0.5px" }}>This link has expired</h2>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
              Magic links expire after 24 hours. Enter your email below and we'll send a fresh one.
            </p>
            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>
              Your email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleResend()}
              placeholder="jane@example.com"
              autoFocus
              style={{ width: "100%", padding: "14px 16px", borderRadius: "8px", border: `1.5px solid ${COLORS.mist}`, fontSize: "15px", color: COLORS.bark, background: COLORS.white, outline: "none", fontFamily: "'Georgia', serif", boxSizing: "border-box", marginBottom: "16px" }}
            />
            {errorMsg && (
              <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                {errorMsg}
              </div>
            )}
            <button
              onClick={handleResend}
              disabled={status === "sending"}
              style={{ width: "100%", background: status === "sending" ? COLORS.stone : COLORS.moss, color: COLORS.white, border: "none", borderRadius: "10px", padding: "15px", fontSize: "15px", fontWeight: "700", cursor: status === "sending" ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s", marginBottom: "12px" }}
            >
              {status === "sending" ? "Sending..." : "Send a new link →"}
            </button>
            <button onClick={onBack} style={{ width: "100%", background: "none", border: "none", color: COLORS.stone, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
              ← Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SetPasswordScreen({ token, onComplete }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const [cfFocused, setCfFocused] = useState(false);

  const strength = password.length === 0 ? null
    : password.length < 8 ? "weak"
    : password.length < 12 || !/[0-9]/.test(password) ? "fair"
    : "strong";

  const strengthColor = { weak: "#B94040", fair: COLORS.clay, strong: COLORS.moss }[strength] || COLORS.mist;
  const strengthWidth = { weak: "33%", fair: "66%", strong: "100%" }[strength] || "0%";

  const handleSubmit = async () => {
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not set password.");
      // Store the token and proceed to portal
      localStorage.setItem("qr_token", data.accessToken || token);
      onComplete(data.accessToken || token);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%", padding: "14px 16px", borderRadius: "8px",
    border: `1.5px solid ${focused ? COLORS.moss : COLORS.mist}`,
    fontSize: "16px", color: COLORS.bark, background: COLORS.white,
    outline: "none", fontFamily: "'Georgia', serif", boxSizing: "border-box",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: COLORS.white, borderRadius: "16px", padding: "48px 40px", maxWidth: "440px", width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Georgia', serif", letterSpacing: "-0.3px" }}>QuietReady.ai</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>Smart Pantry. Peace of Mind.</div>
        </div>

        <div style={{ fontSize: "26px", marginBottom: "8px", textAlign: "center" }}>🔐</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, textAlign: "center", letterSpacing: "-0.5px" }}>
          Create your password
        </h2>
        <p style={{ margin: "0 0 28px", fontSize: "14px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
          You're in. Set a password to protect your account and explore your plan.
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoFocus
            style={inputStyle(pwFocused)}
            onFocus={() => setPwFocused(true)}
            onBlur={() => setPwFocused(false)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          {/* Strength bar */}
          {password.length > 0 && (
            <div style={{ marginTop: "6px" }}>
              <div style={{ height: "3px", background: COLORS.mist, borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: strengthWidth, background: strengthColor, borderRadius: "2px", transition: "width 0.3s, background 0.3s" }} />
              </div>
              <div style={{ fontSize: "11px", color: strengthColor, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px", textTransform: "capitalize" }}>{strength}</div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat password"
            style={{
              ...inputStyle(cfFocused),
              borderColor: confirm && confirm !== password ? "#F5C6C0" : cfFocused ? COLORS.moss : COLORS.mist,
            }}
            onFocus={() => setCfFocused(true)}
            onBlur={() => setCfFocused(false)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          {confirm && confirm !== password && (
            <div style={{ fontSize: "12px", color: "#B94040", fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>Passwords don't match</div>
          )}
        </div>

        {error && (
          <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !password || !confirm}
          style={{
            width: "100%", background: submitting || !password || !confirm ? COLORS.stone : COLORS.moss,
            color: COLORS.white, border: "none", borderRadius: "10px",
            padding: "15px", fontSize: "15px", fontWeight: "700",
            cursor: submitting || !password || !confirm ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "background 0.2s", letterSpacing: "0.2px",
          }}
        >
          {submitting ? "Setting up your account..." : "Enter My Portal →"}
        </button>
        <p style={{ margin: "16px 0 0", fontSize: "11px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
          You can log in with your email and this password any time.
        </p>
      </div>
    </div>
  );
}

// ─── PORTAL SYSTEM ────────────────────────────────────────────────────────────
// Shown after magic link auth. Two modes: preview (status=preview) and full (status=active)

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

// ── HouseholdChangeModal ──────────────────────────────────────────────────────
function HouseholdChangeModal({ currentHousehold, currentPets, authToken, onSaved, onClose }) {
  const [hh,      setHh]      = useState({ ...currentHousehold });
  const [pets,    setPets]     = useState({ ...currentPets });
  const [reason,  setReason]  = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const ageBrackets = [
    { key: "infants",  label: "Infants",  desc: "Under 2 years", icon: "👶" },
    { key: "children", label: "Children", desc: "Ages 2–12",      icon: "🧒" },
    { key: "teens",    label: "Teens",    desc: "Ages 13–17",     icon: "🧑" },
    { key: "adults",   label: "Adults",   desc: "Ages 18–64",     icon: "👤" },
    { key: "seniors",  label: "Seniors",  desc: "Ages 65+",       icon: "🧓" },
  ];

  const petTypes = [
    { key: "dogs", label: "Dogs", icon: "🐕", sizeOptions: ["Small (<20 lbs)", "Medium (20–60 lbs)", "Large (60+ lbs)"] },
    { key: "cats", label: "Cats", icon: "🐈", sizeOptions: null },
    { key: "birds", label: "Birds", icon: "🦜", sizeOptions: null },
    { key: "smallAnimals", label: "Small Animals", icon: "🐹", sizeOptions: null },
  ];

  const updateHh = (key, delta) => {
    setHh(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }));
  };

  const updatePet = (key, delta) => {
    setPets(prev => ({
      ...prev,
      [key]: { ...prev[key], count: Math.max(0, (prev[key]?.count || 0) + delta) }
    }));
  };

  const totalPeople = ageBrackets.reduce((s, b) => s + (hh[b.key] || 0), 0);

  // Detect any changes vs current
  const hasChanges = ageBrackets.some(b => (hh[b.key] || 0) !== (currentHousehold[b.key] || 0)) ||
    petTypes.some(p => (pets[p.key]?.count || 0) !== (currentPets[p.key]?.count || 0));

  const handleSave = async () => {
    if (!hasChanges) { onClose(); return; }
    if (totalPeople === 0) { setError("Household must have at least one person."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/portal/household", {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ household: hh, pets, reason: reason || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Save failed"); return; }
      setSuccess(true);
      setTimeout(() => { onSaved({ household: hh, pets }); onClose(); }, 1200);
    } catch { setError("Network error — please try again."); }
    finally { setSaving(false); }
  };

  const counterBtn = (color) => ({
    width: "32px", height: "32px", borderRadius: "6px",
    border: `1.5px solid ${color === "green" ? COLORS.moss : COLORS.mist}`,
    background: color === "green" ? COLORS.moss : COLORS.white,
    cursor: "pointer", fontSize: "18px", lineHeight: "1",
    color: color === "green" ? COLORS.white : COLORS.stone,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "700",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,22,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: COLORS.cream, borderRadius: "16px", width: "100%", maxWidth: "520px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 16px", borderBottom: `1px solid ${COLORS.mist}`, position: "sticky", top: 0, background: COLORS.cream, zIndex: 1 }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "4px", fontFamily: "'Helvetica Neue', sans-serif" }}>Update Plan</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.bark, fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}>Household Change</div>
          <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>
            Your plan will recalculate immediately. Your shipment schedule and quantities will update at next fulfillment.
          </div>
        </div>

        <div style={{ padding: "20px 28px" }}>
          {/* People */}
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>People</div>
          <div style={{ background: COLORS.white, borderRadius: "10px", border: `1px solid ${COLORS.mist}`, marginBottom: "20px", overflow: "hidden" }}>
            {ageBrackets.map((b, i) => {
              const prev = currentHousehold[b.key] || 0;
              const curr = hh[b.key] || 0;
              const changed = curr !== prev;
              return (
                <div key={b.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < ageBrackets.length - 1 ? `1px solid ${COLORS.mist}` : "none", background: changed ? `${COLORS.moss}08` : "transparent" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "22px" }}>{b.icon}</span>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: COLORS.bark }}>{b.label}</div>
                      <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{b.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {changed && <span style={{ fontSize: "11px", color: COLORS.moss, fontWeight: "600", fontFamily: "'Helvetica Neue', sans-serif" }}>{prev} → {curr}</span>}
                    <button onClick={() => updateHh(b.key, -1)} style={counterBtn("gray")}>−</button>
                    <span style={{ fontSize: "18px", fontWeight: "700", minWidth: "20px", textAlign: "center", color: COLORS.bark }}>{curr}</span>
                    <button onClick={() => updateHh(b.key, 1)} style={counterBtn("green")}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pets */}
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>Pets</div>
          <div style={{ background: COLORS.white, borderRadius: "10px", border: `1px solid ${COLORS.mist}`, marginBottom: "20px", overflow: "hidden" }}>
            {petTypes.map((p, i) => {
              const prev = currentPets[p.key]?.count || 0;
              const curr = pets[p.key]?.count || 0;
              const changed = curr !== prev;
              return (
                <div key={p.key}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${COLORS.mist}`, background: changed ? `${COLORS.moss}08` : "transparent" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "22px" }}>{p.icon}</span>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: COLORS.bark }}>{p.label}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {changed && <span style={{ fontSize: "11px", color: COLORS.moss, fontWeight: "600", fontFamily: "'Helvetica Neue', sans-serif" }}>{prev} → {curr}</span>}
                      <button onClick={() => updatePet(p.key, -1)} style={counterBtn("gray")}>−</button>
                      <span style={{ fontSize: "18px", fontWeight: "700", minWidth: "20px", textAlign: "center", color: COLORS.bark }}>{curr}</span>
                      <button onClick={() => updatePet(p.key, 1)} style={counterBtn("green")}>+</button>
                    </div>
                  </div>
                  {curr > 0 && p.sizeOptions && (
                    <div style={{ padding: "10px 18px 14px 52px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", gap: "8px", flexWrap: "wrap", background: changed ? `${COLORS.moss}05` : COLORS.cream }}>
                      <span style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", alignSelf: "center", marginRight: "4px" }}>Size:</span>
                      {p.sizeOptions.map(sz => (
                        <button key={sz} onClick={() => setPets(prev => ({ ...prev, [p.key]: { ...prev[p.key], size: sz } }))}
                          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif", border: `1.5px solid ${pets[p.key]?.size === sz ? COLORS.moss : COLORS.mist}`, background: pets[p.key]?.size === sz ? "#EDF2E8" : COLORS.white, color: pets[p.key]?.size === sz ? COLORS.moss : COLORS.stone, cursor: "pointer", borderRadius: "4px" }}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reason (optional) */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>Reason (optional)</div>
            <input
              type="text" value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. New baby, child moved out, caring for parent…"
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${COLORS.mist}`, borderRadius: "8px", fontSize: "13px", background: COLORS.white, color: COLORS.bark, outline: "none", boxSizing: "border-box", fontFamily: "'Helvetica Neue', sans-serif" }}
            />
          </div>

          {/* Error / success */}
          {error   && <div style={{ color: "#C45A4A", fontSize: "13px", marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>{error}</div>}
          {success && <div style={{ color: COLORS.moss, fontSize: "13px", fontWeight: "600", marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>✓ Household updated! Refreshing your plan…</div>}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onClose} disabled={saving} style={{ flex: 1, background: "none", border: `1px solid ${COLORS.mist}`, color: COLORS.stone, padding: "12px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !hasChanges || success}
              style={{ flex: 2, background: hasChanges ? COLORS.moss : COLORS.mist, color: COLORS.white, border: "none", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: hasChanges ? "pointer" : "default", fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.5px" }}>
              {saving ? "Saving…" : hasChanges ? "Save Changes" : "No Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── ActivateModal ─────────────────────────────────────────────────────────────
function ActivateModal({ customer, authToken, onActivated, onClose, containerCostTotal = 0, containerTier = "standard" }) {
  const [step, setStep] = useState(1); // 1=address, 2=payment
  const [billingAddress, setBillingAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "", country: "US" });
  const [shippingAddress, setShippingAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "", country: "US" });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [setupClientSecret, setSetupClientSecret] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [containerPaymentPref, setContainerPaymentPref] = useState("upfront"); // "upfront" | "spread"

  const mountRef = useRef(null);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState("");

  const addrValid = (a) => a.line1.trim() && a.city.trim() && a.state.trim() && a.zip.trim();

  const advanceToPayment = async () => {
    setError("");
    if (!addrValid(shippingAddress)) { setError("Please complete the shipping address."); return; }
    if (!sameAsBilling && !addrValid(billingAddress)) { setError("Please complete the billing address."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customer.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not initialize payment.");
      setSetupClientSecret(data.clientSecret);
      setStep(2);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  // Mount Stripe card element when step 2 is shown
  useEffect(() => {
    if (step !== 2 || !setupClientSecret || !mountRef.current) return;
    const tryMount = () => {
      if (!window.Stripe || !window.__STRIPE_PUBLISHABLE_KEY__) return false;
      stripeRef.current = window.Stripe(window.__STRIPE_PUBLISHABLE_KEY__);
      elementsRef.current = stripeRef.current.elements({ clientSecret: setupClientSecret });
      const card = elementsRef.current.create("payment");
      card.mount(mountRef.current);
      card.on("ready", () => setCardReady(true));
      card.on("change", (e) => setCardError(e.error ? e.error.message : ""));
      return true;
    };
    if (!tryMount()) {
      const t = setInterval(() => { if (tryMount()) clearInterval(t); }, 200);
      return () => clearInterval(t);
    }
  }, [step, setupClientSecret]);

  const handlePayment = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    setSubmitting(true); setCardError(""); setError("");
    try {
      const { setupIntent, error: stripeErr } = await stripeRef.current.confirmSetup({
        elements: elementsRef.current,
        redirect: "if_required",
      });
      if (stripeErr) { setCardError(stripeErr.message); return; }

      const effectiveShipping = sameAsBilling ? shippingAddress : shippingAddress;
      const effectiveBilling  = sameAsBilling ? shippingAddress : billingAddress;

      const res = await fetch("/api/onboarding/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentMethodId: setupIntent.payment_method,
          billingAddress: effectiveBilling,
          shippingAddress: effectiveShipping,
          containerPaymentPreference: containerPaymentPref,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed.");
      onActivated(data.customer);
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const inputStyle = (focused) => ({
    width: "100%", padding: "11px 14px", borderRadius: "6px",
    border: `1.5px solid ${focused ? COLORS.moss : COLORS.mist}`,
    fontSize: "15px", color: COLORS.bark, background: COLORS.white,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  });

  function AddrField({ label, value, onChange, placeholder, required, half }) {
    const [f, setF] = useState(false);
    return (
      <div style={{ marginBottom: "12px", ...(half ? { display: "inline-block", width: "calc(50% - 6px)" } : {}) }}>
        <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "5px", fontFamily: "'Helvetica Neue', sans-serif" }}>
          {label}{required && <span style={{ color: COLORS.clay }}> *</span>}
        </label>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={inputStyle(f)} onFocus={() => setF(true)} onBlur={() => setF(false)} />
      </div>
    );
  }

  function AddrBlock({ title, addr, setAddr }) {
    const s = (k) => (v) => setAddr({ ...addr, [k]: v });
    return (
      <div style={{ marginBottom: "8px" }}>
        {title && <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>{title}</div>}
        <AddrField label="Street address" value={addr.line1} onChange={s("line1")} placeholder="123 Main St" required />
        <AddrField label="Apt / Suite (optional)" value={addr.line2} onChange={s("line2")} placeholder="Apt 4B" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <AddrField label="City" value={addr.city} onChange={s("city")} placeholder="Springfield" required />
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "5px", fontFamily: "'Helvetica Neue', sans-serif" }}>State <span style={{ color: COLORS.clay }}>*</span></label>
            <select value={addr.state} onChange={e => s("state")(e.target.value)} style={{ ...inputStyle(false), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%238C8278' d='M5 6L0 0h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px" }}>
              <option value="">Select</option>
              {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </div>
        </div>
        <AddrField label="ZIP code" value={addr.zip} onChange={s("zip")} placeholder="62701" required />
      </div>
    );
  }

  const budget = customer?.preferences?.monthly_budget || 150;
  const productAmt = budget - 30;
  const months = customer?.preferences?.coverage_months || 3;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,36,22,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: COLORS.white, borderRadius: "16px", maxWidth: "520px", width: "100%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 28px 72px rgba(0,0,0,0.25)" }}>

        {/* Header */}
        <div style={{ padding: "26px 32px 18px", borderBottom: `1px solid ${COLORS.mist}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            {[1, 2].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: n <= step ? COLORS.moss : COLORS.mist, color: n <= step ? COLORS.white : COLORS.stone, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif" }}>
                  {n < step ? "✓" : n}
                </div>
                <div style={{ fontSize: "11px", color: n === step ? COLORS.bark : COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: n === step ? "700" : "400" }}>
                  {["Delivery & Billing", "Payment"][n - 1]}
                </div>
                {n < 2 && <div style={{ width: "20px", height: "1px", background: COLORS.mist, margin: "0 4px" }} />}
              </div>
            ))}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.4px" }}>
            {step === 1 ? "Where should we ship?" : "Secure payment"}
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {step === 1 ? "Enter your delivery address. Your first shipment is your container kit." : `$${budget}/mo billed monthly. Cancel anytime.`}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 32px", overflowY: "auto", flex: 1 }}>
          {step === 1 && (
            <div>
              <AddrBlock title="Shipping address" addr={shippingAddress} setAddr={setShippingAddress} />
              <div onClick={() => setSameAsBilling(!sameAsBilling)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer", userSelect: "none" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "3px", border: `2px solid ${sameAsBilling ? COLORS.moss : COLORS.mist}`, background: sameAsBilling ? COLORS.moss : COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {sameAsBilling && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "700" }}>✓</span>}
                </div>
                <span style={{ fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.bark }}>Billing address is the same as shipping</span>
              </div>
              {!sameAsBilling && (
                <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px dashed ${COLORS.mist}` }}>
                  <AddrBlock title="Billing address" addr={billingAddress} setAddr={setBillingAddress} />
                </div>
              )}

              {/* Container payment choice — props computed in Portal to avoid snake_case/camelCase issues */}
              {containerTier !== "none" && containerCostTotal > 0 && (() => {
                const tierLabel = containerTier === "none" ? "None" : "QuietReady Standard Kit";
                const perMonth  = Math.ceil(containerCostTotal / 3);
                const optStyle  = (active) => ({
                  flex: 1, padding: "12px 14px", borderRadius: "8px", cursor: "pointer",
                  border: `2px solid ${active ? COLORS.moss : COLORS.mist}`,
                  background: active ? `${COLORS.moss}10` : COLORS.white,
                  transition: "all 0.15s ease",
                });
                return (
                  <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: `1px solid ${COLORS.mist}` }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Container kit payment</div>
                    <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "12px" }}>
                      Your {tierLabel} containers arrive in Shipment 1. How would you like to pay the est. <strong style={{ color: COLORS.bark }}>${containerCostTotal}</strong>?
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div onClick={() => setContainerPaymentPref("upfront")} style={optStyle(containerPaymentPref === "upfront")}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "3px" }}>Pay upfront</div>
                        <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>Added to Month 1 bill</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "6px" }}>${containerCostTotal} once</div>
                      </div>
                      <div onClick={() => setContainerPaymentPref("spread")} style={optStyle(containerPaymentPref === "spread")}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "3px" }}>Spread it out</div>
                        <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>Over first 3 shipments</div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "6px" }}>${perMonth}/mo × 3</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Plan summary */}
              <div style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, borderRadius: "8px", padding: "14px 18px", marginBottom: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "10px", fontFamily: "'Helvetica Neue', sans-serif" }}>Your plan</div>
                {[
                  ["Coverage", `${months} months`],
                  ["Monthly membership", "$30.00"],
                  ["Monthly food budget", `$${productAmt}.00`],
                  ["Total monthly charge", `$${budget}.00`],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.mist}` : "none", fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                    <span style={{ color: COLORS.stone }}>{k}</span>
                    <span style={{ color: COLORS.bark, fontWeight: i === arr.length - 1 ? "700" : "400" }}>{v}</span>
                  </div>
                ))}
              </div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                Card details <span style={{ color: COLORS.clay }}>*</span>
              </label>
              <div ref={mountRef} style={{ border: `1.5px solid ${COLORS.mist}`, borderRadius: "6px", padding: "12px 14px", background: COLORS.white, minHeight: "44px" }} />
              {!cardReady && <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "6px" }}>Loading secure payment form...</div>}
              {cardError && <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginTop: "10px", fontFamily: "'Helvetica Neue', sans-serif" }}>{cardError}</div>}
              <div style={{ marginTop: "12px", fontSize: "11px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif" }}>🔒 Secured by Stripe · SSL encrypted</div>
            </div>
          )}

          {error && <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginTop: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 32px 24px", borderTop: `1px solid ${COLORS.mist}`, flexShrink: 0 }}>
          {step === 1 && (
            <button onClick={advanceToPayment} disabled={submitting} style={{ width: "100%", background: submitting ? COLORS.stone : COLORS.moss, color: COLORS.white, border: "none", borderRadius: "8px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: "10px" }}>
              {submitting ? "Please wait..." : "Continue to Payment →"}
            </button>
          )}
          {step === 2 && (
            <button onClick={handlePayment} disabled={submitting || !cardReady} style={{ width: "100%", background: submitting || !cardReady ? COLORS.stone : COLORS.clay, color: COLORS.white, border: "none", borderRadius: "8px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: submitting || !cardReady ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: "10px" }}>
              {submitting ? "Activating your plan..." : `Activate My Plan — $${budget}/mo →`}
            </button>
          )}
          <button onClick={step === 1 ? onClose : () => setStep(1)} style={{ width: "100%", background: "none", border: "none", fontSize: "13px", color: COLORS.stone, cursor: "pointer", fontFamily: "inherit" }}>
            ← {step === 1 ? "Not yet — keep exploring" : "Back to address"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Equipment catalog — single source of truth for labels, prices, categories ─
const EQUIPMENT_CATALOG = [
  { key: "portableCooker",    label: "Portable Propane Cooker",      desc: "High-BTU outdoor burner",                    price: 49,  cat: "Cooking & Kitchen",      catIcon: "🍳" },
  { key: "campCooking",       label: "Camp Cooking Set",              desc: "Pots, pans, utensils kit",                   price: 35,  cat: "Cooking & Kitchen",      catIcon: "🍳" },
  { key: "manualCanOpener",   label: "Manual Can Opener",             desc: "Non-electric, heavy-duty",                   price: 12,  cat: "Cooking & Kitchen",      catIcon: "🍳" },
  { key: "waterFilter",       label: "Water Filtration System",       desc: "Gravity or pump filter",                     price: 89,  cat: "Cooking & Kitchen",      catIcon: "🍳" },
  { key: "waterPurification", label: "Water Purification Tablets",    desc: "Chemical backup option",                     price: 14,  cat: "Cooking & Kitchen",      catIcon: "🍳" },
  { key: "firstAidKit",       label: "Comprehensive First Aid Kit",   desc: "72-hour trauma-grade kit",                   price: 65,  cat: "First Aid & Medical",    catIcon: "🩺" },
  { key: "medications",       label: "30-Day Medication Reserve",     desc: "Common OTC medications",                     price: 45,  cat: "First Aid & Medical",    catIcon: "🩺" },
  { key: "dentalKit",         label: "Emergency Dental Kit",          desc: "Temporary filling, pain relief",             price: 22,  cat: "First Aid & Medical",    catIcon: "🩺" },
  { key: "handCrankRadio",    label: "Hand-Crank Emergency Radio",    desc: "NOAA weather + AM/FM",                       price: 39,  cat: "Power & Communication",  catIcon: "📡" },
  { key: "solarCharger",      label: "Solar Phone Charger",           desc: "Keep devices powered",                       price: 55,  cat: "Power & Communication",  catIcon: "📡" },
  { key: "flashlights",       label: "LED Flashlights + Batteries",   desc: "Multiple units recommended",                 price: 28,  cat: "Power & Communication",  catIcon: "📡" },
  { key: "campToilet",        label: "Portable Camp Toilet",          desc: "Self-contained with holding tank",           price: 95,  cat: "Sanitation",             catIcon: "🚿" },
  { key: "compostToilet",     label: "Composting Toilet",             desc: "Waterless, no chemicals needed",             price: 179, cat: "Sanitation",             catIcon: "🚿" },
  { key: "bucketToilet",      label: "Emergency Bucket Toilet",       desc: "5-gallon with biodegradable bags",           price: 29,  cat: "Sanitation",             catIcon: "🚿" },
  { key: "emergencyBlankets", label: "Emergency Mylar Blankets",      desc: "Lightweight thermal retention",              price: 18,  cat: "Warmth & Shelter",       catIcon: "🏕️" },
  { key: "sleepingBags",      label: "Cold-Weather Sleeping Bags",    desc: "Rated to 0°F",                               price: 89,  cat: "Warmth & Shelter",       catIcon: "🏕️" },
];

// ── QuietReady Standard Container System ────────────────────────────────────
// All plans use the same two-container mix. No tiers. No choices (except opt-out).
//
// BUCKET: 5-gallon HDPE food-grade bucket + Gamma Seal lid (sourced from Uline)
//   Footprint: 12" × 12" = 1.0 sq ft  |  Height: 14.5" = 1.208 ft
//   Usable volume: 0.57 cu ft (5 gal × 0.85 fill efficiency)
//   Used for: bulk dry goods in Mylar bags — grains, legumes, oats, sugar, flour, etc.
//   Price est: ~$18/bucket + lid
//
// BIN: IRIS Remington 82 QT WeatherPro Gasket Box (sourced from IRIS USA directly)
//   Footprint: 30" × 16" = 3.33 sq ft  |  Height: 15.3" = 1.275 ft
//   Usable volume: 2.33 cu ft (82 qt × 0.85 fill efficiency)
//   Used for: packaged dry goods, freeze-dried pouches/cans, mylar-bagged loose items
//   Price est: ~$50/bin
//
// MYLAR + O2: Assorted resealable Mylar bags + oxygen absorbers included with every plan.
//
// CANNED GOODS: NOT stored in containers. Cans go on open shelving (customer-supplied).
//   Customers can get wire/wood shelving from their local hardware store.
//   Canned goods are excluded from all container volume calculations.
const CONTAINER_SYSTEM = {
  bucket: {
    label:        "5-gal Gamma Seal Bucket",
    source:       "Uline",
    footprintSqFt: 1.0,
    heightFt:     1.208,
    volumeCuFt:   0.57,
    priceEst:     18,
  },
  bin: {
    label:        "IRIS Remington 82qt WeatherPro Bin",
    source:       "IRIS USA",
    footprintSqFt: 3.33,
    heightFt:     1.275,
    volumeCuFt:   2.33,
    priceEst:     50,
  },
};

// ── ExtrasSection ─────────────────────────────────────────────────────────────
function ExtrasSection({ formData, authToken, isPreview }) {
  const equipment = formData?.preferences?.equipment || {};
  const [localEquip, setLocalEquip] = useState(equipment);
  const [saving, setSaving] = useState(null);

  useEffect(() => { setLocalEquip(formData?.preferences?.equipment || {}); }, [formData]);

  // Derive container info — new standard system (buckets + bins)
  const containerTier   = formData?.containerTier || "standard";
  const containerLabel  = containerTier === "none" ? "None (already have containers)" : "Gamma Seal Buckets + IRIS 82qt Bins";
  const totalPeople     = Object.values(formData?.household || {}).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0) || 2;
  const months          = formData?.coverageMonths || 3;
  const philosophy      = formData?.foodPhilosophy || "balanced";

  const bucketVolPPM_es = { wholeFood: 1.40, balanced: 0.80, freezeDried: 0.20, noPreference: 0.70 }[philosophy] || 0.80;
  const binVolPPM_es    = { wholeFood: 0.40, balanced: 0.70, freezeDried: 1.10, noPreference: 0.40 }[philosophy] || 0.70;
  const containerCount  = containerTier === "none" ? 0 :
    Math.ceil((totalPeople * bucketVolPPM_es * months) / CONTAINER_SYSTEM.bucket.volumeCuFt) +
    Math.ceil((totalPeople * binVolPPM_es    * months) / CONTAINER_SYSTEM.bin.volumeCuFt);
  const bucketsEs = containerTier === "none" ? 0 : Math.ceil((totalPeople * bucketVolPPM_es * months) / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const binsEs    = containerTier === "none" ? 0 : Math.ceil((totalPeople * binVolPPM_es    * months) / CONTAINER_SYSTEM.bin.volumeCuFt);
  const containerUnitPrice = Math.round((bucketsEs * CONTAINER_SYSTEM.bucket.priceEst + binsEs * CONTAINER_SYSTEM.bin.priceEst) / Math.max(1, containerCount));
  const containerTotal  = bucketsEs * CONTAINER_SYSTEM.bucket.priceEst + binsEs * CONTAINER_SYSTEM.bin.priceEst + Math.ceil((bucketsEs + binsEs) / 5) * 12;

  // Selected equipment items, ordered by catalog position
  const selectedItems   = EQUIPMENT_CATALOG.filter(i => localEquip[i.key]);
  const midpoint        = Math.ceil(selectedItems.length / 2);
  const ship1Items      = selectedItems.slice(0, midpoint);
  const ship2Items      = selectedItems.slice(midpoint);

  // Group all items by category for display
  const cats = [...new Set(EQUIPMENT_CATALOG.map(i => i.cat))];

  const toggle = async (key) => {
    if (isPreview) return;
    const newVal = !localEquip[key];
    setLocalEquip(prev => ({ ...prev, [key]: newVal }));
    setSaving(key);
    try {
      await fetch("/api/portal/preferences/equipment", {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: newVal }),
      });
    } catch {
      setLocalEquip(prev => ({ ...prev, [key]: !newVal }));
    } finally {
      setSaving(null);
    }
  };

  const equipTotal = selectedItems.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ marginTop: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>Beyond Food</div>
        <div style={{ fontSize: "20px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px" }}>Equipment & Supplies</div>
        <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "4px" }}>
          {isPreview
            ? "Items you selected during setup. Activate to manage your add-ons."
            : `${selectedItems.length} item${selectedItems.length !== 1 ? "s" : ""} selected · sourced alongside your food shipments`}
        </div>
      </div>

      {/* Shipment 1 — Containers */}
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.cream }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>📦</span>
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Storage Containers</span>
            <span style={{ fontSize: "10px", background: `${COLORS.moss}20`, color: COLORS.moss, padding: "2px 8px", borderRadius: "10px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif" }}>Shipment 1</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. ${containerTotal}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>
              {bucketsEs}× Gamma Seal 5-gal buckets + {binsEs}× IRIS 82qt WeatherPro bins
            </div>
            <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>Delivered with your first food shipment · includes Mylar bags + oxygen absorbers</div>
          </div>
          <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", textAlign: "right" }}>
            <div style={{ fontWeight: "600", color: COLORS.clay }}>Est. retail</div>
          </div>
        </div>
      </div>

      {/* Shipment 1 equipment */}
      {ship1Items.length > 0 && (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.cream }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>🛠️</span>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Equipment — Batch 1</span>
              <span style={{ fontSize: "10px", background: `${COLORS.moss}20`, color: COLORS.moss, padding: "2px 8px", borderRadius: "10px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif" }}>Shipment 1</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. ${ship1Items.reduce((s, i) => s + i.price, 0)}</span>
          </div>
          {ship1Items.map(item => (
            <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${COLORS.mist}` }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>${item.price}</div>
                <div style={{ fontSize: "10px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. retail</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipment 2 equipment */}
      {ship2Items.length > 0 && (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.cream }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>🛠️</span>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Equipment — Batch 2</span>
              <span style={{ fontSize: "10px", background: `${COLORS.clay}20`, color: COLORS.clay, padding: "2px 8px", borderRadius: "10px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif" }}>Shipment 2</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. ${ship2Items.reduce((s, i) => s + i.price, 0)}</span>
          </div>
          {ship2Items.map(item => (
            <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${COLORS.mist}` }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>${item.price}</div>
                <div style={{ fontSize: "10px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. retail</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total summary */}
      {(selectedItems.length > 0 || containerCount > 0) && (
        <div style={{ background: COLORS.bark, borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.cream }}>Total one-time add-ons</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, marginTop: "2px" }}>Containers + {selectedItems.length} equipment item{selectedItems.length !== 1 ? "s" : ""} · billed separately from monthly food</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.cream, fontFamily: "Georgia, serif" }}>Est. ${containerTotal + equipTotal}</div>
            <div style={{ fontSize: "10px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>Est. retail · final pricing at fulfillment</div>
          </div>
        </div>
      )}

      {/* Add / remove items section */}
      <div style={{ marginTop: "8px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "12px" }}>
          {isPreview ? "Selected during setup" : "Manage add-ons"}
        </div>
        {cats.map(cat => {
          const catItems   = EQUIPMENT_CATALOG.filter(i => i.cat === cat);
          const catIcon    = catItems[0]?.catIcon || "📦";
          const catSelected = catItems.filter(i => localEquip[i.key]);
          if (isPreview && catSelected.length === 0) return null;

          return (
            <div key={cat} style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.mist}`, display: "flex", alignItems: "center", gap: "10px", background: COLORS.cream }}>
                <span style={{ fontSize: "16px" }}>{catIcon}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>{cat}</span>
                {catSelected.length > 0 && (
                  <span style={{ fontSize: "10px", background: `${COLORS.moss}20`, color: COLORS.moss, padding: "2px 8px", borderRadius: "10px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif" }}>
                    {catSelected.length} selected
                  </span>
                )}
              </div>
              {catItems.map(item => {
                const isSelected = !!localEquip[item.key];
                const isSaving   = saving === item.key;
                const shipNum    = ship1Items.find(i => i.key === item.key) ? 1 : ship2Items.find(i => i.key === item.key) ? 2 : null;
                return (
                  <div
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 18px", borderBottom: `1px solid ${COLORS.mist}`,
                      cursor: isPreview ? "default" : "pointer",
                      background: isSelected ? `${COLORS.moss}08` : "transparent",
                      opacity: isPreview && !isSelected ? 0.5 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                        border: `2px solid ${isSelected ? COLORS.moss : COLORS.mist}`,
                        background: isSelected ? COLORS.moss : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && <span style={{ color: COLORS.white, fontSize: "11px", fontWeight: "700" }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: isSelected ? "600" : "400", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.label}</div>
                        <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "12px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>${item.price}</div>
                        <div style={{ fontSize: "10px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>Est.</div>
                      </div>
                      {isSelected && shipNum && (
                        <span style={{ fontSize: "10px", background: shipNum === 1 ? `${COLORS.moss}20` : `${COLORS.clay}20`, color: shipNum === 1 ? COLORS.moss : COLORS.clay, padding: "2px 8px", borderRadius: "10px", fontWeight: "700", fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: "nowrap" }}>
                          Ship {shipNum}
                        </span>
                      )}
                      <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", minWidth: "50px", textAlign: "right" }}>
                        {isSaving ? "Saving…" : isSelected ? <span style={{ color: COLORS.moss, fontWeight: "600" }}>Added</span> : isPreview ? "" : <span style={{ color: COLORS.stone }}>+ Add</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {isPreview && selectedItems.length === 0 && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛠️</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: COLORS.bark, marginBottom: "6px" }}>No equipment add-ons selected</div>
            <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>Activate your plan to add emergency equipment to your shipments.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PlanTab ──────────────────────────────────────────────────────────────────
function PlanTab({ customer, formData, authToken, isPreview, onActivate, onUpdateHousehold }) {
  const [openMonth, setOpenMonth] = useState(isPreview ? null : 1);

  const budget        = formData?.monthlyBudget  || 150;
  const productBudget = budget - 30;
  const months        = formData?.coverageMonths || 3;
  const philosophy    = formData?.foodPhilosophy || "balanced";
  const totalPeople   = Object.values(formData?.household || {})
    .filter((_, k) => k !== "infants") // infants excluded from food calc
    .reduce((s, v) => s + (typeof v === "number" ? v : 0), 0) || 2;
  const costIndex     = formData?.costIndex || null;

  const philosophyLabel = { wholeFood: "Whole Foods First", balanced: "Balanced Mix", freezeDried: "Freeze-Dried", noPreference: "Best Value" }[philosophy] || "Balanced Mix";
  const containerLabel  = formData?.containerTier === "none" ? "None (already have containers)" : "Gamma Seal buckets + IRIS 82qt bins";

  // ── CBI-derived cost calculation ──────────────────────────────
  // Use real cost-per-calorie from live Kroger price data.
  // Fallback to 0.003821 (launch baseline from 2026-03-14) if no CBI data yet.
  const currentCpc = costIndex?.currentCpc || 0.003821;

  // Philosophy multipliers — from pricing_matrix (matched exactly)
  const philosophyMultiplier = {
    wholeFood:    1.25,
    balanced:     1.00,
    freezeDried:  2.40,
    noPreference: 0.78,
  }[philosophy] || 1.00;

  // Per-person daily calories — from wizard Step 2 or USDA defaults
  const prefs = formData?.preferences || {};
  const householdObj = formData?.household || {};
  const calPerPerson = {
    children: prefs.calories_children || 1400,
    teens:    prefs.calories_teens    || 2000,
    adults:   prefs.calories_adults   || 2200,
    seniors:  prefs.calories_seniors  || 1900,
  };

  // Total daily household calories (infants excluded)
  const dailyCalories = ["children","teens","adults","seniors"].reduce((sum, group) => {
    return sum + (householdObj[group] || 0) * calPerPerson[group];
  }, 0) || (totalPeople * 2200); // fallback if household object empty

  // Monthly food cost at current market prices
  const monthlyCalories = dailyCalories * 30;
  const monthCost       = parseFloat((monthlyCalories * currentCpc * philosophyMultiplier).toFixed(2));

  // Total plan cost and fulfillment months
  const totalFoodCost = monthCost * months;
  const fulfillMonths = Math.ceil(totalFoodCost / productBudget);

  // ── Food plan quantities ─────────────────────────────────────
  // HIGH-CALORIE items (grains, fats, legumes): sized from calorie targets
  // LOW-CALORIE items (veg, fruit, dairy): fixed practical per-person amounts
  //
  // Grains supply ~40% of calories. 1 lb dry grain ≈ 1,600 kcal.
  const grainKcal    = monthlyCalories * 0.40;
  const grainLbsTotal = Math.round(grainKcal / 1600);

  // Protein cans: canned meat ~200 kcal/can, supplies ~20% of calories
  const proteinKcal  = monthlyCalories * 0.20;
  const proteinCans  = Math.round(proteinKcal / 200);

  // Legumes: ~1,600 kcal/lb dried, supplies ~10% of calories
  const legumeLbs    = Math.max(1, Math.round(monthlyCalories * 0.10 / 1600));

  // Fats: ~15% of calories. Peanut butter ~2,600 kcal/jar, oil ~3,500 kcal/liter
  const fatKcal      = monthlyCalories * 0.15;
  const pbJars       = Math.max(1, Math.round(fatKcal * 0.5 / 2600));
  const oilUnits     = Math.max(1, Math.round(fatKcal * 0.5 / 3500));

  // Fixed per-person monthly amounts for low-calorie supporting items
  const n = totalPeople;
  const vegCans      = Math.round(n * 4);    // ~4 cans veg per person/month
  const tomatoCans   = Math.round(n * 4);    // ~4 cans tomatoes per person/month
  const soupCans     = Math.round(n * 4);    // ~4 cans soup per person/month
  const fruitCans    = Math.round(n * 3);    // ~3 cans fruit per person/month
  const dairyCans    = Math.round(n * 3);    // ~3 cans evaporated milk per person/month
  const sweetLbs     = Math.round(n * 1.5);  // ~1.5 lbs sweeteners per person/month
  const waterGal     = n * 14;               // 1 gal/person/day × 14 days

  const foodPlans = {
    wholeFood: [
      { item: "Whole wheat berries — sealed mylar",    qty: () => `${Math.round(grainLbsTotal * 0.4)} lbs`, cat: "Grains" },
      { item: "Organic brown & white rice",            qty: () => `${Math.round(grainLbsTotal * 0.4)} lbs`, cat: "Grains" },
      { item: "Rolled oats & steel-cut oats",          qty: () => `${Math.round(grainLbsTotal * 0.2)} lbs`, cat: "Grains" },
      { item: "Canned wild-caught salmon",             qty: () => `${Math.round(proteinCans * 0.4)} cans`,  cat: "Protein" },
      { item: "Canned chunk light tuna in water",      qty: () => `${Math.round(proteinCans * 0.3)} cans`,  cat: "Protein" },
      { item: "Heirloom dried beans & lentils",        qty: () => `${legumeLbs} lbs`,                       cat: "Protein" },
      { item: "Canned organic diced tomatoes",         qty: () => `${tomatoCans} cans`,                     cat: "Vegetables" },
      { item: "Dehydrated vegetables — additive-free", qty: () => `${Math.max(1, Math.round(n * 1.5))} lbs`, cat: "Vegetables" },
      { item: "Dried fruits — raisins, dates, apricots", qty: () => `${fruitCans} lbs`,                     cat: "Fruit" },
      { item: "Cold-pressed olive oil",                qty: () => `${oilUnits} liters`,                     cat: "Fats" },
      { item: "Raw honey",                             qty: () => `${sweetLbs} lbs`,                        cat: "Sweeteners" },
      { item: "Sea salt, herbs & spice kit",           qty: () => "1 kit",                                  cat: "Pantry" },
      { item: "Water (1 gal/person/day × 14 days)",    qty: () => `${waterGal} gal`,                        cat: "Water" },
    ],
    balanced: [
      { item: "Long-grain white rice",                 qty: () => `${Math.round(grainLbsTotal * 0.45)} lbs`, cat: "Grains" },
      { item: "Rolled oats",                           qty: () => `${Math.round(grainLbsTotal * 0.20)} lbs`, cat: "Grains" },
      { item: "Pasta — spaghetti, penne, rotini",      qty: () => `${Math.round(grainLbsTotal * 0.35)} lbs`, cat: "Grains" },
      { item: "Canned chunk light tuna in water",      qty: () => `${Math.round(proteinCans * 0.30)} cans`,  cat: "Protein" },
      { item: "Canned chicken breast",                 qty: () => `${Math.round(proteinCans * 0.25)} cans`,  cat: "Protein" },
      { item: "Canned beef stew",                      qty: () => `${Math.round(proteinCans * 0.15)} cans`,  cat: "Protein" },
      { item: "Dried lentils & split peas",            qty: () => `${legumeLbs} lbs`,                        cat: "Protein" },
      { item: "Almond & peanut butter",                qty: () => `${pbJars} jars`,                          cat: "Fats" },
      { item: "Canned diced tomatoes & paste",         qty: () => `${tomatoCans} cans`,                      cat: "Vegetables" },
      { item: "Canned mixed vegetables",               qty: () => `${vegCans} cans`,                         cat: "Vegetables" },
      { item: "Canned soups — tomato, minestrone, chili", qty: () => `${soupCans} cans`,                     cat: "Ready Meals" },
      { item: "Canned peaches, pears & mandarins",     qty: () => `${fruitCans} cans`,                       cat: "Fruit" },
      { item: "Evaporated milk (canned)",              qty: () => `${dairyCans} cans`,                       cat: "Dairy" },
      { item: "Honey, sugar & brown sugar",            qty: () => `${sweetLbs} lbs`,                         cat: "Sweeteners" },
      { item: "Salt, pepper, garlic powder, spice kit", qty: () => "1 kit",                                  cat: "Pantry" },
      { item: "Water (1 gal/person/day × 14 days)",    qty: () => `${waterGal} gal`,                         cat: "Water" },
    ],
    freezeDried: [
      { item: "Freeze-dried chicken & rice entrees",   qty: () => `${Math.round(monthlyCalories * 0.30 / 400)} srv`, cat: "Entrees" },
      { item: "Freeze-dried pasta & meat sauce",       qty: () => `${Math.round(monthlyCalories * 0.25 / 380)} srv`, cat: "Entrees" },
      { item: "Freeze-dried beef stew",                qty: () => `${Math.round(monthlyCalories * 0.20 / 350)} srv`, cat: "Entrees" },
      { item: "Canned chicken breast",                 qty: () => `${Math.round(proteinCans * 0.25)} cans`,           cat: "Protein" },
      { item: "Freeze-dried mixed vegetables",         qty: () => `${vegCans} cans`,                                  cat: "Vegetables" },
      { item: "Instant rice & pasta",                  qty: () => `${Math.round(grainLbsTotal * 0.25)} lbs`,          cat: "Grains" },
      { item: "Water (1 gal/person/day × 14 days)",    qty: () => `${waterGal} gal`,                                  cat: "Water" },
    ],
    noPreference: [
      { item: "Long-grain white rice",                 qty: () => `${Math.round(grainLbsTotal * 0.60)} lbs`, cat: "Grains" },
      { item: "Canned chunk light tuna in water",      qty: () => `${Math.round(proteinCans * 0.35)} cans`,  cat: "Protein" },
      { item: "Canned chicken breast",                 qty: () => `${Math.round(proteinCans * 0.30)} cans`,  cat: "Protein" },
      { item: "Dried lentils & split peas",            qty: () => `${legumeLbs} lbs`,                        cat: "Protein" },
      { item: "Canned mixed vegetables",               qty: () => `${vegCans} cans`,                         cat: "Vegetables" },
      { item: "Canned soups (variety)",                qty: () => `${soupCans} cans`,                        cat: "Ready Meals" },
      { item: "Peanut butter",                         qty: () => `${pbJars} jars`,                          cat: "Fats" },
      { item: "Honey & sugar",                         qty: () => `${sweetLbs} lbs`,                         cat: "Sweeteners" },
      { item: "Water (1 gal/person/day × 14 days)",    qty: () => `${waterGal} gal`,                         cat: "Water" },
    ],
  };

  const foodPlan = foodPlans[philosophy] || foodPlans.balanced;

  // CBI-adjusted cost warning
  const cbiPct    = costIndex?.cbiChangePct || 0;
  const showCbiBanner = costIndex && Math.abs(cbiPct) >= 2;
  const cbiUp     = cbiPct > 0;
  const extraMonths = cbiUp ? Math.ceil((totalFoodCost * (cbiPct / 100)) / productBudget) : 0;
  const budgetIncrease = cbiUp ? Math.ceil((totalFoodCost * (cbiPct / 100)) / fulfillMonths) : 0;

  // Group items by category
  const grouped = foodPlan.reduce((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});

  // Build month list — Month 1 is always shown, rest locked in preview
  const allMonths = Array.from({ length: fulfillMonths }, (_, i) => i + 1);

  // ── Shipment extras (containers + equipment) for accordion ──
  const equipmentSelected = EQUIPMENT_CATALOG.filter(i => (formData?.preferences?.equipment || {})[i.key]);
  const equipMidpoint     = Math.ceil(equipmentSelected.length / 2);
  const equipShip1        = equipmentSelected.slice(0, equipMidpoint);
  const equipShip2        = equipmentSelected.slice(equipMidpoint);
  const cTier             = formData?.containerTier || "standard";
  const cLabel            = cTier === "none" ? "None" : "Gamma Seal buckets + IRIS 82qt bins";
  const bucketVolPPM_pt   = { wholeFood: 1.40, balanced: 0.80, freezeDried: 0.20, noPreference: 0.70 }[philosophy] || 0.80;
  const binVolPPM_pt      = { wholeFood: 0.40, balanced: 0.70, freezeDried: 1.10, noPreference: 0.40 }[philosophy] || 0.70;
  const cBuckets          = cTier === "none" ? 0 : Math.ceil((totalPeople * bucketVolPPM_pt * months) / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const cBins             = cTier === "none" ? 0 : Math.ceil((totalPeople * binVolPPM_pt    * months) / CONTAINER_SYSTEM.bin.volumeCuFt);
  const cCount            = cBuckets + cBins;
  const cUnitPrice        = cCount > 0 ? Math.round((cBuckets * CONTAINER_SYSTEM.bucket.priceEst + cBins * CONTAINER_SYSTEM.bin.priceEst) / cCount) : 0;

  // What non-food extras ship in each month
  const shipmentExtras = {
    1: [
      { label: `${cBuckets}× Gamma Seal 5-gal buckets (Uline) + ${cBins}× IRIS 82qt WeatherPro bins`, price: cBuckets * CONTAINER_SYSTEM.bucket.priceEst + cBins * CONTAINER_SYSTEM.bin.priceEst, icon: "📦" },
      { label: "Mylar bags assortment + oxygen absorbers", price: Math.ceil((cBuckets + cBins) / 5) * 12, icon: "🛡️" },
      ...equipShip1.map(i => ({ label: i.label, price: i.price, icon: "🛠️" })),
    ],
    2: equipShip2.map(i => ({ label: i.label, price: i.price, icon: "🛠️" })),
  };

  // Status of each month (fulfilled / in-progress / projected)
  // orders are sorted ascending by created_at from the server — index 0 = month 1
  const getMonthStatus = (m) => {
    const orders = formData?.orders || [];
    const order = orders[m - 1];
    if (!order) return "projected";
    if (order.status === "fulfilled" || order.status === "shipped") return "fulfilled";
    if (order.status === "pending" || order.status === "processing") return "in-progress";
    return "projected";
  };

  const statusColors = {
    fulfilled:  { bg: "#EDF2E8", text: COLORS.moss, label: "✓ Fulfilled" },
    "in-progress": { bg: "#FEF6ED", text: COLORS.clay, label: "⟳ In Progress" },
    projected:  { bg: COLORS.cream, text: COLORS.stone, label: "Projected" },
  };

  const MonthRow = ({ monthNum, locked }) => {
    const isOpen   = openMonth === monthNum;
    const status   = getMonthStatus(monthNum);
    const sc       = statusColors[status];
    const extras   = shipmentExtras[monthNum] || [];

    return (
      <div style={{ border: `1px solid ${COLORS.mist}`, borderRadius: "10px", marginBottom: "8px", background: COLORS.white, overflow: "hidden" }}>
        {/* Header row — always visible */}
        <div
          onClick={() => !locked && setOpenMonth(isOpen ? null : monthNum)}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: locked ? "default" : "pointer", userSelect: "none" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark }}>Month {monthNum}</span>
              {monthNum === 1 && <span style={{ fontSize: "11px", color: COLORS.moss, marginLeft: "8px", fontWeight: "600" }}>First Shipment</span>}
              {monthNum === fulfillMonths && <span style={{ fontSize: "11px", color: COLORS.clay, marginLeft: "8px", fontWeight: "600" }}>Final Shipment</span>}
            </div>
            <span style={{ fontSize: "11px", background: sc.bg, color: sc.text, padding: "2px 10px", borderRadius: "20px", fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600" }}>
              {sc.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!locked && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.moss }}>${productBudget}</div>
                <div style={{ fontSize: "10px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>est. supply cost</div>
              </div>
            )}
            {locked ? (
              <span style={{ fontSize: "16px" }}>🔒</span>
            ) : (
              <span style={{ fontSize: "18px", color: COLORS.stone, transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>⌄</span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {isOpen && !locked && (
          <div style={{ borderTop: `1px solid ${COLORS.mist}`, padding: "20px" }}>
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", paddingBottom: "4px", borderBottom: `1px dashed ${COLORS.mist}`, marginBottom: "4px" }}>{cat}</div>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderBottom: `1px solid ${COLORS.cream}`, fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                    <span style={{ color: COLORS.bark }}>{item.item}</span>
                    <span style={{ fontWeight: "700", color: COLORS.moss, whiteSpace: "nowrap", marginLeft: "12px" }}>{item.qty()}</span>
                  </div>
                ))}
              </div>
            ))}
            {status === "projected" && (
              <div style={{ marginTop: "10px", fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontStyle: "italic" }}>
                * Quantities and items may adjust based on current pricing and availability at time of fulfillment.
              </div>
            )}

            {/* Non-food extras for this shipment */}
            {extras.length > 0 && (
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px solid ${COLORS.mist}` }}>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "8px" }}>Also in this shipment</div>
                {extras.map((ex, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", borderBottom: `1px solid ${COLORS.cream}`, fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                    <span style={{ color: COLORS.bark }}>{ex.icon} {ex.label}</span>
                    <span style={{ fontWeight: "700", color: COLORS.clay, whiteSpace: "nowrap", marginLeft: "12px" }}>Est. ${ex.price}</span>
                  </div>
                ))}
                <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "6px", fontStyle: "italic" }}>
                  * Equipment & container costs billed separately from monthly food budget.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Locked overlay message */}
        {locked && (
          <div style={{ borderTop: `1px solid ${COLORS.mist}`, padding: "14px 20px", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
              Activate your plan to see detailed items for all {fulfillMonths} months
            </div>
            <button onClick={onActivate} style={{ background: COLORS.moss, color: COLORS.white, border: "none", borderRadius: "6px", padding: "7px 16px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: "nowrap" }}>
              Activate →
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* ── Summary cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px", marginBottom: "28px" }}>
        {[
          { label: "Coverage Goal",    value: `${months} months`,    icon: "🎯" },
          { label: "Household",        value: `${totalPeople} people`, icon: "👥", action: !isPreview ? onUpdateHousehold : null },
          { label: "Food Philosophy",  value: philosophyLabel,        icon: "🌾" },
          { label: "Monthly Budget",   value: `$${budget}/mo`,        icon: "💰" },
          { label: "Est. Food Cost",   value: `$${monthCost.toLocaleString()}/mo`, icon: "🛒" },
          { label: "Fulfillment Time", value: `~${fulfillMonths} months`, icon: "📅" },
        ].map(({ label, value, icon, action }) => (
          <div key={label} onClick={action || undefined}
            style={{ background: COLORS.white, border: `1px solid ${action ? COLORS.moss : COLORS.mist}`, borderRadius: "10px", padding: "14px 16px", cursor: action ? "pointer" : "default", position: "relative" }}>
            <div style={{ fontSize: "18px", marginBottom: "5px" }}>{icon}</div>
            <div style={{ fontSize: "10px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>{label}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.bark }}>{value}</div>
            {action && <div style={{ fontSize: "10px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "600", marginTop: "4px" }}>Tap to update →</div>}
          </div>
        ))}
      </div>

      {/* ── CBI cost-change banner (only shown when food costs have moved ≥2%) ── */}
      {showCbiBanner && (
        <div style={{ background: cbiUp ? "#FEF6ED" : "#EDF2E8", border: `1px solid ${cbiUp ? COLORS.clay : COLORS.sage}`, borderRadius: "10px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>{cbiUp ? "📈" : "📉"}</span>
          <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, marginBottom: "4px" }}>
              Food costs have {cbiUp ? "increased" : "decreased"} {Math.abs(cbiPct).toFixed(1)}% since you enrolled
            </div>
            <div style={{ fontSize: "13px", color: COLORS.stone, lineHeight: "1.6" }}>
              {cbiUp
                ? `At current prices, your fulfillment timeline may extend by ~${extraMonths} month${extraMonths !== 1 ? "s" : ""}. To stay on your original schedule, consider increasing your monthly budget by ~$${budgetIncrease}/mo.`
                : `Good news — lower food prices mean your plan may complete slightly ahead of schedule.`
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Shipment schedule header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "4px" }}>Shipment Schedule</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px" }}>
            {fulfillMonths} monthly shipments · ${productBudget}/mo supply budget
          </div>
        </div>
        {isPreview && (
          <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", textAlign: "right", maxWidth: "160px", lineHeight: "1.5" }}>
            Month 1 visible<br />Months 2+ unlock on activation
          </div>
        )}
      </div>

      {/* ── Month accordion ── */}
      {allMonths.map(m => (
        <MonthRow
          key={m}
          monthNum={m}
          locked={isPreview && m > 1}
        />
      ))}

      {fulfillMonths > 6 && isPreview && (
        <div style={{ textAlign: "center", padding: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px" }}>
          + {fulfillMonths - 2} more months in your plan — all unlock on activation
        </div>
      )}

      {/* ── Extras & Add-ons ── */}
      <ExtrasSection formData={formData} authToken={authToken} isPreview={isPreview} />
    </div>
  );
}

// ── ContainerMapTab ───────────────────────────────────────────────────────────
function ContainerMapTab({ customer, formData, isPreview }) {
  const months        = formData?.coverageMonths || 3;
  const philosophy    = formData?.foodPhilosophy || "balanced";
  const containerTier = formData?.containerTier || "standard";
  const totalPeople   = Object.values(formData?.household || {})
    .reduce((s, v) => s + (typeof v === "number" ? v : 0), 0) || 2;

  const bucketVolPPM_cm = { wholeFood: 1.40, balanced: 0.80, freezeDried: 0.20, noPreference: 0.70 }[philosophy] || 0.80;
  const binVolPPM_cm    = { wholeFood: 0.40, balanced: 0.70, freezeDried: 1.10, noPreference: 0.40 }[philosophy] || 0.70;
  const bucketCount     = containerTier === "none" ? 0 : Math.ceil((totalPeople * bucketVolPPM_cm * months) / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const binCount        = containerTier === "none" ? 0 : Math.ceil((totalPeople * binVolPPM_cm    * months) / CONTAINER_SYSTEM.bin.volumeCuFt);
  const totalVolume     = (totalPeople * (bucketVolPPM_cm + binVolPPM_cm)) * months;

  // Bucket categories (bulk dry goods in Mylar)
  const bucketCategories = {
    wholeFood:    ["Wheat Berries", "Brown Rice", "White Rice", "Oats", "Lentils", "Beans", "Flour", "Sugar"],
    balanced:     ["White Rice", "Oats", "Lentils", "Beans", "Pasta (bulk)"],
    freezeDried:  ["Oats", "Sugar"],
    noPreference: ["White Rice", "Lentils", "Beans", "Oats"],
  }[philosophy] || ["White Rice", "Oats", "Lentils", "Beans"];

  // Bin categories (packaged items — NO cans)
  const binCategories = {
    wholeFood:    ["Dried Fruit", "Olive Oil", "Pantry Kit", "Spices"],
    balanced:     ["Pasta (pkg)", "Nut Butters", "Pantry Kit", "Freeze-Dried", "Oils", "Sweeteners"],
    freezeDried:  ["FD Chicken + Rice", "FD Pasta", "FD Beef Stew", "FD Veg", "Instant Rice", "Pantry Kit"],
    noPreference: ["Pasta (pkg)", "Peanut Butter", "Pantry Kit", "Oils"],
  }[philosophy] || ["Pasta (pkg)", "Nut Butters", "Pantry Kit", "Oils"];

  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Build bucket objects
  const buckets = Array.from({ length: Math.min(bucketCount, 30) }, (_, i) => ({
    code:     `B-${rows[Math.floor(i / 4)]}${(i % 4) + 1}`,
    type:     "bucket",
    category: bucketCategories[i % bucketCategories.length],
    index:    i,
  }));

  // Build bin objects
  const bins = Array.from({ length: Math.min(binCount, 20) }, (_, i) => ({
    code:     `N-${rows[Math.floor(i / 3)]}${(i % 3) + 1}`,
    type:     "bin",
    category: binCategories[i % binCategories.length],
    index:    i,
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Your Storage Map</div>
        <div style={{ fontSize: "26px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.8px", marginBottom: "6px" }}>
          {bucketCount} buckets + {binCount} bins
        </div>
        <div style={{ fontSize: "14px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
          {totalPeople} people · {months} months · canned goods use open shelving (not included)
        </div>
      </div>

      {/* System legend */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#EDF2E8", border: `1px solid ${COLORS.sage}30`, borderRadius: "20px", padding: "5px 14px" }}>
          <span style={{ fontSize: "14px" }}>🪣</span>
          <span style={{ fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.bark, fontWeight: "600" }}>5-gal Gamma Seal Bucket (B-xx) — bulk dry goods in Mylar</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FEF6ED", border: `1px solid ${COLORS.clay}30`, borderRadius: "20px", padding: "5px 14px" }}>
          <span style={{ fontSize: "14px" }}>📦</span>
          <span style={{ fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.bark, fontWeight: "600" }}>IRIS 82qt WeatherPro Bin (N-xx) — packaged goods</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: COLORS.cream, border: `1px solid ${COLORS.mist}`, borderRadius: "20px", padding: "5px 14px" }}>
          <span style={{ fontSize: "14px" }}>🥫</span>
          <span style={{ fontSize: "11px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.stone, fontWeight: "600" }}>Canned goods → open shelving (hardware store)</span>
        </div>
      </div>

      {/* Bucket grid */}
      {buckets.length > 0 && (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🪣</span> Gamma Seal 5-gal Buckets — {bucketCount} total
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
            {buckets.map((c) => (
              <div key={c.code} style={{ background: isPreview && c.index > 0 ? COLORS.cream : "#EDF2E8", border: `1.5px solid ${isPreview && c.index > 0 ? COLORS.mist : COLORS.sage + "60"}`, borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif" }}>{c.code}</div>
                {isPreview && c.index > 0 ? (
                  <div style={{ fontSize: "9px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>🔒 locked</div>
                ) : (
                  <div style={{ fontSize: "9px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px", fontWeight: "600" }}>{c.category}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bin grid */}
      {bins.length > 0 && (
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📦</span> IRIS 82qt WeatherPro Bins — {binCount} total
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px" }}>
            {bins.map((c) => (
              <div key={c.code} style={{ background: isPreview && c.index > 0 ? COLORS.cream : "#FEF6ED", border: `1.5px solid ${isPreview && c.index > 0 ? COLORS.mist : COLORS.clay + "40"}`, borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif" }}>{c.code}</div>
                {isPreview && c.index > 0 ? (
                  <div style={{ fontSize: "9px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>🔒 locked</div>
                ) : (
                  <div style={{ fontSize: "9px", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px", fontWeight: "600" }}>{c.category}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Canned goods shelving note */}
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "16px 20px", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>🥫</span>
          <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark, marginBottom: "3px" }}>Canned goods: open shelving</div>
            <div style={{ fontSize: "12px", color: COLORS.stone, lineHeight: "1.6" }}>
              Cans don't need airtight containers — they're already sealed. Simple wire shelving from Home Depot or Lowe's (roughly $30–60 per shelf unit) is all you need. Your container map will include a shelving layout suggestion.
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "16px 20px" }}>
        <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.7" }}>
          {isPreview
            ? "📋 Activate your plan to see exactly which products belong in each container. Every bucket and bin gets a printed label delivered with your first shipment."
            : "📋 Each container is labeled with its contents. As shipments are confirmed, your portal updates with exact placement instructions for each item."
          }
        </div>
      </div>
    </div>
  );
}

// ── Portal — main customer-facing portal ──────────────────────────────────────
function Portal({ customer, formData, authToken, onActivated, onLogout }) {
  const [activeTab, setActiveTab] = useState("plan");
  const [showActivate, setShowActivate] = useState(false);
  const [showHouseholdChange, setShowHouseholdChange] = useState(false);
  const [localFormData, setLocalFormData] = useState(formData);

  // Keep localFormData in sync when formData prop changes (e.g. on initial load)
  useEffect(() => { setLocalFormData(formData); }, [formData]);

  const isPreview = customer?.status === "preview";

  const budget = formData?.monthlyBudget || customer?.preferences?.monthly_budget || 150;
  const productBudget = budget - 30;
  const months = formData?.coverageMonths || customer?.preferences?.coverage_months || 3;
  const philosophy = formData?.foodPhilosophy || customer?.preferences?.food_philosophy || "balanced";
  const totalPeople = Object.values(formData?.household || customer?.household || {}).reduce((s, v) => s + v, 0) || 2;
  const containerTier = formData?.containerTier || customer?.preferences?.container_tier || "standard";
  const firstName = customer?.full_name?.split(" ")[0] || "there";

  // Container cost estimate for ActivateModal — new standard system
  const _philosophy      = philosophy;
  const _bucketVolPPM    = { wholeFood: 1.40, balanced: 0.80, freezeDried: 0.20, noPreference: 0.70 }[_philosophy] || 0.80;
  const _binVolPPM       = { wholeFood: 0.40, balanced: 0.70, freezeDried: 1.10, noPreference: 0.40 }[_philosophy] || 0.70;
  const _buckets         = containerTier === "none" ? 0 : Math.ceil((totalPeople * _bucketVolPPM * months) / CONTAINER_SYSTEM.bucket.volumeCuFt);
  const _bins            = containerTier === "none" ? 0 : Math.ceil((totalPeople * _binVolPPM    * months) / CONTAINER_SYSTEM.bin.volumeCuFt);
  const containerCostTotal = _buckets * CONTAINER_SYSTEM.bucket.priceEst + _bins * CONTAINER_SYSTEM.bin.priceEst + Math.ceil((_buckets + _bins) / 5) * 12;

  // Generate the full food plan list (same logic as StepPlan)
  const foodPlans = {
    wholeFood: [
      { item: "Whole wheat berries — sealed mylar", qty: `${totalPeople * 12 * months} lbs`, cat: "Grains" },
      { item: "Organic brown & white rice", qty: `${totalPeople * 10 * months} lbs`, cat: "Grains" },
      { item: "Rolled oats & steel-cut oats", qty: `${totalPeople * 6 * months} lbs`, cat: "Grains" },
      { item: "Canned wild-caught salmon", qty: `${totalPeople * 8 * months} cans`, cat: "Protein" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 8 * months} cans`, cat: "Protein" },
      { item: "Heirloom dried beans & lentils", qty: `${totalPeople * 8 * months} lbs`, cat: "Protein" },
      { item: "Canned organic diced tomatoes", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Dehydrated vegetables — additive-free", qty: `${totalPeople * 2 * months} lbs`, cat: "Vegetables" },
      { item: "Dried fruits — raisins, dates, apricots", qty: `${totalPeople * 1 * months} lbs`, cat: "Fruit" },
      { item: "Cold-pressed olive oil", qty: `${totalPeople * 1 * months} liters`, cat: "Fats" },
      { item: "Raw honey", qty: `${Math.ceil(totalPeople * 1.5 * months)} lbs`, cat: "Sweeteners" },
      { item: "Sea salt, herbs, spice kit", qty: "Spice kit", cat: "Pantry" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14 * months} gallons`, cat: "Water" },
    ],
    balanced: [
      { item: "Long-grain white rice", qty: `${totalPeople * 12 * months} lbs`, cat: "Grains" },
      { item: "Rolled oats", qty: `${totalPeople * 4 * months} lbs`, cat: "Grains" },
      { item: "Pasta — spaghetti, penne, rotini", qty: `${totalPeople * 6 * months} lbs`, cat: "Grains" },
      { item: "Canned baked beans", qty: `${totalPeople * 4 * months} cans`, cat: "Grains" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Canned chicken breast", qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Canned beef stew", qty: `${totalPeople * 2 * months} cans`, cat: "Protein" },
      { item: "Dried lentils & split peas", qty: `${totalPeople * 4 * months} lbs`, cat: "Protein" },
      { item: "Almond & peanut butter", qty: `${totalPeople * 2 * months} jars`, cat: "Protein" },
      { item: "Canned diced tomatoes & paste", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned mixed vegetables", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned soups — tomato, minestrone, chili", qty: `${totalPeople * 4 * months} cans`, cat: "Ready Meals" },
      { item: "Canned peaches, pears & mandarin oranges", qty: `${totalPeople * 3 * months} cans`, cat: "Fruit" },
      { item: "Evaporated milk (canned)", qty: `${totalPeople * 3 * months} cans`, cat: "Dairy" },
      { item: "Honey, sugar & brown sugar", qty: `${Math.ceil(totalPeople * 1.5 * months)} lbs`, cat: "Sweeteners" },
      { item: "Salt, pepper, garlic powder, spice kit", qty: "Pantry kit", cat: "Pantry" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14 * months} gallons`, cat: "Water" },
    ],
    freezeDried: [
      { item: "Freeze-dried chicken & rice entrees", qty: `${totalPeople * 10 * months} servings`, cat: "Entrees" },
      { item: "Freeze-dried pasta & meat sauce", qty: `${totalPeople * 10 * months} servings`, cat: "Entrees" },
      { item: "Freeze-dried beef stew", qty: `${totalPeople * 10 * months} servings`, cat: "Entrees" },
      { item: "Canned chicken breast", qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Freeze-dried mixed vegetables", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned diced tomatoes", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Instant rice & pasta", qty: `${totalPeople * 6 * months} pouches`, cat: "Grains" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14 * months} gallons`, cat: "Water" },
    ],
    noPreference: [
      { item: "Long-grain white rice", qty: `${totalPeople * 14 * months} lbs`, cat: "Grains" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Canned chicken breast", qty: `${totalPeople * 4 * months} cans`, cat: "Protein" },
      { item: "Dried lentils & split peas", qty: `${totalPeople * 4 * months} lbs`, cat: "Protein" },
      { item: "Canned mixed vegetables", qty: `${totalPeople * 4 * months} cans`, cat: "Vegetables" },
      { item: "Canned soups (variety)", qty: `${totalPeople * 4 * months} cans`, cat: "Ready Meals" },
      { item: "Peanut butter", qty: `${totalPeople * 2 * months} jars`, cat: "Protein" },
      { item: "Honey & sugar", qty: `${Math.ceil(totalPeople * 1.5 * months)} lbs`, cat: "Sweeteners" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14 * months} gallons`, cat: "Water" },
    ],
  };

  const foodPlan = foodPlans[philosophy] || foodPlans.balanced;
  const grouped = foodPlan.reduce((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});

  const philosophyLabel = { wholeFood: "Whole Foods First", balanced: "Balanced Mix", freezeDried: "Freeze-Dried", noPreference: "Best Value" }[philosophy] || "Balanced Mix";
  const containerLabel = containerTier === "none" ? "None (already have containers)" : "Gamma Seal buckets + IRIS 82qt bins";

  const tabStyle = (t) => ({
    padding: "10px 18px", fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: t === activeTab ? "700" : "400",
    color: t === activeTab ? COLORS.moss : COLORS.stone,
    background: "none", border: "none",
    borderBottom: `2px solid ${t === activeTab ? COLORS.moss : "transparent"}`,
    cursor: "pointer", letterSpacing: "0.3px",
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream }}>
      {/* Portal nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: `1px solid ${COLORS.mist}`, background: COLORS.white }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Georgia', serif", letterSpacing: "-0.3px" }}>QuietReady.ai</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>Your Portal</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isPreview && (
            <div style={{ background: "#FEF6ED", border: `1px solid ${COLORS.clay}`, borderRadius: "20px", padding: "5px 14px", fontSize: "11px", fontWeight: "700", color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.5px" }}>
              PREVIEW MODE
            </div>
          )}
          <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
            {customer?.full_name}
          </div>
          <button
            onClick={onLogout}
            style={{ background: "none", border: `1px solid ${COLORS.mist}`, borderRadius: "6px", padding: "6px 14px", fontSize: "12px", color: COLORS.stone, cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Preview banner */}
      {isPreview && (
        <div style={{ background: COLORS.moss, padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.white, fontFamily: "'Helvetica Neue', sans-serif" }}>
              👋 Welcome, {firstName}! Your plan is ready — activate it to begin.
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>
              Month 1 is fully visible. Months 2+ unlock when you activate your plan.
            </div>
          </div>
          <button
            onClick={() => setShowActivate(true)}
            style={{ background: COLORS.clay, color: COLORS.white, border: "none", borderRadius: "8px", padding: "11px 22px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif", whiteSpace: "nowrap", letterSpacing: "0.3px", flexShrink: 0, marginLeft: "24px" }}
          >
            Activate My Plan →
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.mist}`, padding: "0 40px", display: "flex", gap: "4px" }}>
        {[["plan", "📋 My Plan"], ["containers", "📦 Container Map"], ["billing", "💳 Billing"]].map(([t, label]) => (
          <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>{label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* ── Plan Tab ── */}
        {activeTab === "plan" && (
          <PlanTab
            customer={customer}
            formData={localFormData}
            authToken={authToken}
            isPreview={isPreview}
            onActivate={() => setShowActivate(true)}
            onUpdateHousehold={() => setShowHouseholdChange(true)}
          />
        )}

        {/* ── Container Map Tab ── */}
        {activeTab === "containers" && (
          <ContainerMapTab
            customer={customer}
            formData={localFormData}
            isPreview={isPreview}
          />
        )}
        )}

                {/* ── Billing Tab ── */}
        {activeTab === "billing" && (
          <div>
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>Monthly billing breakdown</div>
              {[
                { label: "QuietReady Membership", desc: "Portal access, rotation tracking, recipe guide", amount: "$30.00", recurring: true },
                { label: "Food Supply Fulfillment", desc: `Month 1 of ~${Math.ceil(((totalPeople * 260 * months * 1.1)) / productBudget)}`, amount: `$${productBudget}.00`, recurring: false },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.mist}` : "none" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>{item.label}</div>
                    <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: COLORS.bark }}>{item.amount}</div>
                    {item.recurring && <div style={{ fontSize: "10px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif" }}>ongoing</div>}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", marginTop: "4px" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>Total first month</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.moss }}>${budget}.00</div>
              </div>
            </div>
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "24px 28px" }}>
              <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.7" }}>
                After your supply is fully stocked, the fulfillment line drops off and you only pay the <strong style={{ color: COLORS.bark }}>$30/month membership</strong> to keep your rotation schedule active. Cancel anytime — no contracts.
              </div>
            </div>
            {isPreview && (
              <div style={{ marginTop: "20px", background: "#EDF2E8", border: `1px solid ${COLORS.sage}`, borderRadius: "12px", padding: "24px 28px", textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: COLORS.moss, marginBottom: "6px" }}>Ready to start?</div>
                <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "16px" }}>No charge today — your card is billed once your plan is confirmed and sourcing begins.</div>
                <button
                  onClick={() => setShowActivate(true)}
                  style={{ background: COLORS.moss, color: COLORS.white, border: "none", borderRadius: "8px", padding: "13px 28px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif" }}
                >
                  Activate My Plan →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showActivate && (
        <ActivateModal
          customer={customer}
          authToken={authToken}
          containerCostTotal={containerCostTotal}
          containerTier={containerTier}
          onActivated={(updatedCustomer) => {
            setShowActivate(false);
            onActivated(updatedCustomer);
          }}
          onClose={() => setShowActivate(false)}
        />
      )}

      {showHouseholdChange && !isPreview && (
        <HouseholdChangeModal
          currentHousehold={localFormData?.household || {}}
          currentPets={localFormData?.pets?.reduce((acc, p) => ({ ...acc, [p.pet_type]: { count: p.count, size: p.size } }), {}) || {}}
          authToken={authToken}
          onSaved={({ household, pets: updatedPets }) => {
            setLocalFormData(prev => ({ ...prev, household }));
          }}
          onClose={() => setShowHouseholdChange(false)}
        />
      )}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onStart }) {
  return (
    <div>
      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroEyebrow}>Family Food Security, Simplified</div>
        <h1 style={styles.questionTitle}>
          Sleep better knowing<br />your family is covered.
        </h1>
        <p style={styles.heroSub}>
          QuietReady builds your personalized household food security plan, sources everything from trusted suppliers, and delivers it automatically — so you never have to think about it again.
        </p>
        <button style={styles.ctaButton} onClick={onStart}>
          Build My Plan — Free
        </button>
        <div style={{ marginTop: "20px", fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
          Takes 4 minutes · No credit card to start · Cancel anytime
        </div>
      </div>

      {/* ── Urgency stat bar ── */}
      <div style={{ background: COLORS.bark, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.sage, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>The reality</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.white, lineHeight: "1.45", fontFamily: "'Georgia', serif", marginBottom: "14px" }}>
            53 million American households have less than 3 days of food on hand. Most assume they'll figure it out when the time comes.
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
            A job loss, a bad storm, a supply chain hiccup — it doesn't take much. QuietReady makes sure your family is never in that position.
          </div>
          <button
            onClick={onStart}
            style={{ marginTop: "24px", background: COLORS.clay, color: COLORS.white, border: "none", borderRadius: "8px", padding: "13px 28px", fontSize: "13px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            Don't be that household →
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={styles.trustRow}>
        {[
          { num: "8 min",  label: "Average setup time" },
          { num: "53M+",   label: "Unprepared households" },
          { num: "30 day", label: "Rotation cycle" },
          { num: "$30",    label: "Monthly membership" },
        ].map((t) => (
          <div key={t.label} style={styles.trustItem}>
            <div style={styles.trustNum}>{t.num}</div>
            <div style={styles.trustLabel}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* ── Real food, not survival rations ── */}
      <div style={{ background: COLORS.white, borderTop: `1px solid ${COLORS.mist}`, borderBottom: `1px solid ${COLORS.mist}` }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>Real food. Not rations.</div>
            <h2 style={{ fontSize: "26px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px", lineHeight: "1.3", margin: "0 0 16px", fontFamily: "'Georgia', serif" }}>
              Nobody wants to eat a 25-year-old meal pouch.
            </h2>
            <p style={{ fontSize: "14px", color: COLORS.stone, lineHeight: "1.75", margin: "0 0 14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
              Freeze-dried MREs have their place — mostly in disaster movies. QuietReady stocks your family with real, recognizable food: rice, pasta, canned goods, beans, proteins, and pantry staples your family actually eats.
            </p>
            <p style={{ fontSize: "14px", color: COLORS.stone, lineHeight: "1.75", margin: 0, fontFamily: "'Helvetica Neue', sans-serif" }}>
              Once your supply is built out, we keep it fresh with a continuous rotation cycle — oldest items get used first, new stock replaces them. Your pantry stays current without you lifting a finger.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "🌾", title: "Food your family recognizes", body: "White rice, pasta, canned tomatoes, peanut butter — staples with real shelf lives of 2–5 years, not science experiments." },
              { icon: "🔄", title: "Automatic freshness rotation", body: "We track every expiry date and tell you exactly when to use what — so nothing goes to waste and everything stays current." },
              { icon: "📅", title: "Monthly replenishment", body: "As you use items from your supply, we source and ship replacements. Your coverage level stays constant, month after month." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: COLORS.cream, borderRadius: "10px", padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.bark, marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "13px", color: COLORS.stone, lineHeight: "1.6", fontFamily: "'Helvetica Neue', sans-serif" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Proper containers, not Home Depot bins ── */}
      <div style={{ background: COLORS.cream }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { tier: "Essential", desc: "Gamma Seal food-grade buckets with airtight spin-off lids. The most trusted system among serious home preppers.", badge: "Good" },
              { tier: "Premium", desc: "IRIS USA airtight modular containers with silicone-gasketed latch lids. Designed specifically for uniform stacking.", badge: "Better" },
              { tier: "Professional", desc: "Safecastle long-term storage systems with oxygen absorbers and mylar-lined seals. Restaurant-grade durability.", badge: "Best" },
            ].map(({ tier, desc, badge }) => (
              <div key={tier} style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.bark }}>{tier}</div>
                  <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", background: COLORS.moss, color: COLORS.white, borderRadius: "20px", padding: "2px 10px" }}>{badge}</span>
                </div>
                <div style={{ fontSize: "13px", color: COLORS.stone, lineHeight: "1.6", fontFamily: "'Helvetica Neue', sans-serif" }}>{desc}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>Purpose-built storage</div>
            <h2 style={{ fontSize: "26px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px", lineHeight: "1.3", margin: "0 0 16px", fontFamily: "'Georgia', serif" }}>
              Not orange bins from the hardware store.
            </h2>
            <p style={{ fontSize: "14px", color: COLORS.stone, lineHeight: "1.75", margin: "0 0 14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
              Generic storage totes let in moisture, pests, and air — the three things that silently destroy a food supply. QuietReady uses certified food-grade airtight containers with proper sealing systems, designed specifically for long-term food storage.
            </p>
            <p style={{ fontSize: "14px", color: COLORS.stone, lineHeight: "1.75", margin: "0 0 24px", fontFamily: "'Helvetica Neue', sans-serif" }}>
              Every container is assigned a specific location in your personal storage map. We include a label machine and a detailed labeling schematic so setup is fast and foolproof — you'll always know exactly what's where, and so will we.
            </p>
            <button
              onClick={onStart}
              style={{ background: COLORS.moss, color: COLORS.white, border: "none", borderRadius: "8px", padding: "13px 24px", fontSize: "13px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "'Helvetica Neue', sans-serif" }}
            >
              Build my plan →
            </button>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={styles.heroEyebrow}>How It Works</div>
          <div style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "-0.8px" }}>From quiz to covered in 30 days.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {[
            { step: "01", title: "Answer 10 questions", desc: "Tell us about your household, caloric needs, storage space, dietary needs, and budget." },
            { step: "02", title: "Review your plan", desc: "We build a precise, personalized food security plan for your family." },
            { step: "03", title: "We handle everything", desc: "We source, purchase, and coordinate delivery from trusted suppliers." },
            { step: "04", title: "Stay current automatically", desc: "We track expiry dates and rotate your supply on a smart monthly schedule." },
          ].map((s) => (
            <div key={s.step} style={{ background: COLORS.white, padding: "28px 24px", border: `1px solid ${COLORS.mist}` }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: COLORS.mist, letterSpacing: "-1px", marginBottom: "12px" }}>{s.step}</div>
              <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.3px" }}>{s.title}</div>
              <div style={{ fontSize: "13px", color: COLORS.stone, lineHeight: "1.6", fontFamily: "'Helvetica Neue', sans-serif" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN SCREEN ─────────────────────────────────────────────────────────────

function AdminScreen({ onLogout }) {
  const [adminToken, setAdminToken]   = useState(() => localStorage.getItem("qr_admin_token") || null);
  const [loginEmail, setLoginEmail]   = useState("");
  const [loginPass,  setLoginPass]    = useState("");
  const [loginErr,   setLoginErr]     = useState("");
  const [logging,    setLogging]      = useState(false);

  const [cbiData,           setCbiData]           = useState([]);
  const [customers,         setCustomers]         = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [activeTab,         setActiveTab]         = useState("cbi");
  const [expandedCustomer,  setExpandedCustomer]  = useState(null);  // { id, data, loading }

  const adminFetch = (url, opts = {}) =>
    fetch(url, { ...opts, headers: { "Authorization": `Bearer ${adminToken}`, "Content-Type": "application/json", ...(opts.headers || {}) } });

  const toggleCustomerDetail = async (customerId) => {
    // Collapse if already open
    if (expandedCustomer?.id === customerId) { setExpandedCustomer(null); return; }
    setExpandedCustomer({ id: customerId, data: null, loading: true });
    try {
      const res  = await adminFetch(`/api/admin/customers/${customerId}`);
      const data = await res.json();
      setExpandedCustomer({ id: customerId, data, loading: false });
    } catch {
      setExpandedCustomer({ id: customerId, data: null, loading: false, error: "Failed to load" });
    }
  };

  // Load dashboard data when token available
  useEffect(() => {
    if (!adminToken) return;
    setLoading(true);
    Promise.all([
      adminFetch("/api/admin/cbi/latest").then(r => r.json()),
      adminFetch("/api/admin/customers").then(r => r.json()),
    ]).then(([cbi, custs]) => {
      if (cbi?.error) { localStorage.removeItem("qr_admin_token"); setAdminToken(null); return; }
      setCbiData(Array.isArray(cbi) ? [...cbi].reverse() : []);   // oldest first for chart
      setCustomers(Array.isArray(custs) ? custs : (custs?.customers || []));
    }).catch(console.error).finally(() => setLoading(false));
  }, [adminToken]);

  const handleLogin = async () => {
    setLogging(true); setLoginErr("");
    try {
      const res  = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: loginEmail, password: loginPass }) });
      const data = await res.json();
      if (!res.ok) { setLoginErr(data.error || "Login failed"); return; }
      localStorage.setItem("qr_admin_token", data.accessToken);
      setAdminToken(data.accessToken);
    } catch { setLoginErr("Network error"); }
    finally { setLogging(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("qr_admin_token");
    setAdminToken(null);
    setCbiData([]); setCustomers([]);
  };

  // ── Login wall ──────────────────────────────────────────────
  if (!adminToken) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', sans-serif" }}>
        <div style={{ background: COLORS.cream, borderRadius: "12px", padding: "48px", width: "360px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "8px" }}>QuietReady</div>
          <div style={{ fontSize: "24px", fontWeight: "700", color: COLORS.bark, marginBottom: "32px", fontFamily: "Georgia, serif" }}>Admin Access</div>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", color: COLORS.stone, marginBottom: "6px", textTransform: "uppercase" }}>Email</div>
            <input
              type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${COLORS.mist}`, borderRadius: "6px", fontSize: "14px", background: COLORS.white, color: COLORS.bark, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", color: COLORS.stone, marginBottom: "6px", textTransform: "uppercase" }}>Password</div>
            <input
              type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${COLORS.mist}`, borderRadius: "6px", fontSize: "14px", background: COLORS.white, color: COLORS.bark, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {loginErr && <div style={{ color: "#C45A4A", fontSize: "13px", marginBottom: "16px" }}>{loginErr}</div>}
          <button
            onClick={handleLogin} disabled={logging}
            style={{ width: "100%", background: COLORS.moss, color: COLORS.white, border: "none", padding: "12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            {logging ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  // ── CBI Chart (SVG, no deps) ────────────────────────────────
  const CbiChart = () => {
    if (!cbiData.length) return <div style={{ color: COLORS.stone, fontSize: "14px", padding: "40px", textAlign: "center" }}>No CBI data yet.</div>;

    const W = 700, H = 220, PAD = { top: 20, right: 20, bottom: 40, left: 64 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top  - PAD.bottom;

    const cpcs    = cbiData.map(d => d.raw_prices?.today_cpc ?? d.cbi_value * 0.003821 / 100);
    const minCpc  = Math.min(...cpcs) * 0.995;
    const maxCpc  = Math.max(...cpcs) * 1.005;
    const xStep   = cbiData.length > 1 ? innerW / (cbiData.length - 1) : innerW;

    const toX = i  => PAD.left + i * xStep;
    const toY = v  => PAD.top + innerH - ((v - minCpc) / (maxCpc - minCpc)) * innerH;

    const linePath = cpcs.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
    const areaPath = linePath + ` L${toX(cpcs.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

    // Y axis ticks
    const yTicks = 4;
    const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minCpc + (maxCpc - minCpc) * (i / yTicks));

    // X axis labels — show first, middle, last
    const xLabelIdxs = cbiData.length <= 7
      ? cbiData.map((_, i) => i)
      : [0, Math.floor((cbiData.length - 1) / 2), cbiData.length - 1];

    const launch_cpc = cbiData[0]?.raw_prices?.launch_cpc;
    const launchY    = launch_cpc ? toY(launch_cpc) : null;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        <defs>
          <linearGradient id="cbiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={COLORS.moss} stopOpacity="0.25" />
            <stop offset="100%" stopColor={COLORS.moss} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTickVals.map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={toY(v)} x2={PAD.left + innerW} y2={toY(v)} stroke={COLORS.mist} strokeWidth="1" />
            <text x={PAD.left - 8} y={toY(v) + 4} textAnchor="end" fontSize="10" fill={COLORS.stone} fontFamily="'Helvetica Neue', sans-serif">
              {v.toFixed(6)}
            </text>
          </g>
        ))}

        {/* Launch baseline */}
        {launchY && (
          <g>
            <line x1={PAD.left} y1={launchY} x2={PAD.left + innerW} y2={launchY} stroke={COLORS.clay} strokeWidth="1" strokeDasharray="4 3" />
            <text x={PAD.left + innerW + 4} y={launchY + 4} fontSize="9" fill={COLORS.clay} fontFamily="'Helvetica Neue', sans-serif">launch</text>
          </g>
        )}

        {/* Area fill */}
        <path d={areaPath} fill="url(#cbiGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={COLORS.moss} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Data points */}
        {cpcs.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={COLORS.moss} />
        ))}

        {/* X axis labels */}
        {xLabelIdxs.map(i => (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="10" fill={COLORS.stone} fontFamily="'Helvetica Neue', sans-serif">
            {cbiData[i].basis_date?.slice(5)}
          </text>
        ))}
      </svg>
    );
  };

  // ── Latest CBI stats ────────────────────────────────────────
  const latest   = cbiData[cbiData.length - 1];
  const prev     = cbiData[cbiData.length - 2];
  const latestCpc = latest?.raw_prices?.today_cpc ?? null;
  const prevCpc   = prev?.raw_prices?.today_cpc   ?? null;
  const cpcDelta  = latestCpc && prevCpc ? ((latestCpc - prevCpc) / prevCpc * 100).toFixed(2) : null;
  const launchCpc = cbiData[0]?.raw_prices?.launch_cpc ?? null;
  const launchDelta = latestCpc && launchCpc ? ((latestCpc - launchCpc) / launchCpc * 100).toFixed(2) : null;

  const statBox = (label, value, sub, subColor) => (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "20px 24px", flex: "1", minWidth: "140px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.bark, fontFamily: "Georgia, serif" }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: subColor || COLORS.stone, marginTop: "4px", fontFamily: "'Helvetica Neue', sans-serif" }}>{sub}</div>}
    </div>
  );

  // ── Tabs ─────────────────────────────────────────────────────
  const TAB_STYLE = (active) => ({
    fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase",
    padding: "8px 20px", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif",
    borderBottom: active ? `2px solid ${COLORS.moss}` : "2px solid transparent",
    color: active ? COLORS.moss : COLORS.stone, background: "none", border: "none",
    borderBottom: active ? `2px solid ${COLORS.moss}` : "2px solid transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Helvetica Neue', sans-serif" }}>
      {/* Nav */}
      <div style={{ background: COLORS.bark, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.cream, fontFamily: "Georgia, serif", letterSpacing: "-0.3px" }}>QuietReady</div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.stone, paddingLeft: "12px", borderLeft: `1px solid ${COLORS.stone}40` }}>Admin</div>
        </div>
        <button onClick={handleLogout} style={{ background: "none", border: `1px solid ${COLORS.stone}40`, color: COLORS.stone, padding: "6px 16px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.mist}`, padding: "0 32px", display: "flex", gap: "4px" }}>
        {[["cbi", "📈 CBI Prices"], ["customers", "👥 Customers"]].map(([key, label]) => (
          <button key={key} style={TAB_STYLE(activeTab === key)} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        {loading && <div style={{ color: COLORS.stone, fontSize: "14px", textAlign: "center", padding: "60px" }}>Loading…</div>}

        {/* ── CBI Tab ── */}
        {!loading && activeTab === "cbi" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px" }}>Cost Basis Index</div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: COLORS.bark, fontFamily: "Georgia, serif", letterSpacing: "-0.8px" }}>Price-per-Calorie History</div>
              <div style={{ fontSize: "13px", color: COLORS.stone, marginTop: "4px" }}>Kroger store-brand basket · updated daily 3am UTC</div>
            </div>

            {/* Stat row */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
              {statBox("Today CPC", latestCpc ? `$${latestCpc.toFixed(6)}` : "—", cpcDelta ? `${cpcDelta > 0 ? "▲" : "▼"} ${Math.abs(cpcDelta)}% vs yesterday` : null, parseFloat(cpcDelta) > 0 ? COLORS.clay : COLORS.moss)}
              {statBox("Launch CPC", launchCpc ? `$${launchCpc.toFixed(6)}` : "—", "2026-03-14 baseline")}
              {statBox("Change vs Launch", launchDelta ? `${launchDelta > 0 ? "+" : ""}${launchDelta}%` : "—", launchDelta > 0 ? "Prices up since launch" : "Prices down since launch", parseFloat(launchDelta) > 0 ? COLORS.clay : COLORS.moss)}
              {statBox("Days Tracked", cbiData.length, `${cbiData[0]?.basis_date ?? "—"} → ${latest?.basis_date ?? "—"}`)}
            </div>

            {/* Chart */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "24px 24px 16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "16px" }}>$/kcal over time</div>
              <CbiChart />
            </div>

            {/* Raw data table */}
            <div style={{ marginTop: "20px", background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.mist}`, fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.stone }}>Daily Log</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                  <thead>
                    <tr style={{ background: COLORS.cream }}>
                      {["Date", "CBI Value", "CPC ($/kcal)", "vs Launch"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: COLORS.stone, fontWeight: "600", letterSpacing: "0.5px", borderBottom: `1px solid ${COLORS.mist}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...cbiData].reverse().map((row, i) => {
                      const cpc  = row.raw_prices?.today_cpc;
                      const base = row.raw_prices?.launch_cpc ?? launchCpc;
                      const pct  = cpc && base ? ((cpc - base) / base * 100).toFixed(2) : null;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${COLORS.mist}`, background: i === 0 ? `${COLORS.moss}08` : "transparent" }}>
                          <td style={{ padding: "10px 16px", color: COLORS.bark, fontWeight: i === 0 ? "700" : "400" }}>{row.basis_date}{i === 0 && <span style={{ marginLeft: "8px", fontSize: "10px", color: COLORS.moss, fontWeight: "600" }}>TODAY</span>}</td>
                          <td style={{ padding: "10px 16px", color: COLORS.bark }}>{row.cbi_value?.toFixed(2)}</td>
                          <td style={{ padding: "10px 16px", color: COLORS.bark, fontFamily: "monospace" }}>{cpc ? `$${cpc.toFixed(6)}` : "—"}</td>
                          <td style={{ padding: "10px 16px", color: pct > 0 ? COLORS.clay : pct < 0 ? COLORS.moss : COLORS.stone }}>{pct ? `${pct > 0 ? "+" : ""}${pct}%` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Customer Impact Flags ── */}
            {(() => {
              const FLAG_THRESHOLD = 2; // % change to trigger a flag
              const activeCusts = customers.filter(c => c.status === "active" && c.personal_cbi);
              const currentCbiVal = latest?.cbi_value ?? 100;

              const flagged = activeCusts.map(c => {
                const personalCbi  = c.personal_cbi ?? 100;
                const changePct    = parseFloat((((currentCbiVal - personalCbi) / personalCbi) * 100).toFixed(2));
                const budget       = c.customer_preferences?.monthly_budget ?? 0;
                const productBudget = budget - 30;
                const monthlyImpact = parseFloat((productBudget * (changePct / 100)).toFixed(2));
                return { ...c, personalCbi, changePct, monthlyImpact };
              }).filter(c => Math.abs(c.changePct) >= FLAG_THRESHOLD)
                .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));

              return (
                <div style={{ marginTop: "20px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px" }}>Customer Impact</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: COLORS.bark, fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}>CBI Impact Flags</div>
                    <div style={{ fontSize: "13px", color: COLORS.stone, marginTop: "4px" }}>
                      Active customers whose food costs have moved ≥{FLAG_THRESHOLD}% since they enrolled
                    </div>
                  </div>

                  {flagged.length === 0 ? (
                    <div style={{ background: `${COLORS.moss}10`, border: `1px solid ${COLORS.moss}30`, borderRadius: "10px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>✅</span>
                      <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark }}>No customers flagged</div>
                        <div style={{ fontSize: "12px", color: COLORS.stone, marginTop: "2px" }}>
                          All {activeCusts.length} active customer{activeCusts.length !== 1 ? "s" : ""} are within {FLAG_THRESHOLD}% of their enrollment CBI.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", overflow: "hidden" }}>
                      {/* Flag summary bar */}
                      <div style={{ background: flagged.some(f => f.changePct > 0) ? "#FEF6ED" : "#EDF2E8", borderBottom: `1px solid ${COLORS.mist}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "18px" }}>{flagged.some(f => f.changePct > 0) ? "📈" : "📉"}</span>
                        <div style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.bark }}>
                            {flagged.length} customer{flagged.length !== 1 ? "s" : ""} affected by CBI movement
                          </div>
                          <div style={{ fontSize: "12px", color: COLORS.stone, marginTop: "2px" }}>
                            Consider reaching out to customers with large positive changes — their plan timelines may be slipping.
                          </div>
                        </div>
                      </div>

                      {/* Impact table */}
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                        <thead>
                          <tr style={{ background: COLORS.cream }}>
                            {["Customer", "Enrolled CBI", "Current CBI", "Change", "Budget Impact / mo", "Monthly Budget"].map(h => (
                              <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: COLORS.stone, fontWeight: "600", letterSpacing: "0.5px", borderBottom: `1px solid ${COLORS.mist}` }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {flagged.map((c, i) => {
                            const up = c.changePct > 0;
                            return (
                              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.mist}`, background: i % 2 === 0 ? "transparent" : COLORS.cream }}>
                                <td style={{ padding: "12px 16px" }}>
                                  <div style={{ fontWeight: "600", color: COLORS.bark }}>{c.full_name || "—"}</div>
                                  <div style={{ fontSize: "11px", color: COLORS.stone, marginTop: "2px", fontFamily: "monospace" }}>{c.email}</div>
                                </td>
                                <td style={{ padding: "12px 16px", color: COLORS.bark, fontFamily: "monospace" }}>{c.personalCbi.toFixed(1)}</td>
                                <td style={{ padding: "12px 16px", color: COLORS.bark, fontFamily: "monospace" }}>{currentCbiVal.toFixed(1)}</td>
                                <td style={{ padding: "12px 16px" }}>
                                  <span style={{ background: up ? "#FEF6ED" : "#EDF2E8", color: up ? COLORS.clay : COLORS.moss, padding: "3px 10px", borderRadius: "20px", fontWeight: "700", fontSize: "12px" }}>
                                    {up ? "▲" : "▼"} {Math.abs(c.changePct)}%
                                  </span>
                                </td>
                                <td style={{ padding: "12px 16px", fontWeight: "700", color: up ? COLORS.clay : COLORS.moss }}>
                                  {up ? "+" : ""}{c.monthlyImpact < 0 ? "-" : ""}${Math.abs(c.monthlyImpact).toFixed(2)}
                                </td>
                                <td style={{ padding: "12px 16px", color: COLORS.stone }}>
                                  ${c.customer_preferences?.monthly_budget ?? "—"}/mo
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Footer note */}
                      <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.mist}`, fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
                        Budget impact = product budget × CBI change %. Positive = customer needs more money to stay on schedule. CBI threshold: {FLAG_THRESHOLD}%.
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Customers Tab ── */}
        {!loading && activeTab === "customers" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px" }}>Directory</div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: COLORS.bark, fontFamily: "Georgia, serif", letterSpacing: "-0.8px" }}>Customers</div>
              <div style={{ fontSize: "13px", color: COLORS.stone, marginTop: "4px" }}>{customers.length} total · click a row to view household history</div>
            </div>
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: COLORS.cream }}>
                    {["", "Name", "Email", "Status", "Activated", "Budget"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: COLORS.stone, fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", borderBottom: `1px solid ${COLORS.mist}`, width: h === "" ? "28px" : "auto" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => {
                    const statusColor  = { active: COLORS.moss, preview: COLORS.clay, paused: COLORS.stone, cancelled: "#C45A4A" }[c.status] || COLORS.stone;
                    const isExpanded   = expandedCustomer?.id === c.id;
                    const detailData   = isExpanded ? expandedCustomer.data : null;
                    const detailLoading = isExpanded && expandedCustomer.loading;
                    const changes      = detailData?.householdChanges || [];

                    return (
                      <React.Fragment key={i}>
                        {/* Main row */}
                        <tr
                          onClick={() => toggleCustomerDetail(c.id)}
                          style={{ borderBottom: isExpanded ? "none" : `1px solid ${COLORS.mist}`, cursor: "pointer", background: isExpanded ? `${COLORS.moss}08` : "transparent", transition: "background 0.15s" }}
                          onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = COLORS.cream; }}
                          onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                        >
                          <td style={{ padding: "12px 16px", color: COLORS.stone, fontSize: "11px", userSelect: "none" }}>{isExpanded ? "▼" : "▶"}</td>
                          <td style={{ padding: "12px 16px", color: COLORS.bark, fontWeight: "600" }}>{c.full_name || "—"}</td>
                          <td style={{ padding: "12px 16px", color: COLORS.stone, fontFamily: "monospace", fontSize: "12px" }}>{c.email}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: `${statusColor}18`, color: statusColor, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px" }}>{c.status}</span>
                          </td>
                          <td style={{ padding: "12px 16px", color: COLORS.stone, fontSize: "12px" }}>{c.activated_at ? new Date(c.activated_at).toLocaleDateString() : "—"}</td>
                          <td style={{ padding: "12px 16px", color: COLORS.bark }}>{c.customer_preferences?.monthly_budget ? `$${c.customer_preferences.monthly_budget}/mo` : "—"}</td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExpanded && (
                          <tr style={{ borderBottom: `1px solid ${COLORS.mist}` }}>
                            <td colSpan="6" style={{ padding: "0 0 0 48px", background: `${COLORS.moss}08` }}>
                              <div style={{ padding: "16px 24px 20px 0" }}>
                                {detailLoading && (
                                  <div style={{ color: COLORS.stone, fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif", padding: "8px 0" }}>Loading history…</div>
                                )}
                                {!detailLoading && changes.length === 0 && (
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${COLORS.moss}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>✓</div>
                                    <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>No household changes on record.</div>
                                  </div>
                                )}
                                {!detailLoading && changes.length > 0 && (
                                  <div>
                                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "12px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                                      Household change history · {changes.length} event{changes.length !== 1 ? "s" : ""}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                      {changes.map((ch, ci) => {
                                        const diff = ch.changes_json || {};
                                        const people = diff.people || {};
                                        const pets   = diff.pets   || {};
                                        const peopleKeys = Object.keys(people);
                                        const petKeys    = Object.keys(pets);
                                        return (
                                          <div key={ci} style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "8px", padding: "12px 16px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                            {/* Date column */}
                                            <div style={{ flexShrink: 0, minWidth: "90px" }}>
                                              <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.bark, fontFamily: "'Helvetica Neue', sans-serif" }}>
                                                {new Date(ch.changed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                              </div>
                                              <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>
                                                {new Date(ch.changed_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                              </div>
                                            </div>
                                            {/* Changes column */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: ch.reason ? "8px" : "0" }}>
                                                {peopleKeys.map(k => {
                                                  const { from, to } = people[k];
                                                  return (
                                                    <span key={k} style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, borderRadius: "4px", padding: "3px 8px", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.bark }}>
                                                      {k}: <span style={{ color: COLORS.stone, textDecoration: "line-through", marginRight: "3px" }}>{from}</span>
                                                      <span style={{ color: COLORS.moss, fontWeight: "700" }}>→ {to}</span>
                                                    </span>
                                                  );
                                                })}
                                                {petKeys.map(k => {
                                                  const { from, to } = pets[k];
                                                  return (
                                                    <span key={`pet-${k}`} style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, borderRadius: "4px", padding: "3px 8px", fontSize: "12px", fontFamily: "'Helvetica Neue', sans-serif", color: COLORS.bark }}>
                                                      🐾 {k}: <span style={{ color: COLORS.stone, textDecoration: "line-through", marginRight: "3px" }}>{from}</span>
                                                      <span style={{ color: COLORS.moss, fontWeight: "700" }}>→ {to}</span>
                                                    </span>
                                                  );
                                                })}
                                              </div>
                                              {ch.reason && (
                                                <div style={{ fontSize: "12px", color: COLORS.stone, fontStyle: "italic", fontFamily: "'Helvetica Neue', sans-serif" }}>"{ch.reason}"</div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {customers.length === 0 && (
                    <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: COLORS.stone }}>No customers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function App() {
  const [screen, setScreen] = useState("landing"); // landing | questionnaire | portal | setpassword | linkerror | login
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // Admin route — /admin path renders admin area entirely
  if (window.location.pathname === "/admin") {
    return <AdminScreen />;
  }

  // Portal state — populated after magic link auth
  const [portalCustomer, setPortalCustomer] = useState(null);
  const [portalFormData, setPortalFormData] = useState({});
  const [authToken, setAuthToken] = useState(null);
  const [newPasswordToken, setNewPasswordToken] = useState(null); // token for password set

  // ── Magic link / token detection on load ──────────────────────
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type"); // "magiclink" | "signup" | "recovery"

    if (accessToken && (type === "magiclink" || type === "signup" || type === "recovery")) {
      window.history.replaceState(null, "", window.location.pathname);
      // Exchange the magic link token for a real Supabase session token
      fetch("/api/auth/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.sessionToken) {
            setNewPasswordToken(data.sessionToken);
            setScreen("setpassword");
          } else {
            setScreen("linkerror");
          }
        })
        .catch(() => setScreen("linkerror"));
    } else {
      // Check if already logged in
      const saved = localStorage.getItem("qr_token");
      if (saved) {
        setAuthToken(saved);
        loadPortal(saved);
      }
    }
  }, []);

  const loadPortal = async (token) => {
    try {
      const res = await fetch("/api/portal/dashboard", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) { localStorage.removeItem("qr_token"); return; }
        return;
      }
      const data = await res.json();
      setPortalCustomer(data.customer);
      const prefs = data.preferences || {};
      setPortalFormData({
        monthlyBudget:  prefs.monthly_budget,
        coverageMonths: prefs.coverage_months,
        foodPhilosophy: prefs.food_philosophy,
        containerTier:  prefs.container_tier,
        household:      data.household || {},
        containers:     data.containers || [],
        orders:         data.orders    || [],
        costIndex:      data.costIndex  || null,
        preferences:    prefs,
      });
      setScreen("portal");
    } catch (err) {
      console.warn("Portal load failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("qr_token");
    setAuthToken(null);
    setPortalCustomer(null);
    setScreen("landing");
  };

  const steps = STEPS; // defined at top of file
  const currentStep = steps[stepIndex];
  const progress = ((stepIndex) / (steps.length - 2)) * 100;

  const canAdvance = () => {
    if (currentStep === "household") {
      const totalPeople = Object.values(formData.household || {}).reduce((s, v) => s + v, 0);
      const totalPets = Object.values(formData.pets || {}).reduce((s, v) => s + (v?.count || 0), 0);
      return totalPeople > 0 || totalPets > 0;
    }
    if (currentStep === "duration") return !!formData.duration;
    if (currentStep === "storage") return formData.storageL && formData.storageW;
    if (currentStep === "containers") return !!formData.containerTier;
    return true;
  };

  const submitOnboarding = async () => {
    if (!email || !email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!fullName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setShowEmailModal(false);
      setStepIndex(stepIndex + 1); // advance to success screen
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "household": return <StepHousehold data={formData} setData={setFormData} />;
      case "caloricIntake": return <StepCalories data={formData} setData={setFormData} />;
      case "dietary": return <StepDietary data={formData} setData={setFormData} />;
      case "foodPhilosophy": return <StepFoodPhilosophy data={formData} setData={setFormData} />;
      case "storage": return <StepStorage data={formData} setData={setFormData} />;
      case "coverageBudget": return <StepCoverageBudget data={formData} setData={setFormData} />;
      case "utilities": return <StepUtilities data={formData} setData={setFormData} />;
      case "equipment": return <StepEquipment data={formData} setData={setFormData} />;
      case "containers": return <StepContainers data={formData} setData={setFormData} />;
      case "plan": return <StepPlan data={formData} setData={setFormData} />;
      case "success": return <StepSuccess data={formData} />;
      default: return null;
    }
  };

  // ── Set-password screen (shown after magic link click) ────────
  if (screen === "setpassword") {
    return (
      <SetPasswordScreen
        token={newPasswordToken}
        onComplete={(token) => {
          setAuthToken(token);
          loadPortal(token);
        }}
      />
    );
  }

  // ── Link error screen (expired/invalid magic link) ───────────
  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("landing")}
        onLogin={(token) => {
          setAuthToken(token);
          loadPortal(token);
        }}
      />
    );
  }

  if (screen === "linkerror") {
    return <LinkErrorScreen onBack={() => setScreen("landing")} />;
  }

  // ── Portal screen ─────────────────────────────────────────────
  if (screen === "portal" && portalCustomer) {
    return (
      <Portal
        customer={portalCustomer}
        formData={portalFormData}
        authToken={authToken}
        onActivated={(updatedCustomer) => setPortalCustomer(updatedCustomer)}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === "landing") {
    return (
      <div style={styles.app}>
        <nav style={styles.nav}>
          <div>
            <div style={styles.logoWrap}>
              <div style={styles.logoName}>QuietReady.ai</div>
              <div style={styles.logoTagline}>Smart Pantry. Peace of Mind.</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => {
                const saved = localStorage.getItem("qr_token");
                if (saved) { setAuthToken(saved); loadPortal(saved); }
                else setScreen("login");
              }}
              style={{ background: "none", border: `1px solid ${COLORS.mist}`, padding: "9px 20px", fontSize: "12px", letterSpacing: "1px", color: COLORS.stone, cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "500" }}
            >
              Log In
            </button>
            <button style={{ ...styles.ctaButton, padding: "10px 24px", fontSize: "12px" }} onClick={() => setScreen("questionnaire")}>
              Get Started
            </button>
          </div>
        </nav>
        <LandingPage onStart={() => setScreen("questionnaire")} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={{ cursor: "pointer" }} onClick={() => { setScreen("landing"); setStepIndex(0); setFormData({}); }}>
          <div style={styles.logoWrap}>
            <div style={styles.logoName}>QuietReady.ai</div>
            <div style={styles.logoTagline}>Smart Pantry. Peace of Mind.</div>
          </div>
        </div>
        {currentStep !== "success" && (
          <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: "12px", color: COLORS.stone, letterSpacing: "1px" }}>
            {stepIndex + 1} / {steps.length - 1}
          </div>
        )}
      </nav>

      <div style={styles.questionnaireWrap}>
        {currentStep !== "success" && (
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        )}

        {renderStep()}

        {currentStep !== "success" && (
          <div style={styles.navButtons}>
            <button
              style={styles.btnBack}
              onClick={() => {
                if (stepIndex === 0) { setScreen("landing"); }
                else setStepIndex(stepIndex - 1);
              }}
            >
              ← {stepIndex === 0 ? "Home" : "Back"}
            </button>
            <button
              style={{ ...styles.btnNext, opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? "pointer" : "not-allowed" }}
              onClick={() => {
                if (!canAdvance()) return;
                if (currentStep === "plan") {
                  setShowEmailModal(true);
                } else {
                  setStepIndex(stepIndex + 1);
                }
              }}
            >
              {currentStep === "plan" ? "Approve & Get Started →" : "Continue →"}
            </button>
          </div>
        )}
      </div>

      {/* Email capture modal */}
      {showEmailModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(44,36,22,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "24px",
        }}>
          <div style={{
            background: COLORS.white, borderRadius: "16px", padding: "40px 36px",
            maxWidth: "440px", width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "12px", textAlign: "center" }}>🏡</div>
            <h2 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: "700", color: COLORS.bark, textAlign: "center", letterSpacing: "-0.5px" }}>
              You're almost in.
            </h2>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
              We'll create your account and send a magic link so you can track everything in your portal.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Your name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  autoFocus
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${COLORS.mist}`, fontSize: "15px", color: COLORS.bark, background: COLORS.white, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = COLORS.moss}
                  onBlur={e => e.target.style.borderColor = COLORS.mist}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.stone, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitOnboarding()}
                  placeholder="jane@example.com"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: `1.5px solid ${COLORS.mist}`, fontSize: "15px", color: COLORS.bark, background: COLORS.white, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = COLORS.moss}
                  onBlur={e => e.target.style.borderColor = COLORS.mist}
                />
              </div>
            </div>
            {submitError && (
              <div style={{ background: "#FEF0EE", border: "1px solid #F5C6C0", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B94040", marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                {submitError}
              </div>
            )}
            <button
              onClick={submitOnboarding}
              disabled={submitting}
              style={{
                width: "100%", background: submitting ? COLORS.stone : COLORS.moss,
                color: COLORS.white, border: "none", borderRadius: "10px",
                padding: "14px", fontSize: "15px", fontWeight: "700",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.2s",
              }}
            >
              {submitting ? "Creating your account..." : "Create my account →"}
            </button>
            <button
              onClick={() => { setShowEmailModal(false); setSubmitError(""); }}
              style={{ width: "100%", background: "none", border: "none", marginTop: "12px", fontSize: "13px", color: COLORS.stone, cursor: "pointer", fontFamily: "inherit" }}
            >
              ← Go back and review
            </button>
            <p style={{ margin: "16px 0 0", fontSize: "11px", color: COLORS.stone, textAlign: "center", fontFamily: "'Helvetica Neue', sans-serif" }}>
              No credit card required. Cancel anytime. We'll never spam you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
