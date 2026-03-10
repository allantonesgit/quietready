import { useState, useEffect, useRef } from "react";


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
      <div style={styles.stepLabel}>Step 1 of 9 — Your Household</div>
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
      <div style={styles.stepLabel}>Step 2 of 8 — Dietary Needs</div>
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
      <div style={styles.stepLabel}>Step 3 of 9 — Food Philosophy</div>
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

  // ── Live storage fit check (mirrors StepContainers logic) ──
  const L = parseFloat(data.storageL) || 0;
  const W = parseFloat(data.storageW) || 0;
  const stackH = parseFloat(data.maxStack) || parseFloat(data.storageH) || 4;
  const hasSpaceData = L > 0 && W > 0;

  const volPerPersonPerMonth = { wholeFood: 2.2, balanced: 1.9, freezeDried: 1.4, noPreference: 1.6 }[data.foodPhilosophy] || 1.9;
  const volPerPetPerMonth = (() => {
    let v = 0;
    if (pets.dogs?.count > 0) v += pets.dogs.count * ({ Small: 0.18, Medium: 0.38, Large: 0.70 }[pets.dogs.size] || 0.38);
    if (pets.cats?.count > 0) v += pets.cats.count * 0.22;
    return v;
  })();
  const totalFoodVolume = (totalPeople * volPerPersonPerMonth + volPerPetPerMonth) * coverageMonths;

  // Default to Essential tier if not yet chosen
  const tierKey = data.containerTier && data.containerTier !== "none" ? data.containerTier : "good";
  const containerVol      = { good: 0.57, better: 1.71, best: 2.05 }[tierKey];
  const containerFootprint = { good: 1.00, better: 1.71, best: 2.08 }[tierKey];
  const containerHeightFt  = { good: 1.21, better: 1.375, best: 1.54 }[tierKey];
  const tierLabel          = { good: "5-gal buckets", better: "IRIS 60qt", best: "LTS professional" }[tierKey];

  const estContainers      = Math.ceil(totalFoodVolume / containerVol);
  const containersPerStack = Math.max(1, Math.floor(stackH / containerHeightFt));
  const stacksNeeded       = Math.ceil(estContainers / containersPerStack);
  const sqFtNeeded         = parseFloat((stacksNeeded * containerFootprint).toFixed(1));
  const sqFtAvailable      = L * W;
  const storageExceeded    = hasSpaceData && sqFtNeeded > sqFtAvailable;
  const sqFtShort          = hasSpaceData ? Math.max(0, sqFtNeeded - sqFtAvailable).toFixed(1) : 0;

  // Find max coverage months that fits in the space
  const maxFittingMonths = (() => {
    if (!hasSpaceData) return null;
    for (let m = 12; m >= 0.5; m -= 0.5) {
      const vol = (totalPeople * volPerPersonPerMonth + volPerPetPerMonth) * m;
      const ctrs = Math.ceil(vol / containerVol);
      const stacks = Math.ceil(ctrs / containersPerStack);
      if (stacks * containerFootprint <= sqFtAvailable) return m;
    }
    return 0.5;
  })();

  return (
    <div>
      <div style={styles.stepLabel}>Step 5 of 8 — Coverage & Budget</div>
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
            {estContainers} {tierLabel} need ~{sqFtNeeded} sq ft of floor space
            ({stacksNeeded} stacks, {containersPerStack} high). Your space has {sqFtAvailable} sq ft — {sqFtShort} sq ft short.
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
      <div style={styles.stepLabel}>Step 4 of 8 — Storage Space</div>
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
      <div style={styles.stepLabel}>Step 6 of 8 — Utilities & Cooking</div>
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
      <div style={styles.stepLabel}>Step 7 of 8 — Equipment & Supplies</div>
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
  const [hoveredBrand, setHoveredBrand] = useState(null);

  const brandInfo = {
    "Gamma Seal / HDX": {
      title: "Gamma Seal & HDX",
      body: "Gamma Seal lids are the gold standard for food-grade bucket storage — a two-piece system with a threaded spin-off lid that creates an airtight seal. HDX (Home Depot's brand) 5-gallon buckets are BPA-free, food-safe, and the most widely available option. Together they form a simple, proven system used by serious preppers for decades. Easy to find locally if you ever need replacements.",
      pros: ["Widely available at Home Depot & online", "Replacement lids easy to source locally", "Ideal for bulk grains, beans & rice with oxygen absorbers", "5-gallon size is easiest to move when full"],
      cons: ["Less uniform stacking than modular systems", "Buckets vary slightly in diameter by batch"],
    },
    "IRIS USA / Sterilite": {
      title: "IRIS USA & Sterilite",
      body: "IRIS USA produces some of the most popular modular airtight storage systems on the market — engineered specifically for uniform stacking with positive-latch lids and silicone gasket seals. Sterilite's WeatherTight line offers similar quality at a slightly lower price point. Both brands are designed to stack predictably, making them ideal for maximizing vertical space in a dedicated storage room or basement.",
      pros: ["Perfectly uniform — every box same size", "Latching lids with silicone gaskets", "UV-resistant versions for garage/shed storage", "Cleaner look than buckets for living space storage"],
      cons: ["Not ideal for bulk dry goods without inner mylar bags", "Lids can weaken over many open/close cycles"],
    },
    "Safecastle / LTS": {
      title: "Safecastle & LTS (Long Term Storage)",
      body: "Safecastle is a professional-grade emergency preparedness retailer supplying military, FEMA, and serious long-term preppers. Their container systems and those from Long Term Storage (LTS) are engineered for 20–25 year storage with integrated oxygen absorbers, heavy-gauge construction, and compatibility with professional racking systems. These are the containers used in serious bunker-style setups and are overkill for most households — but unmatched if you're planning for truly long-term resilience.",
      pros: ["25-year rated shelf life systems", "Oxygen absorbers integrated or included", "Compatible with professional metal racking", "Custom label holders built into lids", "Preferred by emergency management professionals"],
      cons: ["Significantly higher cost", "Harder to source locally — primarily online", "Heavier and less portable when full"],
    },
  };

  const tiers = [
    {
      key: "good",
      name: "Essential",
      stars: "★★★☆☆",
      price: "$",
      estCost: "Est. $180–$320",
      brand: "Gamma Seal / HDX",
      features: [
        "Food-grade HDPE buckets with Gamma Seal lids",
        "5-gallon stackable design",
        "Airtight oxygen barrier",
        "BPA-free construction",
        "Fits standard shelving",
      ],
    },
    {
      key: "better",
      name: "Premium",
      stars: "★★★★☆",
      price: "$$$",
      estCost: "Est. $420–$680",
      brand: "IRIS USA / Sterilite",
      features: [
        "Modular airtight stack system",
        "Uniform sizing for maximum space efficiency",
        "Latching lids with silicone seals",
        "UV-resistant for garage/basement storage",
        "Stackable up to 6 high safely",
      ],
    },
    {
      key: "best",
      name: "Professional",
      stars: "★★★★★",
      price: "$$$$$",
      estCost: "Est. $900–$1,400",
      brand: "Safecastle / LTS",
      features: [
        "Military-spec airtight containers",
        "Integrated oxygen absorbers included",
        "25-year storage rating",
        "Custom label holders built in",
        "Modular racking system compatible",
      ],
    },
  ];

  const totalPeople = Object.values(data.household || {}).reduce((s, v) => s + v, 0) || 1;
  const totalPets = Object.values(data.pets || {}).reduce((s, v) => s + (v?.count || 0), 0);
  const durationMonths = { "2weeks": 0.5, "1month": 1, "3months": 3, "6months": 6, "1year": 12 }[data.duration] || (data.coverageMonths || 3);

  // ── Container volume estimation ──
  // Worked out from actual food list quantities per person per month:
  //
  // Balanced: ~18 protein cans + ~20 veg/soup/fruit cans + ~18 lbs dry goods + oils/condiments
  //   Cans (standard 15oz): ~0.016 cu ft each → 38 cans = 0.61 cu ft
  //   Dry goods (~18 lbs loosely packed): ~0.04 cu ft/lb → 0.72 cu ft
  //   Oils, nut butter, condiments: ~0.20 cu ft
  //   Packing inefficiency (air gaps, odd shapes): +25%
  //   → ~1.9 cu ft per person per month
  //
  // Whole Foods: heavier on bulk dry goods (wheat berries, rice, oats, beans fill more space)
  //   → ~2.2 cu ft per person per month
  //
  // Freeze-Dried: #10 cans are large (0.11 cu ft each), entree pouches pack efficiently
  //   → ~1.4 cu ft per person per month
  //
  // Best Value: mostly canned goods + rice/pasta/beans, less variety = denser packing
  //   → ~1.6 cu ft per person per month
  //
  // Pet food: 30 lb bag kibble (large dog) ≈ 0.7 cu ft; medium ~0.35; small ~0.18
  // Using per-pet average of 0.45 cu ft/month (mix of dog sizes + cats)

  const volPerPersonPerMonth = {
    wholeFood:    2.2,
    balanced:     1.9,
    freezeDried:  1.4,
    noPreference: 1.6,
  }[data.foodPhilosophy] || 1.9;

  const volPerPetPerMonth = (() => {
    const pets = data.pets || {};
    let vol = 0;
    if (pets.dogs?.count > 0) {
      const dogVol = { Small: 0.18, Medium: 0.38, Large: 0.70 }[pets.dogs.size] || 0.38;
      vol += pets.dogs.count * dogVol;
    }
    if (pets.cats?.count > 0) vol += pets.cats.count * 0.22;
    const otherCount = (pets.birds?.count || 0) + (pets.smallAnimals?.count || 0);
    vol += otherCount * 0.10;
    return vol; // total per month across all pets
  })();

  const totalFoodVolume = (totalPeople * volPerPersonPerMonth + volPerPetPerMonth) * durationMonths;

  // Container usable volumes (accounting for ~85% fill efficiency):
  // Essential: 5-gal HDPE bucket → 5 gal = 0.668 cu ft × 0.85 = ~0.57 cu ft usable
  // Premium: IRIS 60qt (15 gal) → 2.01 cu ft × 0.85 = ~1.71 cu ft usable
  // Professional: LTS ~18 gal → 2.41 cu ft × 0.85 = ~2.05 cu ft usable
  const containerVol = { good: 0.57, better: 1.71, best: 2.05 };
  const selectedVol = containerVol[data.containerTier] || 0.57;
  const containerEstimate = Math.ceil(totalFoodVolume / selectedVol);

  // ── Storage space fit check ──
  const L = parseFloat(data.storageL) || 0;
  const W = parseFloat(data.storageW) || 0;
  const stackH = parseFloat(data.maxStack) || parseFloat(data.storageH) || 4;

  // Real physical dimensions of each container tier:
  //
  // Essential — 5-gallon HDPE bucket:
  //   Diameter: ~12" → footprint 12"×12" = 1.0 sq ft
  //   Height with Gamma Seal lid: ~14.5" = 1.21 ft
  //
  // Premium — IRIS USA WeatherPro 62qt / Sterilite 60qt:
  //   Footprint: ~18.25" × 13.5" = 246 sq in = 1.71 sq ft
  //   Height with lid: ~16.5" = 1.375 ft
  //
  // Professional — Safecastle/LTS heavy-duty (approx 20-gal):
  //   Footprint: ~20" × 15" = 300 sq in = 2.08 sq ft
  //   Height with lid: ~18.5" = 1.54 ft

  const containerFootprint = { good: 1.00, better: 1.71, best: 2.08 }; // sq ft per container
  const containerHeight    = { good: 1.21, better: 1.375, best: 1.54  }; // ft per container
  const cFoot = containerFootprint[data.containerTier] || 1.00;
  const cH    = containerHeight[data.containerTier]    || 1.21;

  const containersPerStack = Math.max(1, Math.floor(stackH / cH));
  const stacksNeeded       = Math.ceil(containerEstimate / containersPerStack);
  const sqFtNeeded         = parseFloat((stacksNeeded * cFoot).toFixed(1));
  const sqFtAvailable      = L * W;
  const hasSpaceData       = L > 0 && W > 0;
  const fits               = !hasSpaceData || sqFtNeeded <= sqFtAvailable;
  const spaceOverflow      = hasSpaceData ? Math.max(0, sqFtNeeded - sqFtAvailable).toFixed(1) : 0;

  return (
    <div style={{ position: "relative" }}>
      <div style={styles.stepLabel}>Step 8 of 8 — Storage Containers</div>
      <div style={styles.questionTitle}>Choose your container system.</div>
      <div style={styles.questionSub}>
        All tiers use the same brand throughout — ensuring a uniform, stackable, airtight system.
        Your kit will include a label machine, blank label templates, and a personalized container map. When each shipment arrives, your portal will show exactly which container each product belongs in — just print the label and place it.
      </div>
      <div style={{ background: fits ? "#EDF2E8" : "#FDF5EE", padding: "14px 18px", marginBottom: fits ? "24px" : "0", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: fits ? COLORS.moss : COLORS.clay, border: fits ? "none" : `1px solid #F0C89A` }}>
        📦 Estimated containers for {totalPeople} {totalPeople === 1 ? "person" : "people"}{totalPets > 0 ? ` + ${totalPets} pet${totalPets > 1 ? "s" : ""}` : ""}, {durationMonths >= 1 ? `${durationMonths} month${durationMonths > 1 ? "s" : ""}` : "2 weeks"}:{" "}
        <strong>~{containerEstimate} containers</strong>
        {hasSpaceData && (
          <span style={{ color: COLORS.stone }}> · needs ~{sqFtNeeded.toFixed(1)} sq ft ({containersPerStack} high)</span>
        )}
      </div>

      {/* Space warning */}
      {!fits && (
        <div style={{ background: "#FEF3E2", border: `1.5px solid ${COLORS.clay}`, padding: "16px 18px", marginBottom: "24px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: COLORS.bark, lineHeight: "1.6" }}>
          ⚠️ <strong>Storage space may be tight.</strong> Your {L}′ × {W}′ space ({sqFtAvailable} sq ft) is approximately <strong>{spaceOverflow} sq ft short</strong> of what's needed for {containerEstimate} containers at this tier.
          <div style={{ marginTop: "8px", color: COLORS.stone }}>
            Options: choose a larger container tier (fewer, bigger containers), expand to multiple storage locations, or reduce your coverage duration. Your storage map in the portal will help optimize placement.
          </div>
        </div>
      )}
      <div style={{ background: "#FDF5EE", padding: "14px 18px", marginBottom: "24px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: COLORS.clay, border: `1px solid #F0C89A` }}>
        💳 If your container kit exceeds your monthly budget, we'll offer a one-time supplemental charge so you can get fully set up from day one.
      </div>
      {data.foodPhilosophy === "wholeFood" && (
        <div style={{ background: "#EDF2E8", padding: "14px 18px", marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", color: COLORS.moss, border: `1px solid ${COLORS.sage}` }}>
          🌾 <strong>Whole Foods note:</strong> Your plan includes bulk grains, legumes, and seeds which require food-grade buckets with gamma seal lids and oxygen absorbers for proper long-term storage. The Essential and Premium tiers both support this — the Professional tier includes oxygen absorbers in the kit.
        </div>
      )}
      {tiers.map((tier) => {
        const info = brandInfo[tier.brand];
        return (
          <div
            key={tier.key}
            style={{ ...styles.containerCard, ...(data.containerTier === tier.key ? styles.containerCardSelected : {}) }}
            onClick={() => setData({ ...data, containerTier: tier.key })}
          >
            <div style={styles.containerTier}>
              <div>
                <div style={styles.containerName}>
                  {tier.name}{" "}
                  {/* Brand name with hover tooltip trigger */}
                  <span
                    style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: "400", position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => setHoveredBrand(tier.brand)}
                    onMouseLeave={() => setHoveredBrand(null)}
                  >
                    — <span style={{
                      borderBottom: `1.5px dashed ${COLORS.stone}`,
                      cursor: "help",
                      color: hoveredBrand === tier.brand ? COLORS.clay : COLORS.stone,
                      transition: "color 0.15s",
                    }}>{tier.brand}</span> <span style={{ fontSize: "11px", color: COLORS.clay }}>ⓘ</span>

                    {/* Tooltip infobox */}
                    {hoveredBrand === tier.brand && (
                      <div
                        style={{
                          position: "absolute",
                          top: "28px",
                          left: "0",
                          zIndex: 100,
                          width: "340px",
                          background: COLORS.white,
                          border: `1.5px solid ${COLORS.clay}`,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          padding: "18px 20px",
                          fontFamily: "'Helvetica Neue', sans-serif",
                        }}
                      >
                        <div style={{ fontWeight: "700", fontSize: "14px", color: COLORS.bark, marginBottom: "8px" }}>{info.title}</div>
                        <div style={{ fontSize: "12px", color: COLORS.stone, lineHeight: "1.6", marginBottom: "12px" }}>{info.body}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.moss, marginBottom: "6px" }}>Pros</div>
                            {info.pros.map((p, i) => (
                              <div key={i} style={{ fontSize: "11px", color: COLORS.bark, display: "flex", gap: "5px", marginBottom: "3px" }}>
                                <span style={{ color: COLORS.moss, flexShrink: 0 }}>✓</span>{p}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px" }}>Cons</div>
                            {info.cons.map((c, i) => (
                              <div key={i} style={{ fontSize: "11px", color: COLORS.bark, display: "flex", gap: "5px", marginBottom: "3px" }}>
                                <span style={{ color: COLORS.clay, flexShrink: 0 }}>·</span>{c}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
                <div style={styles.containerStars}>{tier.stars} <span style={{ color: COLORS.clay, fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px", fontWeight: "700" }}>{tier.price}</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={styles.containerPrice}>{tier.price}</div>
                <div style={{ fontSize: "12px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>{tier.estCost}</div>
              </div>
            </div>
            <ul style={styles.containerFeatures}>
              {tier.features.map((f, i) => (
                <li key={i} style={styles.containerFeature}><span style={{ color: COLORS.sage }}>✓</span> {f}</li>
              ))}
            </ul>
          </div>
        );
      })}
      <CheckRow
        label="No thanks — I already have containers"
        desc="Skip the container kit; we'll focus on food and supplies"
        checked={data.containerTier === "none"}
        onClick={() => setData({ ...data, containerTier: "none" })}
      />
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
  const containerLabel = { good: "Essential ($)", better: "Premium ($$$)", best: "Professional ($$$$$)", none: "None (skipped)" }[data.containerTier] || "Essential";
  const months = estimateMonths(data, budget);
  const philosophy = data.foodPhilosophy || "balanced";
  const philosophyLabel = { wholeFood: "Whole Foods First 🌾", balanced: "Balanced Mix ⚖️", freezeDried: "Freeze-Dried Convenience 📦", noPreference: "Best Value 🤷" }[philosophy] || "Balanced Mix";

  const dietaryActive = Object.entries(data.dietary || {}).filter(([, v]) => v).map(([k]) => k);
  const equipmentActive = Object.entries(data.equipment || {}).filter(([, v]) => v).length;
  const avoidActive = Object.entries(data.foodAvoid || {}).filter(([, v]) => v).length;

  const foodPlans = {

    wholeFood: [
      // Grains & Starches
      { item: "Whole wheat berries — sealed mylar (25-yr)", qty: `${totalPeople * 12} lbs`,  cat: "Grains" },
      { item: "Organic brown & white rice",                  qty: `${totalPeople * 10} lbs`,  cat: "Grains" },
      { item: "Rolled oats & steel-cut oats",                qty: `${totalPeople * 6} lbs`,   cat: "Grains" },
      // Proteins
      { item: "Canned wild-caught salmon (no salt added)",   qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned sardines in olive oil",                qty: `${totalPeople * 6} cans`,  cat: "Protein" },
      { item: "Canned chunk light tuna in water",            qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned chicken breast (no additives)",        qty: `${totalPeople * 6} cans`,  cat: "Protein" },
      { item: "Heirloom dried beans & lentils",              qty: `${totalPeople * 8} lbs`,   cat: "Protein" },
      // Vegetables
      { item: "Canned organic diced tomatoes",               qty: `${totalPeople * 10} cans`, cat: "Vegetables" },
      { item: "Canned organic pumpkin purée",                qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Canned organic green beans",                  qty: `${totalPeople * 6} cans`,  cat: "Vegetables" },
      { item: "Canned organic corn (no salt added)",         qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Canned organic peas",                         qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Dehydrated vegetables — additive-free",       qty: `${totalPeople * 3} lbs`,   cat: "Vegetables" },
      // Fruit
      { item: "Canned fruit in juice (peaches, pears)",      qty: `${totalPeople * 6} cans`,  cat: "Fruit" },
      { item: "Dried fruits — raisins, dates, apricots",     qty: `${totalPeople * 3} lbs`,   cat: "Fruit" },
      // Fats & Condiments
      { item: "Cold-pressed olive oil",                      qty: `${totalPeople * 2} liters`,cat: "Fats" },
      { item: "Cold-pressed coconut oil",                    qty: `${totalPeople * 1} liters`,cat: "Fats" },
      { item: "Raw honey (indefinite shelf life)",            qty: `${totalPeople * 2} lbs`,   cat: "Sweeteners" },
      { item: "Apple cider vinegar",                         qty: `${totalPeople * 1} bottles`,cat: "Condiments" },
      // Pantry
      { item: "Sea salt, whole peppercorns, dried herbs",    qty: "Spice kit",                cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 7} gallons`,cat: "Water" },
    ],

    balanced: [
      // Grains & Starches
      { item: "Long-grain white rice (longest shelf life)",  qty: `${totalPeople * 12} lbs`,  cat: "Grains" },
      { item: "Rolled oats",                                 qty: `${totalPeople * 6} lbs`,   cat: "Grains" },
      { item: "Pasta — spaghetti, penne, rotini",            qty: `${totalPeople * 8} lbs`,   cat: "Grains" },
      { item: "Canned baked beans",                          qty: `${totalPeople * 6} cans`,  cat: "Grains" },
      // Proteins
      { item: "Canned chunk light tuna in water",            qty: `${totalPeople * 10} cans`, cat: "Protein" },
      { item: "Canned wild-caught salmon",                   qty: `${totalPeople * 6} cans`,  cat: "Protein" },
      { item: "Canned chicken breast",                       qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned beef stew",                            qty: `${totalPeople * 4} cans`,  cat: "Protein" },
      { item: "Canned corned beef hash",                     qty: `${totalPeople * 4} cans`,  cat: "Protein" },
      { item: "Canned sardines in olive oil",                qty: `${totalPeople * 4} cans`,  cat: "Protein" },
      { item: "Dried lentils & split peas",                  qty: `${totalPeople * 6} lbs`,   cat: "Protein" },
      { item: "Almond & peanut butter (sealed jars)",        qty: `${totalPeople * 3} jars`,  cat: "Protein" },
      // Vegetables
      { item: "Canned diced tomatoes & tomato paste",        qty: `${totalPeople * 10} cans`, cat: "Vegetables" },
      { item: "Canned mixed vegetables",                     qty: `${totalPeople * 6} cans`,  cat: "Vegetables" },
      { item: "Canned corn",                                 qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Canned green beans",                          qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Canned mushrooms",                            qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      { item: "Canned potatoes (diced)",                     qty: `${totalPeople * 4} cans`,  cat: "Vegetables" },
      // Soups & Ready Meals
      { item: "Canned soups — tomato, minestrone, chili",    qty: `${totalPeople * 8} cans`,  cat: "Ready Meals" },
      { item: "Canned chili with beans",                     qty: `${totalPeople * 4} cans`,  cat: "Ready Meals" },
      // Fruit
      { item: "Canned peaches, pears & mandarin oranges",    qty: `${totalPeople * 8} cans`,  cat: "Fruit" },
      { item: "Canned pineapple chunks",                     qty: `${totalPeople * 4} cans`,  cat: "Fruit" },
      // Fats & Dairy
      { item: "Olive oil & vegetable oil",                   qty: `${totalPeople * 2} liters`,cat: "Fats" },
      { item: "Evaporated milk (canned)",                    qty: `${totalPeople * 6} cans`,  cat: "Dairy" },
      { item: "Sweetened condensed milk",                    qty: `${totalPeople * 2} cans`,  cat: "Dairy" },
      // Pantry
      { item: "Honey, sugar & brown sugar",                  qty: `${totalPeople * 3} lbs`,   cat: "Sweeteners" },
      { item: "Salt, pepper, garlic powder, spice kit",      qty: "Pantry kit",               cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 7} gallons`,cat: "Water" },
    ],

    freezeDried: [
      // Entrees
      { item: "Freeze-dried chicken & rice entrees",         qty: `${totalPeople * 12} servings`, cat: "Entrees" },
      { item: "Freeze-dried pasta & meat sauce",             qty: `${totalPeople * 10} servings`, cat: "Entrees" },
      { item: "Freeze-dried beef stew",                      qty: `${totalPeople * 8} servings`,  cat: "Entrees" },
      // Proteins (canned backup)
      { item: "Canned chicken breast",                       qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned tuna & salmon",                        qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned Vienna sausages & SPAM",               qty: `${totalPeople * 6} cans`,  cat: "Protein" },
      // Vegetables
      { item: "Freeze-dried mixed vegetables",               qty: `${totalPeople * 6} cans`,  cat: "Vegetables" },
      { item: "Canned corn, peas & green beans",             qty: `${totalPeople * 8} cans`,  cat: "Vegetables" },
      { item: "Canned diced tomatoes",                       qty: `${totalPeople * 6} cans`,  cat: "Vegetables" },
      // Grains
      { item: "Instant white rice",                          qty: `${totalPeople * 10} lbs`,  cat: "Grains" },
      { item: "Instant mashed potatoes",                     qty: `${totalPeople * 4} lbs`,   cat: "Grains" },
      { item: "Quick-cook oatmeal packets",                  qty: `${totalPeople * 30} pkts`,  cat: "Grains" },
      // Soups & Comfort
      { item: "Canned soups — chicken noodle, tomato",       qty: `${totalPeople * 10} cans`, cat: "Soups" },
      { item: "Canned chili & stew",                         qty: `${totalPeople * 6} cans`,  cat: "Soups" },
      // Fruit & Snacks
      { item: "Freeze-dried fruit — strawberries, apples",   qty: `${totalPeople * 4} cans`,  cat: "Fruit" },
      { item: "Canned fruit cocktail & peaches",             qty: `${totalPeople * 6} cans`,  cat: "Fruit" },
      { item: "Crackers, granola bars, hard candy",          qty: "Snack kit",                cat: "Snacks" },
      // Pantry
      { item: "Cooking oil, salt, bouillon cubes",           qty: "Rotation kit",             cat: "Pantry" },
      { item: "Evaporated & powdered milk",                  qty: `${totalPeople * 4} cans`,  cat: "Dairy" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 7} gallons`,cat: "Water" },
    ],

    noPreference: [
      // Best value mix of canned, dry, and freeze-dried
      { item: "White rice",                                  qty: `${totalPeople * 15} lbs`,  cat: "Grains" },
      { item: "Pasta & egg noodles",                         qty: `${totalPeople * 6} lbs`,   cat: "Grains" },
      { item: "Canned tuna, chicken & salmon",               qty: `${totalPeople * 18} cans`, cat: "Protein" },
      { item: "Canned beef stew & chili",                    qty: `${totalPeople * 8} cans`,  cat: "Protein" },
      { item: "Canned SPAM & Vienna sausages",               qty: `${totalPeople * 6} cans`,  cat: "Protein" },
      { item: "Dried beans & lentils",                       qty: `${totalPeople * 8} lbs`,   cat: "Protein" },
      { item: "Peanut butter",                               qty: `${totalPeople * 3} jars`,  cat: "Protein" },
      { item: "Canned mixed vegetables & tomatoes",          qty: `${totalPeople * 12} cans`, cat: "Vegetables" },
      { item: "Canned soups & chowders",                     qty: `${totalPeople * 10} cans`, cat: "Soups" },
      { item: "Canned fruit — peaches, pears, pineapple",    qty: `${totalPeople * 8} cans`,  cat: "Fruit" },
      { item: "Evaporated milk & powdered milk",             qty: `${totalPeople * 6} cans`,  cat: "Dairy" },
      { item: "Cooking oil, salt, sugar, spice kit",         qty: "Pantry kit",               cat: "Pantry" },
      { item: "Water (1 gal/person/day)",                    qty: `${totalPeople * 7} gallons`,cat: "Water" },
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

// ── Activation Modal (3 steps: Address → Payment) ─────────────────────────────
function ActivateModal({ customer, authToken, onActivated, onClose }) {
  const [step, setStep] = useState(1); // 1=address, 2=payment
  const [billingAddress, setBillingAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "", country: "US" });
  const [shippingAddress, setShippingAddress] = useState({ line1: "", line2: "", city: "", state: "", zip: "", country: "US" });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [setupClientSecret, setSetupClientSecret] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

// ── Portal — main customer-facing portal ──────────────────────────────────────
function Portal({ customer, formData, authToken, onActivated, onLogout }) {
  const [activeTab, setActiveTab] = useState("plan");
  const [showActivate, setShowActivate] = useState(false);
  const isPreview = customer?.status === "preview";

  const budget = formData?.monthlyBudget || customer?.preferences?.monthly_budget || 150;
  const productBudget = budget - 30;
  const months = formData?.coverageMonths || customer?.preferences?.coverage_months || 3;
  const philosophy = formData?.foodPhilosophy || customer?.preferences?.food_philosophy || "balanced";
  const totalPeople = Object.values(formData?.household || customer?.household || {}).reduce((s, v) => s + v, 0) || 2;
  const containerTier = formData?.containerTier || customer?.preferences?.container_tier || "good";
  const firstName = customer?.full_name?.split(" ")[0] || "there";

  // Generate the full food plan list (same logic as StepPlan)
  const foodPlans = {
    wholeFood: [
      { item: "Whole wheat berries — sealed mylar", qty: `${totalPeople * 12} lbs`, cat: "Grains" },
      { item: "Organic brown & white rice", qty: `${totalPeople * 10} lbs`, cat: "Grains" },
      { item: "Rolled oats & steel-cut oats", qty: `${totalPeople * 6} lbs`, cat: "Grains" },
      { item: "Canned wild-caught salmon", qty: `${totalPeople * 8} cans`, cat: "Protein" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 8} cans`, cat: "Protein" },
      { item: "Heirloom dried beans & lentils", qty: `${totalPeople * 8} lbs`, cat: "Protein" },
      { item: "Canned organic diced tomatoes", qty: `${totalPeople * 10} cans`, cat: "Vegetables" },
      { item: "Dehydrated vegetables — additive-free", qty: `${totalPeople * 3} lbs`, cat: "Vegetables" },
      { item: "Dried fruits — raisins, dates, apricots", qty: `${totalPeople * 3} lbs`, cat: "Fruit" },
      { item: "Cold-pressed olive oil", qty: `${totalPeople * 2} liters`, cat: "Fats" },
      { item: "Raw honey", qty: `${totalPeople * 2} lbs`, cat: "Sweeteners" },
      { item: "Sea salt, herbs, spice kit", qty: "Spice kit", cat: "Pantry" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14} gallons`, cat: "Water" },
    ],
    balanced: [
      { item: "Long-grain white rice", qty: `${totalPeople * 12} lbs`, cat: "Grains" },
      { item: "Rolled oats", qty: `${totalPeople * 6} lbs`, cat: "Grains" },
      { item: "Pasta — spaghetti, penne, rotini", qty: `${totalPeople * 8} lbs`, cat: "Grains" },
      { item: "Canned baked beans", qty: `${totalPeople * 6} cans`, cat: "Grains" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 10} cans`, cat: "Protein" },
      { item: "Canned chicken breast", qty: `${totalPeople * 8} cans`, cat: "Protein" },
      { item: "Canned beef stew", qty: `${totalPeople * 4} cans`, cat: "Protein" },
      { item: "Dried lentils & split peas", qty: `${totalPeople * 6} lbs`, cat: "Protein" },
      { item: "Almond & peanut butter", qty: `${totalPeople * 3} jars`, cat: "Protein" },
      { item: "Canned diced tomatoes & paste", qty: `${totalPeople * 10} cans`, cat: "Vegetables" },
      { item: "Canned mixed vegetables", qty: `${totalPeople * 6} cans`, cat: "Vegetables" },
      { item: "Canned soups — tomato, minestrone, chili", qty: `${totalPeople * 8} cans`, cat: "Ready Meals" },
      { item: "Canned peaches, pears & mandarin oranges", qty: `${totalPeople * 8} cans`, cat: "Fruit" },
      { item: "Evaporated milk (canned)", qty: `${totalPeople * 6} cans`, cat: "Dairy" },
      { item: "Honey, sugar & brown sugar", qty: `${totalPeople * 3} lbs`, cat: "Sweeteners" },
      { item: "Salt, pepper, garlic powder, spice kit", qty: "Pantry kit", cat: "Pantry" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14} gallons`, cat: "Water" },
    ],
    freezeDried: [
      { item: "Freeze-dried chicken & rice entrees", qty: `${totalPeople * 12} servings`, cat: "Entrees" },
      { item: "Freeze-dried pasta & meat sauce", qty: `${totalPeople * 10} servings`, cat: "Entrees" },
      { item: "Freeze-dried beef stew", qty: `${totalPeople * 8} servings`, cat: "Entrees" },
      { item: "Canned chicken breast", qty: `${totalPeople * 8} cans`, cat: "Protein" },
      { item: "Freeze-dried mixed vegetables", qty: `${totalPeople * 6} cans`, cat: "Vegetables" },
      { item: "Canned diced tomatoes", qty: `${totalPeople * 6} cans`, cat: "Vegetables" },
      { item: "Instant rice & pasta", qty: `${totalPeople * 8} pouches`, cat: "Grains" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14} gallons`, cat: "Water" },
    ],
    noPreference: [
      { item: "Long-grain white rice", qty: `${totalPeople * 14} lbs`, cat: "Grains" },
      { item: "Canned chunk light tuna in water", qty: `${totalPeople * 12} cans`, cat: "Protein" },
      { item: "Canned chicken breast", qty: `${totalPeople * 10} cans`, cat: "Protein" },
      { item: "Dried lentils & split peas", qty: `${totalPeople * 8} lbs`, cat: "Protein" },
      { item: "Canned mixed vegetables", qty: `${totalPeople * 8} cans`, cat: "Vegetables" },
      { item: "Canned soups (variety)", qty: `${totalPeople * 8} cans`, cat: "Ready Meals" },
      { item: "Peanut butter", qty: `${totalPeople * 4} jars`, cat: "Protein" },
      { item: "Honey & sugar", qty: `${totalPeople * 2} lbs`, cat: "Sweeteners" },
      { item: "Water (1 gal/person/day)", qty: `${totalPeople * 14} gallons`, cat: "Water" },
    ],
  };

  const foodPlan = foodPlans[philosophy] || foodPlans.balanced;
  const grouped = foodPlan.reduce((acc, item) => {
    if (!acc[item.cat]) acc[item.cat] = [];
    acc[item.cat].push(item);
    return acc;
  }, {});

  // Container assignments (simplified)
  const containerCount = Math.ceil((totalPeople * 1.9 * months) / 0.57);
  const containers = Array.from({ length: Math.min(containerCount, 24) }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 4));
    const slot = (i % 4) + 1;
    return { code: `${row}-${slot}`, tier: containerTier };
  });

  const philosophyLabel = { wholeFood: "Whole Foods First", balanced: "Balanced Mix", freezeDried: "Freeze-Dried", noPreference: "Best Value" }[philosophy] || "Balanced Mix";
  const containerLabel = { good: "Essential", better: "Premium", best: "Professional", none: "None" }[containerTier] || "Essential";

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
          <div>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "32px" }}>
              {[
                { label: "Coverage Goal", value: `${months} months`, icon: "🎯" },
                { label: "Household", value: `${totalPeople} people`, icon: "👥" },
                { label: "Food Philosophy", value: philosophyLabel, icon: "🌾" },
                { label: "Monthly Budget", value: `$${budget}/mo`, icon: "💰" },
                { label: "Est. Completion", value: `~${Math.ceil(((totalPeople * 1.9 * months * 1.1) * 8) / productBudget)} months`, icon: "📅" },
                { label: "Container System", value: containerLabel, icon: "📦" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "10px", padding: "16px 18px" }}>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{icon}</div>
                  <div style={{ fontSize: "11px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.3px" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Month 1 — ALWAYS VISIBLE */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Month 1 of {months}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.5px" }}>Your First Shipment</div>
                </div>
                <div style={{ background: "#EDF2E8", borderRadius: "8px", padding: "8px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif" }}>Budget</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: COLORS.moss }}>${productBudget}</div>
                </div>
              </div>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "4px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", padding: "8px 0 4px", borderBottom: `1px dashed ${COLORS.mist}`, marginBottom: "2px" }}>{cat}</div>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 8px", borderBottom: `1px solid ${COLORS.cream}`, fontSize: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                      <span style={{ color: COLORS.bark }}>{item.item}</span>
                      <span style={{ fontWeight: "700", color: COLORS.moss, whiteSpace: "nowrap", marginLeft: "12px" }}>{item.qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Months 2+ — LOCKED in preview */}
            {months > 1 && Array.from({ length: Math.min(months - 1, 3) }, (_, i) => i + 2).map(monthNum => (
              <div key={monthNum} style={{ position: "relative", marginBottom: "12px" }}>
                {/* Blurred content */}
                <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "28px", filter: isPreview ? "blur(4px)" : "none", userSelect: "none", pointerEvents: isPreview ? "none" : "auto" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "6px", fontFamily: "'Helvetica Neue', sans-serif" }}>Month {monthNum} of {months}</div>
                  <div style={{ fontSize: "22px", fontWeight: "700", color: COLORS.bark, marginBottom: "16px" }}>Shipment {monthNum}</div>
                  {Object.keys(grouped).slice(0, 3).map(cat => (
                    <div key={cat}>
                      <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", padding: "8px 0 4px", borderBottom: `1px dashed ${COLORS.mist}` }}>{cat}</div>
                      {(grouped[cat] || []).slice(0, 3).map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 8px", borderBottom: `1px solid ${COLORS.cream}`, fontSize: "14px", fontFamily: "'Helvetica Neue', sans-serif" }}>
                          <span>{item.item}</span>
                          <span style={{ fontWeight: "700", color: COLORS.moss }}>{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Lock overlay */}
                {isPreview && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "12px", background: "rgba(247,243,237,0.6)" }}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>🔒</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: COLORS.bark, marginBottom: "6px", letterSpacing: "-0.3px" }}>Month {monthNum} unlocks when you activate</div>
                    <div style={{ fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginBottom: "16px" }}>Your full {months}-month plan is ready and waiting</div>
                    <button
                      onClick={() => setShowActivate(true)}
                      style={{ background: COLORS.moss, color: COLORS.white, border: "none", borderRadius: "8px", padding: "11px 22px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Helvetica Neue', sans-serif" }}
                    >
                      Activate My Plan →
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isPreview && months > 4 && (
              <div style={{ textAlign: "center", padding: "20px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", fontSize: "13px" }}>
                + {months - 4} more months in your plan — all unlock on activation
              </div>
            )}
          </div>
        )}

        {/* ── Container Map Tab ── */}
        {activeTab === "containers" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "8px", fontFamily: "'Helvetica Neue', sans-serif" }}>Your Storage Map</div>
              <div style={{ fontSize: "28px", fontWeight: "700", color: COLORS.bark, letterSpacing: "-0.8px", marginBottom: "8px" }}>~{containerCount} containers</div>
              <div style={{ fontSize: "14px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif" }}>
                {containerLabel} tier · {totalPeople} people · {months} months coverage
              </div>
            </div>
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: "10px" }}>
                {containers.map((c, i) => (
                  <div key={i} style={{ background: COLORS.cream, border: `1px solid ${COLORS.mist}`, borderRadius: "6px", padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.moss, fontFamily: "'Helvetica Neue', sans-serif" }}>{c.code}</div>
                    <div style={{ fontSize: "10px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", marginTop: "2px" }}>{containerLabel}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "20px", padding: "14px 18px", background: COLORS.cream, borderRadius: "8px", fontSize: "13px", color: COLORS.stone, fontFamily: "'Helvetica Neue', sans-serif", lineHeight: "1.6" }}>
                📋 When your plan activates, each container gets a printed label and your portal shows exactly which items go in which container — updated with every shipment.
              </div>
            </div>
          </div>
        )}

        {/* ── Billing Tab ── */}
        {activeTab === "billing" && (
          <div>
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.mist}`, borderRadius: "12px", padding: "28px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.clay, marginBottom: "16px", fontFamily: "'Helvetica Neue', sans-serif" }}>Monthly billing breakdown</div>
              {[
                { label: "QuietReady Membership", desc: "Portal access, rotation tracking, recipe guide", amount: "$30.00", recurring: true },
                { label: "Food Supply Fulfillment", desc: `Month 1 of ~${Math.ceil(((totalPeople * 1.9 * months * 1.1) * 8) / productBudget)}`, amount: `$${productBudget}.00`, recurring: false },
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
          onActivated={(updatedCustomer) => {
            setShowActivate(false);
            onActivated(updatedCustomer);
          }}
          onClose={() => setShowActivate(false)}
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
            { step: "01", title: "Answer 8 questions", desc: "Tell us about your household, storage space, dietary needs, and budget." },
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | questionnaire | portal | setpassword
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

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
    const type = params.get("type"); // "magiclink" | "signup" | "recovery"

    if (accessToken && (type === "magiclink" || type === "signup")) {
      localStorage.setItem("qr_token", accessToken);
      setAuthToken(accessToken);
      setNewPasswordToken(accessToken); // prompt for password first
      window.history.replaceState(null, "", window.location.pathname);
      setScreen("setpassword");
    } else if (accessToken && type === "recovery") {
      setNewPasswordToken(accessToken);
      window.history.replaceState(null, "", window.location.pathname);
      setScreen("setpassword");
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

  const steps = ["household", "dietary", "foodPhilosophy", "storage", "coverageBudget", "utilities", "equipment", "containers", "plan", "success"];
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
          <button style={{ ...styles.ctaButton, padding: "10px 24px", fontSize: "12px" }} onClick={() => setScreen("questionnaire")}>
            Get Started
          </button>
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
