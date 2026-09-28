// Досрочное погашение аннуитетного кредита: разовая сумма после k-го платежа,
// дальше — либо тот же платёж и меньший срок, либо тот же срок и меньший платёж.
// Проценты — помесячно (ставка/12). Банки КР обычно начисляют по фактическим дням,
// поэтому результат ориентировочный (расхождение — единицы процентов от переплаты).

export interface EarlyRepaymentInput {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  extraPayment: number;
  afterPayment: number; // досрочная сумма вносится после этого очередного платежа
}

export interface ScenarioResult {
  monthlyPayment: number; // платёж после досрочного погашения
  months: number; // общий срок, включая уже внесённые платежи
  totalInterest: number;
  totalPaid: number; // все платежи + досрочная сумма
}

export interface EarlyRepaymentResult {
  base: ScenarioResult;
  reduceTerm: ScenarioResult;
  reducePayment: ScenarioResult;
  balanceBeforeExtra: number;
  extraApplied: number;
}

export const annuityPayment = (principal: number, monthlyRate: number, months: number) => {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
};

export const calculateEarlyRepayment = (input: EarlyRepaymentInput): EarlyRepaymentResult | null => {
  const { principal, annualRatePercent, termMonths } = input;
  if (!(principal > 0) || !(termMonths >= 1) || annualRatePercent < 0) return null;
  const i = annualRatePercent / 100 / 12;
  const payment = annuityPayment(principal, i, termMonths);
  const afterPayment = Math.min(Math.max(0, Math.floor(input.afterPayment)), termMonths - 1);

  const base: ScenarioResult = {
    monthlyPayment: payment,
    months: termMonths,
    totalInterest: payment * termMonths - principal,
    totalPaid: payment * termMonths
  };

  let balance = principal;
  let interestPaid = 0;
  for (let m = 0; m < afterPayment; m++) {
    const interest = balance * i;
    interestPaid += interest;
    balance -= payment - interest;
  }
  const balanceBeforeExtra = balance;
  const extraApplied = Math.min(Math.max(0, input.extraPayment), balance);
  const remainingAfterExtra = balance - extraApplied;
  const paidSoFar = payment * afterPayment + extraApplied;

  // Уменьшить срок: платёж прежний, пока долг не закроется (последний — остаток).
  let b = remainingAfterExtra;
  let months = afterPayment;
  let interestTerm = interestPaid;
  let paidTerm = paidSoFar;
  while (b > 0.005 && months < termMonths + 1) {
    const interest = b * i;
    const due = Math.min(payment, b + interest);
    interestTerm += interest;
    paidTerm += due;
    b = b + interest - due;
    months++;
  }
  const reduceTerm: ScenarioResult = { monthlyPayment: payment, months, totalInterest: interestTerm, totalPaid: paidTerm };

  // Уменьшить платёж: срок прежний, платёж пересчитан на остаток долга.
  const remainingMonths = termMonths - afterPayment;
  const newPayment = remainingAfterExtra > 0 ? annuityPayment(remainingAfterExtra, i, remainingMonths) : 0;
  const reducePayment: ScenarioResult = {
    monthlyPayment: newPayment,
    months: remainingAfterExtra > 0 ? termMonths : afterPayment,
    totalInterest: interestPaid + (newPayment * remainingMonths - remainingAfterExtra),
    totalPaid: paidSoFar + newPayment * remainingMonths
  };

  return { base, reduceTerm, reducePayment, balanceBeforeExtra, extraApplied };
};
