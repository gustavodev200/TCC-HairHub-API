export function abbreviateFullName(fullName: string): string {
  const nameParts = fullName.split(" ");

  const firstName = nameParts[0];

  const secondPart = nameParts[1] || "";
  const firstLetterSecondName = secondPart.charAt(0);

  const abbreviatedName = `${firstName} ${firstLetterSecondName.toUpperCase()}`;

  return abbreviatedName;
}
