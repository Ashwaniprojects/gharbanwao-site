import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCalculatorConfig } from "@/lib/api";
import { computeEstimate } from "@/lib/calc";

const CalcContext = createContext(null);

export function CalcProvider({ children }) {
  const [inputs, setInputs] = useState({ state: "Uttar Pradesh", city: "Lucknow", area: 1500, unit: "sqft" });
  const [qualities, setQualities] = useState({});
  const [step, setStep] = useState(1);
  const { data: config, isLoading, isError } = useQuery({ queryKey: ["calc-config"], queryFn: fetchCalculatorConfig });

  const estimate = useMemo(() => (config ? computeEstimate(config, { ...inputs, qualities }) : null), [config, inputs, qualities]);

  const value = {
    config,
    isLoading,
    isError,
    inputs,
    setInput: (k, v) => setInputs((p) => ({ ...p, [k]: v })),
    qualities,
    setQuality: (k, v) => setQualities((p) => ({ ...p, [k]: v })),
    resetQualities: () => setQualities({}),
    step,
    setStep,
    estimate,
  };
  return <CalcContext.Provider value={value}>{children}</CalcContext.Provider>;
}

export const useCalc = () => useContext(CalcContext);
