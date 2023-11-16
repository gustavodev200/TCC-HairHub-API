export function translatePaymentTypes(payment_type: string) {
  const statusProps: Record<string, string> = {
    money: "Dinheiro",
    debit_card: "Cartão de Debito",
    credit_card: "Cartão de Credito",
    pix: "Pix",
  };

  return statusProps[payment_type];
}
